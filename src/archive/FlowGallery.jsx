import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { nfts } from "./data";

const rank = (text) =>
  [...text].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0);
const featured = [...nfts]
  .sort((a, b) => rank(a.slug) - rank(b.slug))
  .slice(0, 18);
const columns = [0, 1, 2].map((column) =>
  featured.filter((_, index) => index % 3 === column),
);

export default function FlowGallery() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const update = () => {
      setReduced(media.matches);
      setPaused(media.matches);
    };
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return (
    <section
      className={`flow-artwork ${paused ? "is-paused" : ""}`}
      aria-label="Flowing NFT collections"
    >
      <div className="flow-toolbar">
        <span>Explore blockchain history</span>
        <button
          disabled={reduced}
          aria-pressed={paused}
          aria-controls="flow-gallery"
          onClick={() => setPaused(!paused)}
        >
          {reduced
            ? "Reduced motion: still gallery"
            : paused
              ? "▶ Animate artwork"
              : "Ⅱ Pause & browse"}
        </button>
      </div>
      <div id="flow-gallery" className="flow-gallery">
        {columns.map((items, column) => (
          <div className="flow-column" key={column}>
            <div
              className="flow-track"
              style={{
                "--duration": `${[34, 42, 38][column]}s`,
                "--delay": `${[-8, -17, -3][column]}s`,
              }}
            >
              {[false, true].map((duplicate) => (
                <div
                  className={`flow-group ${duplicate ? "flow-duplicate" : ""}`}
                  key={String(duplicate)}
                  aria-hidden={duplicate ? "true" : undefined}
                >
                  {items.map((nft) => (
                    <Link
                      className="flow-tile"
                      key={nft.slug}
                      to={`/nft-details/${nft.slug}`}
                      tabIndex={duplicate || !paused ? -1 : 0}
                      title={nft.title}
                    >
                      <img
                        src={nft.logo}
                        alt={duplicate ? "" : nft.title}
                        width="160"
                        height="160"
                        loading="lazy"
                      />
                      <span>{nft.title}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="flow-caption">
        {paused
          ? "Browse the still gallery, or resume the flow."
          : "Different collections, flowing upward. Pause to browse with your keyboard."}
      </p>
    </section>
  );
}
