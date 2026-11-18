import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { date, source, sourceFile, shortAddress } from "./data";
import { useArchive } from "./state";

export function Search({ initial = "", research = false }) {
  const location = useLocation();
  const [value, setValue] = useState(initial);
  const navigate = useNavigate();
  useEffect(() => setValue(initial), [initial]);
  return (
    <form
      className="search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const base = research ? "/research" : "/explore";
        const params = new URLSearchParams(
          location.pathname.replace(/\/$/, "") === base ? location.search : "",
        );
        params.delete("q");
        params.delete("page");
        if (value.trim()) params.set("q", value.trim());
        navigate(`${base}?${params}`);
      }}
    >
      <label
        className="sr-only"
        htmlFor={research ? "research-search" : "archive-search"}
      >
        {research
          ? "Search research contracts"
          : "Search collections or contract addresses"}
      </label>
      <input
        id={research ? "research-search" : "archive-search"}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={
          research
            ? "Contract name, address, or method…"
            : "Search a collection, creator, or contract…"
        }
      />
      <button type="submit">
        Search <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}

export function Shell({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);
  const { saved, compare, setCompare, theme, changeTheme, notice, setNotice } =
    useArchive();
  const menuRef = useRef(null);
  useEffect(() => {
    setMenu(false);
  }, [pathname]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="wordmark" to="/" aria-label="NFT Archaeology home">
            <span className="monogram" aria-hidden="true">
              N<span> / </span>A
            </span>
            <span>
              NFT
              <br />
              <strong>ARCHAEOLOGY</strong>
            </span>
          </Link>
          <button
            className="menu-toggle"
            aria-expanded={menu}
            aria-controls="site-nav"
            onClick={() => setMenu(!menu)}
          >
            Menu {menu ? "−" : "+"}
          </button>
          <nav
            id="site-nav"
            className={menu ? "nav open" : "nav"}
            aria-label="Main navigation"
            ref={menuRef}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setMenu(false);
                document.querySelector(".menu-toggle")?.focus();
              }
            }}
          >
            <NavLink to="/explore">Collections</NavLink>
            <NavLink to="/timeline">Timeline</NavLink>
            <NavLink to="/research">Needs research</NavLink>
            <NavLink to="/about">About & contribute</NavLink>
            <Link to="/explore?saved=1">
              Saved <span className="count">{saved.length}</span>
            </Link>
          </nav>
          <label className="theme-control">
            <span className="sr-only">Color theme</span>
            <select
              value={theme}
              onChange={(event) => changeTheme(event.target.value)}
            >
              <option value="system">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </header>
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
      <main id="main" tabIndex="-1">
        {children}
      </main>
      {compare.length > 0 && (
        <aside className="compare-tray" aria-label="Comparison selection">
          <span>
            <strong>{compare.length}/4</strong> collections selected
          </span>
          <Link
            className="button primary"
            to={`/compare?ids=${compare.join(",")}`}
          >
            Compare collections ↗
          </Link>
          <button
            onClick={() => {
              setCompare([]);
              if (pathname.startsWith("/compare")) navigate("/compare");
            }}
          >
            Clear selection
          </button>
        </aside>
      )}
      <footer className="site-footer">
        <div>
          <Link className="footer-title" to="/">
            NFT Archaeology
          </Link>
          <p>
            A community archive of early Ethereum collections.
            <br />
            Maintained by the team behind PixelMap and contributing researchers.
          </p>
        </div>
        <div>
          <Link to="/about">Scope & methodology</Link>
          <Link to="/faq">Frequently asked questions</Link>
          <Link to="/research">Research queue</Link>
        </div>
        <div>
          <a href={source.repository}>Contribute on GitHub ↗</a>
          <a href="/data/catalogue.json" download>
            Download catalogue JSON ↓
          </a>
          <a href={`${source.repository}/tree/${source.revision}`}>
            Source revision {source.revision.slice(0, 7)} ↗
          </a>
        </div>
        <p className="footer-note">
          Historical records describe a source snapshot. Current project status
          and external destinations may have changed. Research candidates are
          not confirmed NFTs.
        </p>
      </footer>
    </>
  );
}

export function CopyAddress({ address }) {
  const [status, setStatus] = useState("");
  return (
    <span className="copy-address">
      <code>{address}</code>
      <button
        type="button"
        aria-label={`Copy address ${address}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(address);
            setStatus("Copied");
          } catch {
            setStatus("Copy unavailable; select the address text.");
          }
        }}
      >
        {status === "Copied" ? "Copied ✓" : "Copy"}
      </button>
      <span role="status" className={status === "Copied" ? "sr-only" : "muted"}>
        {status}
      </span>
    </span>
  );
}

export function CollectionActions({ nft }) {
  const { saved, toggleSaved, compare, toggleCompare } = useArchive();
  return (
    <div className="collection-actions">
      <button
        aria-pressed={saved.includes(nft.slug)}
        onClick={() => toggleSaved(nft.slug)}
      >
        {saved.includes(nft.slug) ? "✓ Saved" : "+ Save"}
      </button>
      <button
        aria-pressed={compare.includes(nft.slug)}
        onClick={() => toggleCompare(nft.slug)}
      >
        {compare.includes(nft.slug) ? "✓ Comparing" : "⇄ Compare"}
      </button>
    </div>
  );
}

export function ConcernBadge({ nft }) {
  return (
    <span className={`badge ${nft.flags.length ? "concern" : "quiet"}`}>
      {nft.flags.length
        ? `${nft.flags.length} recorded concern${nft.flags.length === 1 ? "" : "s"}`
        : "No recorded concerns"}
    </span>
  );
}

export function CollectionCard({ nft }) {
  const location = useLocation();
  return (
    <article className="collection-card">
      <Link
        className="collection-art"
        to={`/nft-details/${nft.slug}`}
        state={{ from: location.pathname + location.search }}
      >
        <img
          src={nft.logo}
          alt={`${nft.title} collection artwork`}
          loading="lazy"
          width="360"
          height="300"
        />
        <span className="art-date">{date(nft.deployedAt)}</span>
      </Link>
      <div className="card-body">
        <div className="eyebrow">{nft.standard}</div>
        <h3>
          <Link
            to={`/nft-details/${nft.slug}`}
            state={{ from: location.pathname + location.search }}
          >
            {nft.title}
          </Link>
        </h3>
        <p className="card-excerpt">{nft.excerpt}</p>
        <div className="badges">
          <span className="badge">{nft.assetDataLocation}</span>
          <ConcernBadge nft={nft} />
        </div>
        <CollectionActions nft={nft} />
      </div>
    </article>
  );
}

export function Provenance({ nft }) {
  return (
    <aside className="provenance">
      <h3>Record provenance</h3>
      <p>
        This entry reflects the community source snapshot. An editorial review
        date is not recorded; website publication does not imply a fresh review.
      </p>
      <a href={sourceFile(nft)}>Read original YAML ↗</a>
      <a href={`${source.repository}/commits/main/nfts/${nft.slug}.yaml`}>
        View record history ↗
      </a>
      <span className="mono muted">
        Snapshot {source.revision.slice(0, 12)}
      </span>
    </aside>
  );
}

export function Empty({ title = "No collections match", children }) {
  return (
    <div className="empty">
      <span className="empty-symbol" aria-hidden="true">
        ∅
      </span>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
export function PageHead({ label, title, children }) {
  return (
    <header className="page-head">
      <div className="eyebrow">{label}</div>
      <h1>{title}</h1>
      {children && <div className="lede">{children}</div>}
    </header>
  );
}
export function ContractLink({ address }) {
  return (
    <a
      className="mono"
      href={`https://etherscan.io/address/${address}#code`}
      title={address}
    >
      {shortAddress(address)} ↗
    </a>
  );
}
