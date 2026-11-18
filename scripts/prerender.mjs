import { build } from "esbuild";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const root = fileURLToPath(new URL("../", import.meta.url));
const cache = path.join(root, ".cache");
await mkdir(cache, { recursive: true });
const output = path.join(cache, "prerender.cjs");
await build({
  entryPoints: [path.join(root, "scripts/prerender-entry.jsx")],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: output,
  external: ["react", "react-dom", "react-dom/server"],
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});
const require = createRequire(import.meta.url);
const { routes, render, metadataFor } = require(output);
const template = await readFile(path.join(root, "build/index.html"), "utf8");
const social = await readFile(path.join(root, "public/share.svg"), "utf8");
await writeFile(
  path.join(root, "build/share.png"),
  new Resvg(social).render().asPng(),
);
const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const imageFor = (route) => {
  const meta = metadataFor(route);
  return `https://nftarchaeology.io${meta.image || "/share.png"}`;
};
for (const route of [...routes, "/404"]) {
  const meta = metadataFor(route);
  const canonical = `https://nftarchaeology.io${route === "/" ? "/" : route + "/"}`;
  const tags = `<link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="NFT Archaeology"><meta property="og:title" content="${escape(meta.title)}"><meta property="og:description" content="${escape(meta.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${imageFor(route)}"><meta name="twitter:card" content="summary_large_image">${route.startsWith("/research/") || route === "/404" ? '<meta name="robots" content="noindex,follow">' : ""}`;
  const html = template
    .replace(/<title>.*?<\/title>/, "<title>" + escape(meta.title) + "</title>")
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?\s*>/,
      `<meta name="description" content="${escape(meta.description)}">`,
    )
    .replace("</head>", tags + "</head>")
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);
  const target =
    route === "/404"
      ? path.join(root, "build/404.html")
      : route === "/"
        ? path.join(root, "build/index.html")
        : path.join(root, "build", route.slice(1), "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
}
await writeFile(
  path.join(root, "build/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
    .filter((route) => !route.startsWith("/research/") && route !== "/compare")
    .map(
      (route) =>
        `<url><loc>https://nftarchaeology.io${route === "/" ? "/" : route + "/"}</loc></url>`,
    )
    .join("")}</urlset>`,
);
console.log(`Prerendered ${routes.length} routes, plus a real 404 page.`);
await rm(output, { force: true });
