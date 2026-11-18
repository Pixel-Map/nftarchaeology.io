import React from "react";
import { Link } from "react-router-dom";
import { nfts, options, date } from "./data";
import { PageHead } from "./components";

export default function Timeline() {
  return (
    <div className="page-wrap">
      <PageHead
        label="2015–2019 · Ethereum"
        title="A chronology of experiments."
      >
        <p>
          Original deployment dates from the community records. Wrapper launches
          and rediscovery dates are separate events and are not inferred here.
        </p>
      </PageHead>
      <nav className="year-nav" aria-label="Jump to year">
        {options.year.map((year) => (
          <a href={`#year-${year}`} key={year}>
            {year}{" "}
            <span>
              {nfts.filter((nft) => String(nft.year) === year).length}
            </span>
          </a>
        ))}
      </nav>
      {options.year.map((year) => (
        <section className="timeline-year" id={`year-${year}`} key={year}>
          <h2>
            {year}
            <span className="accent">.</span>
          </h2>
          <ol>
            {nfts
              .filter((nft) => String(nft.year) === year)
              .map((nft) => (
                <li key={nft.slug}>
                  <time dateTime={nft.deployedAt}>{date(nft.deployedAt)}</time>
                  <Link to={`/nft-details/${nft.slug}`}>
                    <img
                      src={nft.logo}
                      alt=""
                      width="80"
                      height="80"
                      loading="lazy"
                    />
                    <div>
                      <h3>{nft.title} ↗</h3>
                      <p>{nft.excerpt}</p>
                      <span className="mono muted">
                        {nft.standard} · {nft.assetDataLocation}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
