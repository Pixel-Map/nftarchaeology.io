import React from "react";
import { Link } from "react-router-dom";
import { nfts, unresolved } from "./data";
import { CollectionCard, Search } from "./components";
import FlowGallery from "./FlowGallery";

export default function Home() {
  return (
    <>
      <section className="hero page-wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> A community archive · Ethereum,
            2015–2019
          </div>
          <p className="hero-kicker">Discover, learn, collect</p>
          <h1>#HistoricalNFTs</h1>
          <p className="lede">
            Explore the collections, contracts, and creative experiments from
            Ethereum’s earliest years.
          </p>
          <Search />
          <div className="hero-links">
            <Link to="/explore">Browse {nfts.length} collections ↗</Link>
            <Link to="/timeline">Follow the timeline →</Link>
          </div>
          <div className="hero-stats">
            <span>
              <strong>{nfts.length}</strong>documented collections
            </span>
            <span>
              <strong>2015–19</strong>years represented
            </span>
            <span>
              <strong>{unresolved.length.toLocaleString("en")}</strong>contracts
              awaiting research
            </span>
          </div>
        </div>
        <FlowGallery />
      </section>
      <section className="section page-wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Find a starting point</div>
            <h2>Different paths through history.</h2>
          </div>
          <Link to="/about">How this archive works ↗</Link>
        </div>
        <div className="path-grid">
          {[
            [
              "01",
              "Before ERC-721",
              "Explore contracts recorded as predating the ERC-721 standard.",
              "/explore?standard=Predates+ERC-721",
            ],
            [
              "02",
              "Art stored on-chain",
              "Discover collections whose source records describe on-chain asset storage.",
              "/explore?storage=On-Chain",
            ],
            [
              "03",
              "Worlds you could own",
              "Visit experiments in virtual real estate and early games.",
              "/explore?category=Real+Estate&category=Game",
            ],
          ].map(([number, title, description, url]) => (
            <Link className="path-card" key={number} to={url}>
              <span className="mono muted">{number} / READING PATH</span>
              <h3>{title} ↗</h3>
              <p>{description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="section page-wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">A chronological introduction</div>
            <h2>Early entries.</h2>
          </div>
          <Link to="/explore">View the complete index ↗</Link>
        </div>
        <div className="collection-grid home-grid">
          {nfts.slice(0, 3).map((nft) => (
            <CollectionCard nft={nft} key={nft.slug} />
          ))}
        </div>
      </section>
      <section className="research-banner page-wrap">
        <div className="eyebrow">The archive is still being written</div>
        <h2>
          Thousands of contracts.
          <br />
          Questions worth asking.
        </h2>
        <p>
          A separate research queue preserves early contract leads, bytecode
          evidence, and exact matches to known collections. Inclusion is not a
          finding that a contract is an NFT.
        </p>
        <Link className="button primary" to="/research">
          Explore the research queue ↗
        </Link>
        <Link to="/about#contribute">Help document a discovery →</Link>
      </section>
    </>
  );
}
