import { JSDOM, VirtualConsole } from "jsdom";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";

const root = path.resolve("build");
const nfts = JSON.parse(await readFile("src/generated/nfts.json", "utf8"));
const research = JSON.parse(
  await readFile("src/generated/research.json", "utf8"),
);
const template = await readFile("build/index.html", "utf8");
const scripts = [...template.matchAll(/src="(\/static\/js\/[^\"]+)"/g)].map(
  (match) => match[1],
);
const bundles = await Promise.all(
  scripts.map((file) => readFile(path.join(root, file), "utf8")),
);
const pause = () => new Promise((resolve) => setTimeout(resolve, 25));
let fetches = 0;
async function load(route, storage = {}, options = {}) {
  const url = new URL(route, "https://nftarchaeology.io");
  const file =
    url.pathname === "/"
      ? "index.html"
      : url.pathname.replace(/^\/|\/$/g, "") + "/index.html";
  let html;
  try {
    html = await readFile(path.join(root, file), "utf8");
  } catch {
    html = await readFile(path.join(root, "404.html"), "utf8");
  }
  const errors = [];
  const console = new VirtualConsole();
  console.on("jsdomError", (error) => errors.push(error.message));
  console.on("error", (...messages) => errors.push(messages.join(" ")));
  const dom = new JSDOM(html, {
    url: url.href,
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole: console,
  });
  const window = dom.window;
  window.scrollTo = () => {};
  window.matchMedia = () => ({
    matches: !!options.reducedMotion,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
  Object.defineProperty(window.navigator, "clipboard", {
    value: {
      writeText: async (value) => {
        window.__copied = value;
      },
    },
  });
  window.URL.createObjectURL = () => "blob:archive-test";
  window.URL.revokeObjectURL = () => {};
  for (const [key, value] of Object.entries(storage))
    window.localStorage.setItem(key, value);
  window.fetch = async (value) => {
    fetches++;
    assert(
      String(value).startsWith("/data/contracts/"),
      "Unexpected runtime network request",
    );
    const json = JSON.parse(
      await readFile(path.join(root, String(value)), "utf8"),
    );
    return { ok: true, json: async () => json };
  };
  for (const bundle of bundles) window.eval(bundle);
  await pause();
  return {
    dom,
    window,
    doc: window.document,
    errors,
    close: () => {
      assert.deepEqual(errors, [], `Runtime or hydration errors at ${route}`);
      window.close();
    },
  };
}
const button = (doc, text) =>
  [...doc.querySelectorAll("button")].find(
    (node) => node.textContent.trim() === text,
  );
const click = async (node) => {
  assert(node, "Missing control");
  node.click();
  await pause();
};
const change = async (window, input, value) => {
  const setter = Object.getOwnPropertyDescriptor(
    input instanceof window.HTMLSelectElement
      ? window.HTMLSelectElement.prototype
      : input instanceof window.HTMLTextAreaElement
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype,
    "value",
  ).set;
  setter.call(input, value);
  input.dispatchEvent(
    new window.Event(
      input instanceof window.HTMLSelectElement ? "change" : "input",
      { bubbles: true },
    ),
  );
  await pause();
};

for (const route of [
  "/",
  "/explore",
  "/timeline",
  "/faq",
  "/about",
  "/compare",
  ...nfts.map((n) => "/nft-details/" + n.slug),
  "/does-not-exist",
]) {
  const page = await load(route);
  assert(page.doc.querySelector("main").textContent.trim().length > 40, route);
  assert(!page.doc.body.textContent.includes("NaN"), route);
  assert(!page.doc.body.textContent.includes("Flame Dress"), route);
  if (route === "/does-not-exist")
    assert(page.doc.body.textContent.includes("A trail gone cold"));
  page.close();
}
let galleryPage = await load("/");
assert.equal(galleryPage.doc.querySelectorAll(".flow-column").length, 3);
await click(button(galleryPage.doc, "Ⅱ Pause & browse"));
assert(galleryPage.doc.querySelector(".flow-artwork.is-paused"));
assert(
  [
    ...galleryPage.doc.querySelectorAll(".flow-group:not(.flow-duplicate) a"),
  ].every((link) => link.tabIndex === 0),
);
await click(button(galleryPage.doc, "▶ Animate artwork"));
assert(!galleryPage.doc.querySelector(".flow-artwork.is-paused"));
galleryPage.close();
galleryPage = await load("/", {}, { reducedMotion: true });
assert(galleryPage.doc.querySelector(".flow-artwork.is-paused"));
assert(button(galleryPage.doc, "Reduced motion: still gallery").disabled);
galleryPage.close();
let page = await load(
  "/explore?q=0X015A06A433353F8DB634DF4EDDF0C109882A15AB&view=table",
);
assert.equal(page.doc.querySelectorAll("tbody tr").length, 1);
assert(page.doc.querySelector("tbody").textContent.includes("PixelMap"));
await change(
  page.window,
  page.doc.querySelector("select[aria-label],.sort-label select"),
  "newest",
);
assert(page.window.location.search.includes("sort=newest"));
page.close();

page = await load("/explore");
await click(button(page.doc, "+ Save"));
assert.equal(
  JSON.parse(page.window.localStorage.getItem("nft-archive:saved")).length,
  1,
);
await click(button(page.doc, "⇄ Compare"));
assert(page.doc.querySelector(".compare-tray"));
await click(button(page.doc, "Table"));
assert.equal(page.doc.querySelectorAll("tbody tr").length, nfts.length);
await click(button(page.doc, "Clear selection"));
assert(!page.doc.querySelector(".compare-tray"));
await change(
  page.window,
  page.doc.querySelector(".theme-control select"),
  "light",
);
assert.equal(page.doc.documentElement.dataset.theme, "light");
const year = page.doc.querySelector(".desktop-filters fieldset input");
await click(year);
assert(page.window.location.search.includes("year="));
await change(page.window, page.doc.querySelector("#archive-search"), "etheria");
page.doc
  .querySelector(".search")
  .dispatchEvent(
    new page.window.Event("submit", { bubbles: true, cancelable: true }),
  );
await pause();
assert.equal(
  new URLSearchParams(page.window.location.search).get("year"),
  "2015",
);
assert.equal(
  new URLSearchParams(page.window.location.search).get("q"),
  "etheria",
);
assert.equal(page.doc.querySelectorAll("tbody tr").length, 1);
page.close();

page = await load("/explore?saved=1", { "nft-archive:saved": '["pixelmap"]' });
assert.equal(page.doc.querySelectorAll(".collection-card").length, 1);
assert(
  page.doc.querySelector(".collection-card").textContent.includes("PixelMap"),
);
page.close();
page = await load("/compare?ids=pixelmap,etheria");
assert.equal(page.doc.querySelectorAll("thead th").length, 3);
await click(button(page.doc, "Remove"));
assert.equal(page.doc.querySelectorAll("thead th").length, 2);
page.close();

page = await load("/research?funded=1&sort=eth");
assert(!page.doc.body.textContent.includes("ETH held is not ETH claimable."));
assert(page.doc.body.textContent.includes("EtherId registrar (June 2016)"));
const balances = [...page.doc.querySelectorAll("tbody tr")].map(
  (row) => row.children[4].childNodes[0].textContent,
);
assert(balances.length > 0);
for (let i = 1; i < balances.length; i++)
  assert(Number(balances[i - 1]) >= Number(balances[i]));
await click(button(page.doc, "Next →"));
assert(page.window.location.search.includes("page=2"));
page.close();
page = await load("/research?q=EtherId");
assert(page.doc.querySelector("tbody").textContent.includes("EtherId registrar"));
const etherIdLink = [...page.doc.querySelectorAll("tbody a")].find((link) => link.textContent.includes("EtherId registrar")).getAttribute("href");
page.close();
page = await load(etherIdLink);
assert(page.doc.body.textContent.includes("byte for byte"));
assert(page.doc.body.textContent.includes("Solidity 0.3.5"));
await click(button(page.doc, "Inspect captured bytecode and verified source"));
assert(page.doc.body.textContent.includes("Recompiled ABI · matched deployment"));
page.close();
page = await load("/research/0x92f9c5992c7a6141836e624dc02fc958b1ca187d");
assert.equal(page.doc.querySelector("h1").textContent, "DocumentRegistry");
assert(page.doc.body.textContent.includes("Contract name evidence"));
page.close();
page = await load("/research/0x6489fc370c7df314ee0bdfb1fbd185f1bc457d89");
assert(page.doc.body.textContent.includes("optimizer enabled"));
page.close();
const address =
  research.find(
    (row) => row.sourceRuntimeAgrees && row.preliminaryNotes?.length,
  )?.address || research[0].address;
page = await load("/research/" + address);
assert(page.doc.body.textContent.includes("Deployment and activity"));
assert(page.doc.body.textContent.includes("Refreshed balance at block 26,444,268"));
await click(button(page.doc, "Inspect captured bytecode and verified source"));
assert(page.doc.querySelector(".bytecode").textContent.startsWith("0x"));
assert(page.doc.body.textContent.includes("Creation transaction"));
assert(page.doc.body.textContent.includes("Indexed ETH flow samples"));
const worksheet = page.doc.querySelector(".research-worksheet");
await change(page.window, worksheet.querySelector("select"), "Possible NFT");
worksheet.dispatchEvent(
  new page.window.Event("submit", { bubbles: true, cancelable: true }),
);
await pause();
assert.equal(
  JSON.parse(
    page.window.localStorage.getItem("nft-archive:research-draft:" + address),
  ).nftStatus,
  "Possible NFT",
);
assert(
  page.doc.body.textContent.includes("has not been published or reviewed"),
);
page.close();
assert.equal(
  fetches,
  2,
  "Only the two explicit evidence inspections should fetch local artifacts.",
);
console.log(
  `Production DOM checks passed: ${nfts.length} collection pages, static hydration, search/address matches, filtering, sorting, table, bookmarks, theme, compare, research funding/pagination, contract evidence and local draft persistence. Visual layout requires browser QA.`,
);
