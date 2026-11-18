import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("build");
const source = JSON.parse(await readFile("src/generated/source.json", "utf8"));
const nfts = JSON.parse(await readFile("src/generated/nfts.json", "utf8"));
const research = JSON.parse(
  await readFile("src/generated/research.json", "utf8"),
);
const failures = [];
const external = new Set();
async function walk(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (item.isDirectory())
      files.push(...(await walk(path.join(directory, item.name))));
    else if (item.name.endsWith(".html"))
      files.push(path.join(directory, item.name));
  }
  return files;
}
const pages = await walk(root);
for (const filename of pages) {
  const html = await readFile(filename, "utf8");
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const destination = value.replace(/&amp;/g, "&");
    if (destination.startsWith("http")) {
      try {
        const url = new URL(destination);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
        external.add(destination);
      } catch {
        failures.push(`${filename}: malformed URL ${destination}`);
      }
    } else if (destination.startsWith("/") && !destination.startsWith("//")) {
      const clean = decodeURIComponent(destination.split(/[?#]/)[0]);
      const target = path.join(root, clean);
      try {
        const file = await stat(target);
        if (file.isDirectory()) await stat(path.join(target, "index.html"));
      } catch {
        failures.push(`${filename}: missing local target ${clean}`);
      }
    } else if (
      destination.startsWith("#") &&
      destination.length > 1 &&
      !html.includes(`id="${destination.slice(1)}"`)
    )
      failures.push(`${filename}: missing anchor ${destination}`);
  }
}
const placeholders = nfts
  .filter((nft) => nft.openseaCollection?.includes("/placeholder"))
  .map((nft) => ({
    slug: nft.slug,
    field: "openseaCollection",
    value: nft.openseaCollection,
    action: "Omitted from UI; upstream evidence needed for a replacement.",
  }));
console.log(
  JSON.stringify(
    {
      pages: pages.length,
      researchArtifacts: research.length,
      source,
      localFailures: failures.slice(0, 30),
      sourcePlaceholders: placeholders,
      uniqueExternalDestinations: external.size,
    },
    null,
    2,
  ),
);
if (failures.length)
  throw new Error(`${failures.length} broken local references.`);
// External availability checks are optional: network errors never rewrite editorial data.
if (process.argv.includes("--external")) {
  let healthy = 0,
    unresolved = 0;
  const urls = [
    ...new Set(
      nfts
        .flatMap((nft) => [
          nft.website,
          nft.discord,
          nft.openseaCollection,
          ...(nft.relatedLinks || []).map((link) => link.link),
        ])
        .filter(Boolean),
    ),
  ];
  const receipts = [];
  for (let index = 0; index < urls.length; index += 4) {
    await Promise.all(
      urls.slice(index, index + 4).map(async (url) => {
        try {
          const response = await fetch(url, {
            method: "HEAD",
            redirect: "follow",
            signal: AbortSignal.timeout(10000),
          });
          receipts.push({
            url,
            status: response.status,
            finalURL: response.url,
          });
          if (response.ok) healthy++;
          else unresolved++;
        } catch (error) {
          receipts.push({ url, error: error.message });
          unresolved++;
        }
      }),
    );
  }
  const { writeFile, mkdir } = await import("node:fs/promises");
  await mkdir(".cache", { recursive: true });
  await writeFile(
    ".cache/external-link-check.json",
    JSON.stringify(
      { checkedAt: new Date().toISOString(), healthy, unresolved, receipts },
      null,
      2,
    ),
  );
  console.log(
    `External availability: ${healthy} successful, ${unresolved} unresolved (including bot restrictions). Receipts: .cache/external-link-check.json`,
  );
}
