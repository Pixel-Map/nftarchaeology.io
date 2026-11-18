import React, { useState } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  candidates,
  unresolved,
  researchSource,
  researchResults,
  researchName,
  updateParam,
  shortAddress,
  correction,
  source,
  compareWei,
} from "./data";
import {
  ContractLink,
  CopyAddress,
  Empty,
  PageHead,
  Search,
} from "./components";
import { NotFound } from "./Collection";
import Worksheet from "./Worksheet";

export const attributionURL = "https://x.com/0xzxch/status/2122996595637588119";
export const signalLabels = {
  "nft-method-signal": "NFT-method leads",
  "token-method-signal": "Token-method leads",
  "nonstandard-or-other": "Nonstandard / other code",
  "no-runtime-code": "No runtime code at snapshot",
};
const hasFunds = (row) => compareWei(row.balanceWei || "0", "0") > 0;
const fundingCount = unresolved.filter(hasFunds).length;

function Attribution() {
  return (
    <p className="attribution">
      “the 0xzxch list” · attributed to{" "}
      <a href={attributionURL}>@0xzxch’s source post ↗</a> ·{" "}
      <a href={researchSource.url}>original contract list ↗</a>
    </p>
  );
}

export default function Research() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const change = (key, value) => setParams(updateParam(params, key, value));
  let results = researchResults(params).filter(
    (row) =>
      (!params.has("funded") || hasFunds(row)) &&
      (!params.has("source") || row.sourceRuntimeAgrees) &&
      (!params.has("withdrawal") || row.withdrawalFunctions?.length),
  );
  if (params.get("sort") === "eth")
    results.sort(
      (a, b) =>
        compareWei(b.balanceWei || "0", a.balanceWei || "0") ||
        a.address.localeCompare(b.address),
    );
  const pages = Math.max(1, Math.ceil(results.length / 40));
  const page = Math.min(
    pages,
    Math.max(1, Math.floor(Number(params.get("page"))) || 1),
  );
  const setPage = (value) => {
    const next = new URLSearchParams(params);
    next.set("page", value);
    setParams(next);
    document.getElementById("research-results")?.focus();
  };
  return (
    <div className="page-wrap">
      <PageHead
        label="Needs research · Ethereum contracts"
        title="the 0xzxch list"
      >
        <p>
          A research queue of early contracts. Every source address has a
          block-pinned code and balance record. NFT status remains unresolved
          until the contract’s ownership, asset behavior, and provenance are
          reviewed.
        </p>
      </PageHead>
      <Attribution />
      <div className="research-stats">
        <div>
          <strong>{candidates.length.toLocaleString("en")}</strong>
          <span>source addresses inspected</span>
        </div>
        <div>
          <strong>{unresolved.length.toLocaleString("en")}</strong>
          <span>without an exact catalogue match</span>
        </div>
        <div>
          <strong>{fundingCount.toLocaleString("en")}</strong>
          <span>unmatched addresses holding ETH</span>
        </div>
        <div>
          <strong>{researchSource.blockNumber.toLocaleString("en")}</strong>
          <span>Ethereum snapshot block</span>
        </div>
      </div>
      <section className="record-section">
        <h2>Research highlights</h2>
        <ul className="method-list">
          {candidates.filter((row) => row.history?.finding?.title).map((row) => (
            <li key={row.address}>
              <Link to={`/research/${row.address}`}>{row.history.finding.title} →</Link>
            </li>
          ))}
        </ul>
        <a href={`${source.repository}/tree/${source.revision}/research/etherr/history`}>
          Full deployment, activity and balance dataset ↗
        </a>
      </section>
      <p>
        <Link className="button" to="/research?funded=1&sort=eth">
          Review contracts holding ETH ↗
        </Link>
      </p>
      <Search initial={params.get("q") || ""} research />
      <div className="research-controls">
        <label>
          Year
          <select
            value={params.get("year") || ""}
            onChange={(event) => change("year", event.target.value)}
          >
            <option value="">All years</option>
            {[...new Set(candidates.map((row) => row.year))]
              .sort()
              .map((year) => (
                <option key={year}>{year}</option>
              ))}
          </select>
        </label>
        <label>
          Bytecode lead
          <select
            value={params.get("signal") || ""}
            onChange={(event) => change("signal", event.target.value)}
          >
            <option value="">All signals</option>
            {Object.entries(signalLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sort
          <select
            value={params.get("sort") || "oldest"}
            onChange={(event) => change("sort", event.target.value)}
          >
            <option value="oldest">Oldest source date</option>
            <option value="newest">Newest source date</option>
            <option value="name">Name A–Z</option>
            <option value="eth">ETH balance, highest first</option>
          </select>
        </label>
      </div>
      <div className="research-toggles">
        {[
          ["funded", "Holds ETH at snapshot"],
          ["source", "Source matches snapshot runtime"],
          ["withdrawal", "Withdrawal / claim ABI leads"],
          ["known", "Include exact catalogue matches"],
        ].map(([key, label]) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={params.has(key)}
              onChange={() =>
                change(
                  key,
                  params.has(key) ? "" : key === "known" ? "include" : "1",
                )
              }
            />
            {label}
          </label>
        ))}
        <button onClick={() => setParams({})}>Reset filters</button>
      </div>
      <div className="results-toolbar" id="research-results" tabIndex="-1">
        <p role="status">
          <strong>{results.length.toLocaleString("en")}</strong> contracts ·
          page {page} of {pages}
        </p>
        <a href="/data/research.json" download>
          Download evidence index ↓
        </a>
      </div>
      {!results.length ? (
        <Empty title="No contracts match.">
          <button onClick={() => setParams({})}>Clear research filters</button>
        </Empty>
      ) : (
        <>
          <div
            className="table-scroll"
            tabIndex="0"
            aria-label="Research contract index"
          >
            <table className="research-table">
              <caption className="sr-only">
                the 0xzxch list, research contracts with block-pinned evidence
              </caption>
              <thead>
                <tr>
                  <th scope="col">Source date · UTC</th>
                  <th scope="col">Contract lead</th>
                  <th scope="col">Source label</th>
                  <th scope="col">Runtime signal</th>
                  <th scope="col">ETH held</th>
                  <th scope="col">Research status</th>
                </tr>
              </thead>
              <tbody>
                {results.slice((page - 1) * 40, page * 40).map((row) => (
                  <tr key={row.address}>
                    <td className="mono">{row.created.slice(0, 10)}</td>
                    <th scope="row">
                      <Link
                        to={`/research/${row.address}`}
                        state={{ from: location.pathname + location.search }}
                      >
                        <strong>{researchName(row) || shortAddress(row.address)}</strong>
                        {researchName(row) && (
                          <span className="mono">{shortAddress(row.address)} ↗</span>
                        )}
                      </Link>
                    </th>
                    <td>
                      {row.category || "Not specified"}
                      <small className="muted">Source assertion</small>
                    </td>
                    <td>
                      {signalLabels[row.signal]}
                      <small className="muted">
                        {row.sourceRuntimeAgrees
                          ? "Source runtime matches"
                          : "Source review needed"}
                      </small>
                    </td>
                    <td className="mono">
                      {row.balanceEth || "0"}
                      <small className="muted">Not assessed for recovery</small>
                    </td>
                    <td>
                      {row.known.length ? (
                        <span className="badge">Exact catalogue match</span>
                      ) : (
                        <span className="badge quiet">Unresolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav className="pagination" aria-label="Research result pages">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              ← Previous
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button disabled={page >= pages} onClick={() => setPage(page + 1)}>
              Next →
            </button>
          </nav>
        </>
      )}
    </div>
  );
}

function DeploymentHistory({ history }) {
  const {
    deploymentBlock: block, deploymentDate: date, finding,
    nextCheck, balanceWei, balanceBlock,
  } = history;
  return (
    <section className="record-section">
      <h2>Deployment and activity</h2>
      <dl className="facts-grid">
        <div>
          <dt>Indexed deployment</dt>
          <dd>
            {date && `${date} UTC · `}
            <a href={`https://etherscan.io/block/${block}`}>Block {block.toLocaleString("en")} ↗</a>
          </dd>
        </div>
        {balanceBlock && <div>
          <dt>Refreshed balance at block {balanceBlock.toLocaleString("en")}</dt>
          <dd className="mono break">{balanceWei} wei</dd>
        </div>}
      </dl>
      {finding && (
        <div className="callout">
          <strong>{finding.title || "Reviewed finding"}</strong>
          <p>{finding.finding}</p>
          {finding.compilationEvidence && (
            <p>
              Reproduced with Solidity {finding.compilationEvidence.creationMatchCheckedWith}
              {" · "}
              {finding.compilationEvidence.optimizerEnabled ? "optimizer enabled" : "optimizer disabled"}
            </p>
          )}
          {finding.sourceFile && <p className="mono">{finding.sourceFile} · lines {finding.lines}</p>}
          {finding.references?.length > 0 && (
            <ul>
              {finding.references.map((url, index) => (
                <li key={url}><a href={url}>Evidence {index + 1} ↗</a></li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p><strong>Next check.</strong> {finding?.nextCheck || nextCheck}</p>
    </section>
  );
}

function HistorySamples({ artifact }) {
  const transactions = artifact.history?.directActivity?.rows || [];
  const flows = artifact.fundedFlows;
  const creation = artifact.history?.creation?.rows?.[0];
  const firstCall = artifact.history?.firstSuccessfulDirectCallSample;
  return (
    <>
      {creation && (
        <dl className="facts-grid">
          <div>
            <dt>Creation transaction</dt>
            <dd><a href={`https://etherscan.io/tx/${creation.txHash}`}>{shortAddress(creation.txHash)} ↗</a></dd>
          </div>
          <div>
            <dt>{creation.contractFactory ? "Deploying factory" : "Deployer"}</dt>
            <dd><ContractLink address={creation.contractFactory || creation.contractCreator} /></dd>
          </div>
          {firstCall && (
            <div>
              <dt>Early successful direct call</dt>
              <dd><a href={`https://etherscan.io/tx/${firstCall}`}>{shortAddress(firstCall)} ↗</a></dd>
            </div>
          )}
        </dl>
      )}
      {artifact.history && (
        <details className="faq-item">
          <summary>Indexed direct transactions · {transactions.length} sampled</summary>
          {transactions.length ? (
            <ul className="method-list">
              {transactions.map((tx) => (
                <li key={tx.hash}>
                  <a href={`https://etherscan.io/tx/${tx.hash}`}>{shortAddress(tx.hash)} ↗</a>
                  {" · "}block {Number(tx.blockNumber).toLocaleString("en")}
                  {" · "}{tx.methodId || "no method ID"}
                </li>
              ))}
            </ul>
          ) : <p>No direct transactions returned by the indexed query.</p>}
        </details>
      )}
      {flows && (
        <details className="faq-item">
          <summary>Indexed ETH flow samples</summary>
          {["inbound", "outbound"].map((direction) => (
            <div key={direction}>
              <h3>{direction === "inbound" ? "Inbound" : "Outbound"}</h3>
              {flows[direction]?.samples?.length ? (
                <ul className="method-list">
                  {flows[direction].samples.map((tx) => (
                    <li key={`${tx.txHash}:${tx.opIndex}`}>
                      <a href={`https://etherscan.io/tx/${tx.txHash}`}>{shortAddress(tx.txHash)} ↗</a>
                      {" · "}{tx.value} wei
                    </li>
                  ))}
                </ul>
              ) : <p>No transfers returned in this sample.</p>}
            </div>
          ))}
        </details>
      )}
    </>
  );
}

export function ResearchContract() {
  const location = useLocation();
  const { address } = useParams();
  const row = candidates.find(
    (item) => item.address.toLowerCase() === address?.toLowerCase(),
  );
  const [artifact, setArtifact] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (!row) return <NotFound />;
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/data/contracts/${row.address}.json`);
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (
        result.address !== row.address ||
        result.blockHash !== researchSource.blockHash
      )
        throw new Error();
      setArtifact(result);
    } catch {
      setError(
        "The local evidence artifact could not be loaded. Download it or open the source provider below.",
      );
    } finally {
      setLoading(false);
    }
  };
  const worksheet = [
    [
      "NFT classification",
      "Unresolved; review ownership and transfer semantics",
    ],
    [
      "Asset storage",
      "Not reviewed; trace where token-specific data is stored",
    ],
    ["Fixed supply", "Not reviewed; inspect minting paths and limits"],
    [
      "Non-fungibility",
      "Not reviewed; determine distinct asset identity and transfer behavior",
    ],
    [
      "Active development",
      "Not reviewed; source code alone cannot establish maintenance",
    ],
    [
      "Marketplace verification",
      "Not reviewed; validate collection and original asset relationship",
    ],
    [
      "Wrapper / unwrap",
      "Not reviewed; establish exact contract relationships and reversibility",
    ],
    [
      "Security concerns",
      "Not reviewed; inspect permissions, upgrades, external calls and known issues",
    ],
    [
      "ETH recoverability",
      "Not assessed; balance and function names do not prove eligibility",
    ],
  ];
  const providerSources = artifact?.sourceResponse?.sources || {};
  return (
    <article className="page-wrap">
      <Link className="back-link" to={location.state?.from || "/research"}>
        ← Back to the 0xzxch list
      </Link>
      <PageHead
        label={
          row.known.length
            ? "Exact address match · existing catalogue"
            : "Needs research · classification unresolved"
        }
        title={researchName(row) || shortAddress(row.address)}
      >
        <CopyAddress address={row.address} />
      </PageHead>
      <Attribution />
      {row.known.length > 0 && (
        <div className="callout">
          <strong>Already represented in the catalogue</strong>
          {row.known.map((match, index) => (
            <p key={index}>
              <Link to={`/nft-details/${match.slug}`}>{match.title} ↗</Link> ·{" "}
              {match.role}
            </p>
          ))}
        </div>
      )}
      <div className="research-stats">
        <div>
          <strong className="balance">{row.balanceEth || "0"} ETH</strong>
          <span>held at snapshot; recoverability not assessed</span>
        </div>
        <div>
          <strong>{row.codeBytes.toLocaleString("en")} bytes</strong>
          <span>runtime code at snapshot</span>
        </div>
        <div>
          <strong>{row.sourceRuntimeAgrees ? "Matched" : "Unconfirmed"}</strong>
          <span>source-to-snapshot runtime comparison</span>
        </div>
      </div>
      <div className="record-layout">
        <div className="record-main">
          <section className="record-section">
            <h2>What is actually known.</h2>
            <dl className="facts-grid">
              <div>
                <dt>Source deployment date</dt>
                <dd>
                  {row.created} · original list
                </dd>
              </div>
              {row.contractName && <div>
                <dt>Contract name evidence</dt>
                <dd><a href={row.contractName.url}>{row.contractName.label} ↗</a></dd>
              </div>}
              <div>
                <dt>Source classification</dt>
                <dd>{row.category || "Not specified"} · unverified label</dd>
              </div>
              <div>
                <dt>Bytecode signal</dt>
                <dd>{signalLabels[row.signal]}</dd>
              </div>
              <div>
                <dt>Original source-provider lookup</dt>
                <dd>
                  {row.sourceStatus === "available"
                    ? "Provider returned verified source"
                    : row.sourceStatus === "not-found"
                      ? "No source found at the checked provider"
                      : "Source lookup unresolved"}
                  ; exact runtime agreement:{" "}
                  {row.sourceRuntimeAgrees ? "yes" : "not established"}
                </dd>
              </div>
              <div>
                <dt>ETH balance, exact wei</dt>
                <dd className="mono break">{row.balanceWei || "0"}</dd>
              </div>
              <div>
                <dt>Snapshot block</dt>
                <dd>
                  <a
                    href={`https://etherscan.io/block/${researchSource.blockNumber}`}
                  >
                    {researchSource.blockNumber} ↗
                  </a>
                </dd>
              </div>
            </dl>
            <p className="muted">
              A missing NFT selector does not rule out early NFTs. A matching
              selector can collide or appear in unrelated code. Proxy
              implementations, storage and historical events require further
              investigation.
            </p>
          </section>
          {row.history && <DeploymentHistory history={row.history} />}
          <section className="record-section">
            <h2>Contract evidence.</h2>
            <p>
              <ContractLink address={row.address} /> ·{" "}
              <a href={row.sourceURL}>Sourcify source response ↗</a>
            </p>
            <p>
              <a
                className="button"
                href={`/data/contracts/${row.address}.json`}
                download
              >
                Download contract evidence JSON ↓
              </a>
            </p>
            <p className="mono break muted">
              Runtime SHA-256: {row.runtimeSha256}
              <br />
              Block hash: {researchSource.blockHash}
            </p>
            <h3>Recognized PUSH4 operands</h3>
            {row.selectors.length ? (
              <ul className="method-list">
                {row.selectors.map((item) => (
                  <li key={item.selector}>
                    <code>{item.selector}</code> {item.signature}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                No selectors in the limited recognition set were found. This is
                not an exhaustive ABI or disassembly.
              </p>
            )}
            {Object.keys(row.interfaces || {}).length > 0 && (
              <details className="faq-item">
                <summary>Raw interface-probe responses</summary>
                <pre>{JSON.stringify(row.interfaces, null, 2)}</pre>
                <p>
                  Read-only calls used 30,000 gas. A probe failure is not a
                  negative historical classification.
                </p>
              </details>
            )}
            {!artifact ? (
              <>
                <button className="button" onClick={load} disabled={loading}>
                  {loading
                    ? "Loading local evidence…"
                    : "Inspect captured bytecode and verified source"}
                </button>
                {error && <p role="alert">{error}</p>}
              </>
            ) : (
              <div>
                <HistorySamples artifact={artifact} />
                <details className="faq-item">
                  <summary>
                    Deployed runtime bytecode · {row.codeBytes} bytes
                  </summary>
                  <pre className="bytecode">{artifact.runtimeBytecode}</pre>
                </details>
                {artifact.relatedSources?.length > 0 && (
                  <>
                    <h3>Related source archives</h3>
                    <ul className="method-list">
                      {artifact.relatedSources.map(({ title, url }) => (
                        <li key={url}><a href={url}>{title} ↗</a></li>
                      ))}
                    </ul>
                  </>
                )}
                {Object.entries(providerSources).map(([name, value]) => (
                  <details className="faq-item" key={name}>
                    <summary>{name}</summary>
                    <pre>
                      {typeof value === "string"
                        ? value
                        : value.content || JSON.stringify(value, null, 2)}
                    </pre>
                  </details>
                ))}
                {!Object.keys(providerSources).length && (
                  <p>
                    No verified source was returned by the checked provider.
                    Runtime bytecode is preserved above.
                  </p>
                )}
                <details className="faq-item">
                  <summary>
                    {artifact.recompiledABI ? "Recompiled ABI · matched deployment" : "Captured ABI"}
                  </summary>
                  <pre>
                    {JSON.stringify(
                      artifact.recompiledABI?.abi || artifact.sourceResponse?.abi || [],
                      null,
                      2,
                    )}
                  </pre>
                </details>
              </div>
            )}
          </section>
          <section className="record-section">
            <h2>ETH review leads.</h2>
            <p>
              {hasFunds(row)
                ? `${row.balanceEth} ETH was held at the recorded block. This is not a claimable amount.`
                : "No ETH was held at this address at the recorded block. This does not describe past balances or other assets."}
            </p>
            {row.withdrawalFunctions?.length > 0 ? (
              <>
                <h3>ABI names worth investigating</h3>
                <ul>
                  {row.withdrawalFunctions.map((f, index) => (
                    <li key={index}>
                      <code>
                        {f.name}(
                        {f.inputs.map((input) => input.type).join(", ")})
                      </code>{" "}
                      · {f.stateMutability || "mutability not provided"}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>
                No withdrawal-like names were found in the available ABI. Other
                code paths may exist.
              </p>
            )}
            {row.preliminaryNotes?.map((note, index) => (
              <aside className="callout" key={index}>
                <strong>Preliminary source reading · {note.scope}</strong>
                <p>{note.finding}</p>
                <p className="mono">
                  {note.file} · lines {note.lines}
                </p>
                <p>
                  Source-based interpretation only. Current permissions,
                  balances owed to individual users, and recovery eligibility
                  have not been established.
                </p>
              </aside>
            ))}
            <ol>
              <li>
                Identify owners, beneficiaries, deposits and outstanding
                obligations.
              </li>
              <li>
                Trace every value-transfer path, its permissions and required
                state.
              </li>
              <li>
                Inspect proxies, implementation changes and historical
                transactions.
              </li>
              <li>
                Establish authorization and entitlement before considering
                recovery.
              </li>
            </ol>
          </section>
          <section className="record-section">
            <h2>The collection evaluation worksheet.</h2>
            <p>
              These are the same dimensions used for documented collections.
              Unknown values remain unknown; this contract receives no invented
              grade.
            </p>
            <dl className="worksheet">
              {worksheet.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <Worksheet address={row.address} />
            <a
              className="button"
              href={correction(
                `Research: ${row.address}`,
                `List: the 0xzxch list\nAttribution: ${attributionURL}\nSource contract: ${row.address}\nSnapshot block: ${researchSource.blockNumber}\n\nNFT status and supporting evidence:\nOriginal asset identity / ownership / transfers:\nSupply and mint limits:\nAsset storage:\nWrapper and unwrap behavior:\nDevelopment / marketplace status (with review date):\nSecurity concerns:\nETH balance and permissions / beneficiaries / liabilities (not assumed claimable):\nSources / transaction hashes / block numbers:\n`,
              )}
            >
              Submit a separate research note ↗
            </a>
          </section>
        </div>
        <aside className="record-sidebar provenance">
          <h3>Research provenance</h3>
          <p>Automated evidence capture, not a completed human source audit.</p>
          <a href={attributionURL}>Attribution: @0xzxch ↗</a>
          <a href={researchSource.url}>Original list ↗</a>
          <span>Captured {researchSource.capturedAt.slice(0, 10)}</span>
          <span>Ethereum mainnet · chain 1</span>
          <a
            href={`${source.repository}/tree/${source.revision}/research/etherr`}
          >
            Versioned research artifacts ↗
          </a>
          <p className="muted">
            Source runtime matching is reported independently of NFT classification.
          </p>
        </aside>
      </div>
    </article>
  );
}
