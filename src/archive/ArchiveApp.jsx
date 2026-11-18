import React, { useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { nfts, candidates, bySlug } from "./data";
import { ArchiveProvider } from "./state";
import { Shell } from "./components";
import Home from "./Home";
import Explore from "./Explore";
import Collection, { NotFound } from "./Collection";
import Timeline from "./Timeline";
import Compare from "./Compare";
import Research, { ResearchContract } from "./Research";
import About, { FAQ } from "./About";

export function metadataFor(pathname) {
  const id = pathname.replace(/\/$/, "").split("/").pop();
  if (pathname.startsWith("/nft-details/") && bySlug[id])
    return {
      title: `${bySlug[id].title} · NFT Archaeology`,
      description: bySlug[id].excerpt.trim(),
      image: bySlug[id].logo,
    };
  if (pathname.startsWith("/research/")) {
    const row = candidates.find((item) => item.address === id?.toLowerCase());
    if (row)
      return {
        title: `${row.name || row.address} · the 0xzxch list`,
        description: `Unresolved research contract ${row.address}. Block-pinned runtime code, ETH balance, source evidence, and an evaluation worksheet. Inclusion does not establish NFT status.`,
      };
  }
  const names = {
    "/": [
      "Historical NFTs · NFT Archaeology.io",
      `Explore ${nfts.length} documented Ethereum collections from 2015–2019, original contracts, and a separate research queue.`,
    ],
    "/explore": [
      "Collection index · NFT Archaeology",
      "Search early Ethereum collections by name, creator, or contract. Compare deployment dates, storage, standards, supply, and recorded concerns.",
    ],
    "/timeline": [
      "Timeline · NFT Archaeology",
      "A chronological guide to documented early Ethereum collections, with original deployment dates and source records.",
    ],
    "/research": [
      "the 0xzxch list · Needs research",
      "Early Ethereum contract leads attributed to 0xzxch. Every address has block-pinned code and balance evidence; NFT status and ETH recoverability require research.",
    ],
    "/compare": [
      "Compare collections · NFT Archaeology",
      "Compare original contracts, wrappers, dates, supply, storage, and recorded concerns for up to four historical collections.",
    ],
    "/about": [
      "Scope & methodology · NFT Archaeology",
      "How the archive preserves source evidence, handles uncertainty, and accepts researched contributions.",
    ],
    "/faq": [
      "Frequently asked questions · NFT Archaeology",
      "Definitions, source provenance, wrappers, research candidates, and how to read the archive.",
    ],
  };
  const value = names[pathname.replace(/\/$/, "") || "/"];
  return {
    title: value?.[0] || "Page not found · NFT Archaeology",
    description:
      value?.[1] ||
      "This page is not in the archive. Search the collection index or research queue.",
  };
}

function PageEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const meta = metadataFor(pathname);
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
    if (hash) {
      try {
        document
          .getElementById(decodeURIComponent(hash.slice(1)))
          ?.scrollIntoView();
      } catch {
        /* Ignore malformed URL fragments without interrupting the page. */
      }
    } else {
      window.scrollTo(0, 0);
      document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, [pathname, hash]);
  return null;
}

export default function ArchiveApp() {
  return (
    <ArchiveProvider>
      <Shell>
        <PageEffects />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/nft-details/:id" element={<Collection />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/:address" element={<ResearchContract />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help-center" element={<Navigate to="/faq" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
    </ArchiveProvider>
  );
}
