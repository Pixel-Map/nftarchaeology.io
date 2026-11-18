import React, { useEffect, useState } from "react";
import { correction, researchSource, source } from "./data";

const fields = [
  [
    "nftStatus",
    "NFT classification",
    [
      "Unresolved",
      "Possible NFT",
      "Likely non-NFT",
      "Confirmed NFT — evidence required",
    ],
  ],
  [
    "nonfungible",
    "Distinct asset ownership",
    [
      "Not reviewed",
      "Yes — evidence required",
      "No — evidence required",
      "Uncertain",
    ],
  ],
  [
    "staticSupply",
    "Fixed supply",
    [
      "Not reviewed",
      "Yes — evidence required",
      "No — evidence required",
      "Uncertain",
    ],
  ],
  [
    "assetDataLocation",
    "Asset data location",
    ["Not reviewed", "On-Chain", "IPFS", "Webserver", "Unknown"],
  ],
  [
    "wrapperAndUnwrap",
    "Wrapper / unwrap",
    [
      "Not reviewed",
      "No wrapper found",
      "Reversible wrapper — evidence required",
      "Non-reversible wrapper — evidence required",
      "Uncertain",
    ],
  ],
  [
    "activeDevelopment",
    "Development status",
    [
      "Not reviewed",
      "Active — dated evidence required",
      "Inactive — dated evidence required",
      "Uncertain",
    ],
  ],
  [
    "openseaVerification",
    "Marketplace verification",
    [
      "Not reviewed",
      "Verified — dated evidence required",
      "Not verified — dated evidence required",
      "Uncertain",
    ],
  ],
  [
    "ethRecoverability",
    "ETH review",
    [
      "Not assessed",
      "Permissions / beneficiaries need review",
      "Potential authorized recovery — evidence required",
      "No eligible recovery established",
    ],
  ],
];
const blank = Object.fromEntries(
  fields.map(([key, , values]) => [key, values[0]]),
);
const extraFields = [
  ["supply", "Recorded or observed supply"],
  ["contracts", "Original / wrapper / related addresses"],
  ["securityConcerns", "Security concerns and permissions"],
  ["evidence", "Evidence URLs, transactions, block numbers and reasoning"],
  ["reviewer", "Proposed reviewer identity"],
];

export default function Worksheet({ address }) {
  const key = `nft-archive:research-draft:${address}`;
  const [draft, setDraft] = useState(blank);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setDraft(blank);
    setMessage("");
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      if (value && typeof value === "object")
        setDraft({
          ...blank,
          ...Object.fromEntries(
            Object.entries(value).filter(
              ([field, value]) =>
                [
                  ...fields.map((f) => f[0]),
                  ...extraFields.map((f) => f[0]),
                  "reviewDate",
                ].includes(field) && typeof value === "string",
            ),
          ),
        });
    } catch {
      setMessage(
        "Browser storage is unavailable. You can still download your proposal.",
      );
    }
  }, [key]);
  const change = (field, value) =>
    setDraft((current) => ({ ...current, [field]: value }));
  const proposal = {
    status: "unreviewed-proposal",
    address,
    chainId: 1,
    sourceRevision: source.revision,
    evidenceBlock: researchSource.blockNumber,
    fields: draft,
  };
  return (
    <form
      className="research-worksheet"
      onSubmit={(event) => {
        event.preventDefault();
        try {
          localStorage.setItem(key, JSON.stringify(draft));
          setMessage(
            "Draft saved in this browser. It has not been published or reviewed.",
          );
        } catch {
          setMessage(
            "Browser storage is unavailable. Download the proposal to keep a copy.",
          );
        }
      }}
    >
      <h3>Evaluate this contract</h3>
      <p>
        Draft an interpretation against the same collection fields. This stays
        separate from captured evidence and does not change the published
        classification.
      </p>
      <div className="worksheet-fields">
        {fields.map(([field, label, values]) => (
          <label key={field}>
            {label}
            <select
              value={draft[field]}
              onChange={(event) => change(field, event.target.value)}
            >
              {values.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {extraFields.map(([field, label]) => (
        <label className="worksheet-text" key={field}>
          {label}
          <textarea
            rows={field === "evidence" ? 6 : 2}
            value={draft[field] || ""}
            onChange={(event) => change(field, event.target.value)}
            placeholder={
              field === "evidence"
                ? "State each claim, cite evidence, and list unresolved questions."
                : ""
            }
          />
        </label>
      ))}
      <label className="worksheet-text">
        Proposed review date
        <input
          type="date"
          value={draft.reviewDate || ""}
          onChange={(event) => change("reviewDate", event.target.value)}
        />
      </label>
      <div className="compare-controls">
        <button className="button primary" type="submit">
          Save local draft
        </button>
        <button
          className="button"
          type="button"
          onClick={() => {
            const url = URL.createObjectURL(
              new Blob([JSON.stringify(proposal, null, 2)], {
                type: "application/json",
              }),
            );
            const link = document.createElement("a");
            link.href = url;
            link.download = `${address}-research-proposal.json`;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }}
        >
          Download proposal
        </button>
        <a
          className="button"
          href={correction(
            `Research proposal: ${address}`,
            JSON.stringify(proposal, null, 2),
          )}
        >
          Propose on GitHub ↗
        </a>
      </div>
      <p className="muted" role="status">
        {message ||
          "Drafts are browser-local. Publishing a proposal on GitHub does not mark it as reviewed."}
      </p>
    </form>
  );
}
