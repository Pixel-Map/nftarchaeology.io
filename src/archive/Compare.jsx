import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { bySlug, nfts, compareIds, date } from "./data";
import { useArchive } from "./state";
import { CopyAddress, Empty, PageHead } from "./components";

export default function Compare() {
  const [params, setParams] = useSearchParams();
  const { setCompare, setNotice } = useArchive();
  const ids = compareIds(params.get("ids"));
  const [add, setAdd] = useState("");
  const update = (next) => {
    setCompare(next);
    setParams(next.length ? { ids: next.join(",") } : {});
  };
  const rows = [
    ["Deployment · UTC", (n) => date(n.deployedAt)],
    ["Standard", (n) => n.standard],
    ["Asset storage", (n) => n.assetDataLocation],
    ["Recorded supply", (n) => n.totalSupply.toLocaleString("en")],
    [
      "Fixed supply",
      (n) => (n.staticSupply ? "Recorded as fixed" : "Not recorded as fixed"),
    ],
    ["Non-fungible", (n) => (n.nonfungible ? "Recorded yes" : "Recorded no")],
    [
      "Original / related contracts",
      (n) => (
        <>
          {n.contracts.map((c, index) => (
            <div className="compare-contract" key={index}>
              <strong>{c.name}</strong>
              <CopyAddress address={c.address} />
            </div>
          ))}
        </>
      ),
    ],
    [
      "Wrapper",
      (n) =>
        n.wrapperContract ? (
          <>
            <CopyAddress address={n.wrapperContract.address} />
            <p>
              {n.wrapperContract.canUnwrapToOriginalToken
                ? "Unwrapping recorded as supported"
                : "Unwrapping recorded as unsupported"}
            </p>
          </>
        ) : (
          "No wrapper recorded"
        ),
    ],
    [
      "Recorded concerns",
      (n) =>
        n.flags.length ? (
          <ul>
            {n.flags.map((f, index) => (
              <li key={index}>{f.name}</li>
            ))}
          </ul>
        ) : (
          "No concerns recorded"
        ),
    ],
    [
      "Review status",
      () =>
        "Editorial review date not recorded. Source snapshot; current status not rechecked.",
    ],
  ];
  return (
    <div className="page-wrap">
      <PageHead label="Research tools" title="Compare the records.">
        <p>
          Compare up to four collections. Technical properties and recorded
          concerns are shown separately; no composite investment or safety
          ranking is assigned.
        </p>
      </PageHead>
      <div className="compare-controls">
        <label>
          Add a collection{" "}
          <select value={add} onChange={(event) => setAdd(event.target.value)}>
            <option value="">Choose a collection</option>
            {nfts
              .filter((n) => !ids.includes(n.slug))
              .map((n) => (
                <option key={n.slug} value={n.slug}>
                  {n.title}
                </option>
              ))}
          </select>
        </label>
        <button
          className="button"
          disabled={!add || ids.length >= 4}
          onClick={() => {
            update([...ids, add]);
            setAdd("");
          }}
        >
          Add to comparison
        </button>
        <button
          className="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              setNotice("Comparison link copied.");
            } catch {
              setNotice(
                "Copy unavailable. Copy the page URL to share this comparison.",
              );
            }
          }}
        >
          Copy comparison link
        </button>
      </div>
      {!ids.length ? (
        <Empty title="Choose your first collection.">
          <p>Add collections above, or select Compare while browsing.</p>
          <Link to="/explore">Browse the archive ↗</Link>
        </Empty>
      ) : (
        <div
          className="table-scroll comparison-table"
          tabIndex="0"
          aria-label="Collection comparison"
        >
          <table>
            <caption className="sr-only">
              Comparison of {ids.map((id) => bySlug[id].title).join(", ")}
            </caption>
            <thead>
              <tr>
                <th scope="col">Source-record attribute</th>
                {ids.map((id) => (
                  <th scope="col" key={id}>
                    <img src={bySlug[id].logo} width="72" height="72" alt="" />
                    <Link to={`/nft-details/${id}`}>{bySlug[id].title} ↗</Link>
                    <button
                      aria-label={`Remove ${bySlug[id].title} from comparison`}
                      onClick={() =>
                        update(ids.filter((value) => value !== id))
                      }
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, render]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {ids.map((id) => (
                    <td key={id}>{render(bySlug[id])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
