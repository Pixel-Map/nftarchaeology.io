import React, { useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { facets, options, queryCollections, updateParam, date, recordedSupply } from "./data";
import { useArchive } from "./state";
import {
  CollectionCard,
  CollectionActions,
  ConcernBadge,
  Empty,
  PageHead,
  Search,
} from "./components";

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const { saved } = useArchive();
  const location = useLocation();
  const dialog = useRef(null);
  const results = queryCollections(params, saved);
  const selected = [...params.entries()].filter(
    ([key]) =>
      Object.hasOwn(facets, key) || ["saved", "concerns"].includes(key),
  );
  const change = (key, value, multiple = false) =>
    setParams(updateParam(params, key, value, multiple));
  const resetFilters = () => {
    const next = new URLSearchParams(params);
    for (const key of [...Object.keys(facets), "saved", "concerns", "page"])
      next.delete(key);
    setParams(next);
  };
  const filters = () => (
    <>
      <div className="filter-title">
        <h2>Refine the archive</h2>
        <button onClick={resetFilters}>Reset</button>
      </div>
      <label className="filter-option">
        <input
          type="checkbox"
          checked={params.has("saved")}
          onChange={() => change("saved", params.has("saved") ? "" : "1")}
        />
        Saved collections
      </label>
      <label className="filter-option">
        <input
          type="checkbox"
          checked={params.has("concerns")}
          onChange={() => change("concerns", params.has("concerns") ? "" : "1")}
        />
        Has recorded concerns
      </label>
      {Object.entries(facets).map(([key, label]) => {
        const available = queryCollections(params, saved, key);
        return (
          <fieldset key={key}>
            <legend>{label}</legend>
            {options[key].map((value) => {
              const count = available.filter((nft) =>
                (key === "category"
                  ? nft.categories
                  : [
                      String(
                        nft[
                          {
                            year: "year",
                            storage: "assetDataLocation",
                            standard: "standard",
                          }[key]
                        ],
                      ),
                    ]
                ).includes(value),
              ).length;
              return (
                <label className="filter-option" key={value}>
                  <input
                    type="checkbox"
                    checked={params.getAll(key).includes(value)}
                    disabled={!count && !params.getAll(key).includes(value)}
                    onChange={() => change(key, value, true)}
                  />
                  <span>{value}</span>
                  <span className="facet-count">{count}</span>
                </label>
              );
            })}
          </fieldset>
        );
      })}
    </>
  );
  return (
    <div className="page-wrap">
      <PageHead
        label="The collection index"
        title={
          params.has("saved") ? "Your reading list." : "Explore the beginnings."
        }
      >
        <p>
          Documented collections, original contracts, and the experiments that
          shaped early Ethereum.
        </p>
      </PageHead>
      <Search initial={params.get("q") || ""} />
      <div className="explore-layout">
        <aside className="desktop-filters" aria-label="Collection filters">
          {filters()}
        </aside>
        <section className="results" aria-label="Collection results">
          <div className="results-toolbar">
            <p role="status">
              <strong>{results.length}</strong> collection
              {results.length === 1 ? "" : "s"}
              {params.get("q") && <> matching “{params.get("q")}”</>}
            </p>
            <button
              className="mobile-filter-button"
              onClick={() => dialog.current.showModal()}
            >
              Filters {selected.length > 0 && `(${selected.length})`}
            </button>
            <div className="view-switch" aria-label="Result layout">
              <button
                aria-pressed={params.get("view") !== "table"}
                onClick={() => change("view", "")}
              >
                Grid
              </button>
              <button
                aria-pressed={params.get("view") === "table"}
                onClick={() => change("view", "table")}
              >
                Table
              </button>
            </div>
            <label className="sort-label">
              <span className="sr-only">Sort collections</span>
              <select
                value={params.get("sort") || "oldest"}
                onChange={(event) => change("sort", event.target.value)}
              >
                <option value="oldest">Oldest first</option>
                <option value="newest">Newest first</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
          {selected.length > 0 && (
            <div className="filter-chips" aria-label="Selected filters">
              {selected.map(([key, value]) => (
                <button
                  key={key + value}
                  onClick={() =>
                    change(
                      key,
                      ["saved", "concerns"].includes(key) ? "" : value,
                      Object.hasOwn(facets, key),
                    )
                  }
                >
                  {key === "saved"
                    ? "Saved"
                    : key === "concerns"
                      ? "Recorded concerns"
                      : value}
                  <span aria-hidden="true"> ×</span>
                  <span className="sr-only"> remove filter</span>
                </button>
              ))}
            </div>
          )}
          {!results.length ? (
            <Empty
              title={
                params.has("saved") && !saved.length
                  ? "Start a reading list."
                  : "No collections match."
              }
            >
              <p>
                {params.has("saved") && !saved.length
                  ? "Choose Save on any collection. Your bookmarks stay in this browser."
                  : "Try a broader search or remove a filter."}
              </p>
              <Link className="button primary" to="/explore">
                Browse all collections ↗
              </Link>
            </Empty>
          ) : params.get("view") === "table" ? (
            <div
              className="table-scroll"
              tabIndex="0"
              aria-label="Collection comparison table"
            >
              <table>
                <caption className="sr-only">
                  Filtered historical NFT collections
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Collection</th>
                    <th scope="col">Deployed · UTC</th>
                    <th scope="col">Standard</th>
                    <th scope="col">Storage</th>
                    <th scope="col">Supply</th>
                    <th scope="col">Recorded concerns</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((nft) => (
                    <tr key={nft.slug}>
                      <th scope="row">
                        <Link
                          to={`/nft-details/${nft.slug}`}
                          state={{ from: location.pathname + location.search }}
                        >
                          <img src={nft.logo} alt="" width="40" height="40" />
                          {nft.title}
                        </Link>
                      </th>
                      <td>{date(nft.deployedAt)}</td>
                      <td>{nft.standard}</td>
                      <td>{nft.assetDataLocation}</td>
                      <td>{recordedSupply(nft)}</td>
                      <td>
                        <ConcernBadge nft={nft} />
                      </td>
                      <td>
                        <CollectionActions nft={nft} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="collection-grid">
              {results.map((nft) => (
                <CollectionCard key={nft.slug} nft={nft} />
              ))}
            </div>
          )}
        </section>
      </div>
      <dialog
        ref={dialog}
        className="filter-dialog"
        aria-labelledby="filter-dialog-title"
      >
        <h2 id="filter-dialog-title">Collection filters</h2>
        <button
          className="dialog-close"
          onClick={() => dialog.current.close()}
          aria-label="Close filters"
        >
          ×
        </button>
        {filters()}
        <button
          className="button primary"
          onClick={() => dialog.current.close()}
        >
          Show {results.length}{" "}
          {results.length === 1 ? "collection" : "collections"}
        </button>
      </dialog>
    </div>
  );
}
