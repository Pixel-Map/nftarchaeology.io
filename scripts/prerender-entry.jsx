import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import ArchiveApp, { metadataFor } from "../src/archive/ArchiveApp";
import { nfts, candidates } from "../src/archive/data";

export const routes = [
  "/",
  "/explore",
  "/timeline",
  "/compare",
  "/research",
  "/about",
  "/faq",
  ...nfts.map((n) => `/nft-details/${n.slug}`),
  ...candidates.map((row) => `/research/${row.address}`),
];
export { metadataFor };
export function render(route) {
  return renderToString(
    <StaticRouter location={route}>
      <ArchiveApp />
    </StaticRouter>,
  );
}
