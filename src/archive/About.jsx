import React from "react";
import { Link } from "react-router-dom";
import { nfts, source, researchSource, correction } from "./data";
import { PageHead } from "./components";
import { attributionURL } from "./Research";

export function FAQ() {
  const questions = [
    [
      "What does this archive cover?",
      `The current catalogue documents ${nfts.length} Ethereum collections with deployment dates from 2015 through 2019. It is a community-curated selection, not a complete census of historical NFTs.`,
    ],
    [
      "What makes an early contract an NFT?",
      "A standard name or token interface is not sufficient by itself. Research needs to establish distinct asset identity, ownership, and how ownership can change. Some early designs predate ERC-721 and use unconventional representations, so they need contract-specific analysis.",
    ],
    [
      "What is a wrapper?",
      "A wrapper is a separate contract that can represent an older asset through a newer interface. Whether it preserves a reversible relationship with the original depends on the implementation. The archive records original contracts and wrappers separately.",
    ],
    [
      "What is a semi-fungible token?",
      "Some systems issue multiple interchangeable copies of a particular asset or edition. That differs from a single unique token. The source record’s non-fungibility field should be read alongside its contract design and notes.",
    ],
    [
      "What does “on-chain” mean here?",
      "The source record describes where asset data is stored. This can mean different things for different projects: inspect which data is present on-chain, which data is generated, and which references lead to external storage.",
    ],
    [
      "Why are some marketplace and project details dated?",
      "The archive is built from a versioned community snapshot. A website build is not a new verification of project activity, invite links, marketplace badges, or external destinations. Editorial review dates are shown as unknown where they have not been recorded.",
    ],
    [
      "Does a research-list balance mean ETH is claimable?",
      "No. It means that address held ETH at a specified block. Permissions, beneficiaries, liabilities, required state, and legal entitlement have not been established. A function named claim or withdraw does not establish that any visitor can use it.",
    ],
    [
      "Are research candidates confirmed historical NFTs?",
      "No. The 0xzxch list is a separate research queue. Source labels and recognized method selectors are investigation leads. Exact address matches to existing catalogue contracts are identified, while other candidates remain unresolved.",
    ],
    [
      "How do I contribute a correction?",
      "Use Suggest a correction on a collection, or Submit research evidence on a candidate. Include the field, proposed interpretation, source links, relevant transaction hashes and block numbers. Contributions are reviewed in the historicalNFTs GitHub repository.",
    ],
    [
      "Where are my saved collections stored?",
      "Bookmarks are stored only in your browser. There is no account or server-side reading list. If storage is blocked, bookmarks work for the current visit and the site shows a notification.",
    ],
  ];
  return (
    <div className="page-wrap narrow">
      <PageHead label="Reading the archive" title="Questions, answered.">
        <p>Definitions, scope, and how to interpret the evidence.</p>
      </PageHead>
      {questions.map(([question, answer]) => (
        <details className="faq-item" key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
      <p>
        <Link to="/about#contribute">Contribute to the source record ↗</Link>
      </p>
    </div>
  );
}

export default function About() {
  return (
    <div className="page-wrap narrow">
      <PageHead
        label="Scope · evidence · contributions"
        title="History needs a paper trail."
      >
        <p>
          NFT Archaeology is a community archive of early Ethereum collections,
          maintained by the team behind PixelMap with contributing researchers.
        </p>
      </PageHead>
      <section className="record-section">
        <h2>What the archive represents.</h2>
        <p>
          The current collection index contains {nfts.length} records from
          2015–2019, all on Ethereum. Dates, descriptions, asset properties and
          concerns come from <a href={source.repository}>historicalNFTs ↗</a>.
          The index is not a claim of complete coverage.
        </p>
        <p>
          Contract behavior is the primary evidence for technical assertions.
          Creator statements and contemporary sources help establish intent and
          context. A historical “first” needs a precise definition and
          supporting evidence; it is not inferred from age alone.
        </p>
        <p>
          Each entry links to its exact source revision and record history.
          Development and marketplace status describe the source snapshot, not a
          current certification. Where editorial review dates are absent, the
          interface says so.
        </p>
      </section>
      <section className="record-section">
        <h2>Attributes, not a single verdict.</h2>
        <p>
          The interface presents supply, storage, standards, wrapper behavior
          and recorded concerns independently. The old API’s numerical score and
          grade remain in the downloadable data for compatibility, but are not
          used to rank historical significance or safety.
        </p>
        <p>
          That legacy formula begins at 100, subtracts 5 for inactive
          development, 10 for non-fixed supply, 5 for a non-fungible flag
          recorded false, 5 for absent marketplace verification, and 10 for
          storage other than on-chain or IPFS. It adds 8 for on-chain storage
          and subtracts 6 per warning or 25 per alert. Scores can exceed 100.
          These policy choices are not a measure of historical importance.
        </p>
        <p>
          Recorded concerns are reviewable statements, not a complete security
          audit. An empty concerns list means no concerns are recorded in that
          source snapshot.
        </p>
      </section>
      <section className="record-section" id="research-method">
        <h2>Researching the 0xzxch list.</h2>
        <p>
          The contract leads are attributed to{" "}
          <a href={attributionURL}>@0xzxch’s source post ↗</a> and captured from{" "}
          <a href={researchSource.url}>the original list ↗</a>. Names, dates and
          source categories are retained as source assertions.
        </p>
        <ol>
          <li>
            Every source address receives an Ethereum mainnet runtime-code and
            ETH-balance check at the same recorded block.
          </li>
          <li>
            Actual runtime bytecode is preserved in downloadable per-contract
            artifacts. SHA-256 hashes and the block hash anchor the capture.
          </li>
          <li>
            A limited EVM disassembly collects recognized PUSH4 operands. These
            are heuristic method signals; not an ABI, a proof of behavior, or an
            NFT classification.
          </li>
          <li>
            When a supportsInterface selector appears, read-only ERC-165,
            invalid-ID, ERC-721 and ERC-1155 probes are captured with a
            30,000-gas limit.
          </li>
          <li>
            Sourcify is checked for verified source and ABI. Provider
            verification status and exact runtime equality against the snapshot
            are recorded separately. A failed lookup does not imply source is
            unavailable everywhere.
          </li>
          <li>
            Exact, case-insensitive original or wrapper address matches identify
            existing catalogue entries. Names alone do not establish
            equivalence.
          </li>
          <li>
            Human evaluation must establish ownership, transfer behavior,
            supply, storage, wrapper relationships, maintenance evidence and
            security concerns before a candidate becomes a collection entry.
          </li>
        </ol>
        <p>
          ETH held is not an estimate of recoverable or claimable funds.
          Withdrawal-like ABI names are only leads. Permissions, beneficiaries,
          deposits, liabilities, proxies and historical state must be reviewed.
          The site performs no wallet interactions or transactions.
        </p>
        <p>
          Automated evidence capture: {researchSource.capturedAt.slice(0, 10)} ·
          block{" "}
          <a href={`https://etherscan.io/block/${researchSource.blockNumber}`}>
            {researchSource.blockNumber} ↗
          </a>
          . Human review status is recorded separately.
        </p>
        <a href="/data/research-source.json">Download research provenance ↓</a>
      </section>
      <section className="record-section">
        <h2>Source lookup coverage.</h2>
        <p>{researchSource.sourceLookupLimitation}</p>
        <p>
          Every address still has actual runtime bytecode and exact balance
          evidence. Source lookup failures and skipped lookups remain explicit;
          a bytecode capture is not a recovered Solidity source file.
        </p>
      </section>
      <section className="record-section" id="contribute">
        <h2>Leave the next researcher a trail.</h2>
        <p>
          Editorial changes stay in{" "}
          <a href={source.repository}>historicalNFTs ↗</a>. Propose an issue or
          pull request with:
        </p>
        <ol>
          <li>The exact original, wrapper, or related contract addresses.</li>
          <li>What is being asserted, and what remains uncertain.</li>
          <li>
            Source code links, transaction hashes, block numbers, contemporary
            references and dates.
          </li>
          <li>
            Evidence for each relevant field: distinct ownership and transfers,
            supply, storage, wrapper reversibility, maintenance and concerns.
          </li>
          <li>
            A human review date and reviewer identity, if an actual review has
            been performed.
          </li>
        </ol>
        <a
          className="button primary"
          href={correction(
            "New historical collection or research finding",
            "Contract addresses:\nProposed collection / research finding:\nDeployment evidence:\nOwnership and transfers:\nSupply and storage:\nWrapper relationships:\nRecorded concerns:\nSupporting sources / transactions / blocks:\nUnresolved questions:\nReviewer and review date (if reviewed):\n",
          )}
        >
          Propose a sourced contribution ↗
        </a>
        <p>
          The website downloads a pinned data revision at build time. After a
          data change is reviewed and merged, advancing the frontend pin
          publishes the new snapshot.
        </p>
      </section>
      <section className="record-section">
        <h2>Reuse the research.</h2>
        <p>
          Downloads include the source revision and separate source records from
          generated fields. Bookmarks are browser-local, and filtered
          collection, research and comparison views can be shared by URL.
        </p>
        <p>
          <a href="/data/catalogue.json" download>
            Collection dataset ↓
          </a>{" "}
          ·{" "}
          <a href="/data/research.json" download>
            Research evidence index ↓
          </a>{" "}
          · <a href="/data/source.json">Source pin ↗</a>
        </p>
      </section>
    </div>
  );
}
