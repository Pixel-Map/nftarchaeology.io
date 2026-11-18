import React from "react";
import ReactMarkdown from "react-markdown";
import { Link, useLocation, useParams } from "react-router-dom";
import { bySlug, nfts, date, marketURL, sourceFile, correction } from "./data";
import {
  CollectionActions,
  CollectionCard,
  CopyAddress,
  PageHead,
  Provenance,
} from "./components";

export function NotFound() {
  return (
    <div className="page-wrap narrow">
      <PageHead label="404 · Not in this archive" title="A trail gone cold.">
        <p>This page or collection isn’t in the current archive.</p>
      </PageHead>
      <Link className="button primary" to="/explore">
        Search the collection index ↗
      </Link>
      <p>
        <Link to="/research">
          Looking for an unclassified contract? Visit Needs research.
        </Link>
      </p>
    </div>
  );
}

export default function Collection() {
  const { id } = useParams();
  const location = useLocation();
  const nft = bySlug[id];
  if (!nft) return <NotFound />;
  const index = nfts.indexOf(nft);
  const related = nfts
    .filter((other) => other.slug !== id)
    .map((other) => ({
      nft: other,
      overlap: other.categories.filter((cat) => nft.categories.includes(cat))
        .length,
    }))
    .filter((item) => item.overlap)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3);
  const contracts = nft.contracts.map((contract) => ({
    ...contract,
    role:
      nft.wrapperContract?.address.toLowerCase() ===
      contract.address.toLowerCase()
        ? "Wrapper contract"
        : "Recorded contract",
  }));
  if (
    nft.wrapperContract &&
    !contracts.some(
      (contract) =>
        contract.address.toLowerCase() ===
        nft.wrapperContract.address.toLowerCase(),
    )
  )
    contracts.push({
      ...nft.wrapperContract,
      name: "Wrapper contract",
      role: "Wrapper contract",
      notes: "Wrapper address recorded separately in the source.",
    });
  return (
    <article className="page-wrap collection-page">
      <Link className="back-link" to={location.state?.from || "/explore"}>
        ← Back to collections
      </Link>
      <header className="collection-hero">
        <div>
          <div className="eyebrow">Collection record / {nft.year}</div>
          <h1>
            {nft.title}
            <span className="accent">.</span>
          </h1>
          <p className="lede">{nft.excerpt}</p>
          <div className="badges">
            <span className="badge">{nft.blockchain}</span>
            <span className="badge">Deployed {date(nft.deployedAt)}</span>
            <span className="badge">{nft.assetDataLocation}</span>
          </div>
          <CollectionActions nft={nft} />
        </div>
        <img
          src={nft.logo}
          alt={`${nft.title} collection artwork`}
          width="360"
          height="360"
        />
      </header>
      <nav className="section-nav" aria-label="Collection sections">
        <a href="#facts">Key facts</a>
        <a href="#concerns">Recorded concerns</a>
        {(nft.analysis || nft.extendedDescription) && (
          <a href="#history">History</a>
        )}
        <a href="#contracts">Contracts</a>
        <a href="#sources">Sources</a>
        {nft.faq?.length > 0 && <a href="#questions">Questions</a>}
      </nav>
      <div className="record-layout">
        <div className="record-main">
          <section id="facts" className="record-section">
            <div className="eyebrow">At a glance</div>
            <h2>Key facts.</h2>
            <dl className="facts-grid">
              {[
                [
                  "Deployment · UTC",
                  new Date(nft.deployedAt)
                    .toISOString()
                    .replace("T", " ")
                    .replace(".000Z", " UTC"),
                ],
                ["Recorded supply", nft.totalSupply.toLocaleString("en")],
                ["Standard", nft.standard],
                ["Asset storage", nft.assetDataLocation],
                [
                  "Fixed supply",
                  nft.staticSupply
                    ? "Recorded as fixed"
                    : "Not recorded as fixed",
                ],
                [
                  "Non-fungible",
                  nft.nonfungible
                    ? "Recorded as non-fungible"
                    : "Recorded as fungible / semi-fungible",
                ],
                ["Creators", (nft.creators || []).join(", ") || "Not recorded"],
                [
                  "Development status",
                  `${nft.activeDevelopment ? "Active" : "Inactive"} in source; not rechecked`,
                ],
                [
                  "Marketplace verification",
                  `${nft.openseaVerification ? "Verified" : "Not verified"} in source; not rechecked`,
                ],
                [
                  "Unwrap capability",
                  nft.wrapperContract
                    ? `${nft.wrapperContract.canUnwrapToOriginalToken ? "Recorded as supported" : "Recorded as unsupported"}; verify current conditions`
                    : "No wrapper recorded",
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section id="concerns" className="record-section">
            <div className="eyebrow">Read before interpreting</div>
            <h2>
              {nft.flags.length
                ? `${nft.flags.length} recorded concern${nft.flags.length === 1 ? "" : "s"}.`
                : "No recorded concerns."}
            </h2>
            {nft.flags.length ? (
              nft.flags.map((flag, index) => (
                <details className={`concern-detail ${flag.level}`} key={index}>
                  <summary>
                    <span className="badge concern">{flag.level}</span>{" "}
                    {flag.name}
                  </summary>
                  <p>{flag.details}</p>
                </details>
              ))
            ) : (
              <p>
                The source record lists no concerns. This is not a security
                audit or a finding that the contracts are safe.
              </p>
            )}
          </section>
          {(nft.analysis || nft.extendedDescription) && (
            <section id="history" className="record-section prose">
              <div className="eyebrow">From the community record</div>
              <h2>History & analysis.</h2>
              {nft.extendedDescription && <p>{nft.extendedDescription}</p>}
              {nft.analysis && <ReactMarkdown>{nft.analysis}</ReactMarkdown>}
            </section>
          )}
          <section id="contracts" className="record-section">
            <div className="eyebrow">
              Original assets & related infrastructure
            </div>
            <h2>Follow the contracts.</h2>
            <p>
              Names and roles below follow the source record. A wrapper is
              separate from the original contract; read the notes and unwrap
              conditions.
            </p>
            {contracts.map((contract, index) => (
              <article className="contract-card" key={contract.address + index}>
                <span className="eyebrow">{contract.role}</span>
                <h3>{contract.name}</h3>
                <CopyAddress address={contract.address} />
                <p>{contract.notes}</p>
                <a
                  href={`https://etherscan.io/address/${contract.address}#code`}
                >
                  Read contract on Etherscan ↗
                </a>
              </article>
            ))}
          </section>
          <section id="sources" className="record-section">
            <div className="eyebrow">Keep the trail intact</div>
            <h2>Sources & destinations.</h2>
            <p>
              The linked source snapshot contains the assertions on this page.
              External project and marketplace links may have changed since the
              record was written.
            </p>
            <ul className="source-list">
              <li>
                <a href={sourceFile(nft)}>
                  Original source YAML at this revision ↗
                </a>
              </li>
              {(nft.relatedLinks || []).map((link, index) => (
                <li key={index}>
                  <a href={link.link}>{link.name} ↗</a>
                </li>
              ))}
              <li>
                <a href={nft.website}>Recorded project website ↗</a>
              </li>
              {marketURL(nft) && (
                <li>
                  <a href={marketURL(nft)}>Recorded marketplace collection ↗</a>
                </li>
              )}
              {nft.twitter && (
                <li>
                  <a href={`https://x.com/${nft.twitter.replace(/^@/, "")}`}>
                    Recorded project social account ↗
                  </a>
                </li>
              )}
              {nft.discord && (
                <li>
                  <a href={nft.discord}>Recorded community invite ↗</a>
                </li>
              )}
            </ul>
            <p className="muted">
              Social and analytics widgets are offered as external destinations
              so they do not interrupt reading or load third-party embeds.
            </p>
          </section>
          {nft.faq?.length > 0 && (
            <section id="questions" className="record-section">
              <div className="eyebrow">From the source record</div>
              <h2>Common questions.</h2>
              {nft.faq.map((item, index) => (
                <details className="faq-item" key={index}>
                  <summary>{item.question}</summary>
                  <div className="prose">
                    <ReactMarkdown>{item.answer}</ReactMarkdown>
                  </div>
                </details>
              ))}
            </section>
          )}
        </div>
        <aside className="record-sidebar">
          <Provenance nft={nft} />
          <a
            className="button"
            href={correction(
              `Correction: ${nft.title}`,
              `Source entry: ${sourceFile(nft)}\n\nField to correct:\nProposed change:\nEvidence URL / transaction / block:\nWhy this supports the change:\n`,
            )}
          >
            Suggest a correction ↗
          </a>
          <Link to={`/compare?ids=${nft.slug}`}>Start a comparison →</Link>
        </aside>
      </div>
      <nav
        className="chronology-nav"
        aria-label="Chronological collection navigation"
      >
        {index > 0 ? (
          <Link to={`/nft-details/${nfts[index - 1].slug}`}>
            ← Earlier
            <br />
            <strong>{nfts[index - 1].title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {index < nfts.length - 1 && (
          <Link to={`/nft-details/${nfts[index + 1].slug}`}>
            Later →<br />
            <strong>{nfts[index + 1].title}</strong>
          </Link>
        )}
      </nav>
      {related.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Shared categories</div>
              <h2>Keep exploring.</h2>
            </div>
          </div>
          <div className="collection-grid home-grid">
            {related.map((item) => (
              <CollectionCard nft={item.nft} key={item.nft.slug} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
