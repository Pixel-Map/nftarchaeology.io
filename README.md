# NFT Archaeology

A static, prerendered archive on Netlify. Editorial records and research artifacts live in [Pixel-Map/historicalNFTs](https://github.com/Pixel-Map/historicalNFTs); there is no runtime API, wallet integration or database.

## Development and checks

Use Node 22 and npm:

```sh
npm ci
npm start
```

Start/build/test first download and validate the exact source revision in `historical-nfts.source.json`. Internet access and `tar` are required at build time. A source or evidence validation failure stops publication.

```sh
npm test -- --watchAll=false --runInBand
npm run build
npm run check:ui
npm run preview
```

Preview: http://127.0.0.1:5173. `build/` is the complete deployment. Build runs prerendering and a mandatory local link/anchor/asset check. CI also tests the real production bundle in JSDOM; this verifies behavior and hydration, not visual layout.

`npm run check:links -- --external` optionally checks recorded external destinations and writes `.cache/external-link-check.json`. HTTP restrictions and failures remain unresolved receipts; this command never changes editorial data. The known CryptoPunks placeholder marketplace destination is omitted from the interface until a sourced correction is made upstream.

## Browsing and research tools

The original dark purple palette, logo and Urbanist font are retained. The homepage has three upward-flowing NFT columns with a persistent pause/browse control, an accessible still-gallery mode, and reduced-motion support. Urbanist is self-hosted with its OFL license; typography and artwork do not depend on a third-party font service.

- Collection search includes titles, descriptions, creators and original/wrapper addresses, case-insensitively.
- Explore filters, sorting, table layout and saved-only views use URL parameters. Unselected facet groups mean any value; multiple values within a group are OR, groups combine with AND. Empty category options are omitted, and dynamic counts describe results within the other active filters.
- Bookmarks, theme preference and per-contract evaluation drafts are browser-local. Blocked storage falls back to the current visit with a notice. Drafts can be downloaded or proposed through GitHub; they never modify source evidence or published classifications.
- Compare accepts up to four real collection slugs in `/compare?ids=pixelmap,etheria`. Original and wrapper contracts stay separate.
- Timeline uses explicit UTC deployment timestamps and year anchors. Wrapper creation and rediscovery dates are not inferred.
- Collection pages expose concerns, source YAML/history, missing review-date status, contracts, source links, related collections, and chronological navigation. External social/analytics widgets have been replaced by ordinary links.
- Legacy numerical scores and grades remain in the dataset for compatibility. The UI presents separate source-record attributes instead of a composite verdict.

## the 0xzxch list

The research section is attributed to [@0xzxch's post](https://x.com/0xzxch/status/2122996595637588119), using rows from https://etherr.eth.limo/.

Every source address has an individual runtime-code hash, code artifact, and exact ETH balance anchored to the recorded Ethereum mainnet block. Exact address matches to original/wrapper catalogue contracts are linked and excluded from the default unresolved queue. Source names/categories/dates remain unverified source assertions. Name similarity never establishes a catalogue match.

Captured verified source and ABIs are preserved when available, with provider verification and exact snapshot-runtime agreement recorded separately. Sourcify's API stated that bulk collection was not supported and returned rate limits, so bulk lookups were stopped. Remaining source lookups are explicitly incomplete; actual runtime bytecode is still preserved. Failed lookup does not establish that verified source is absent everywhere. Read `/data/research-source.json` for precise capture methodology and provider limitations.

Limited selector matching is triage, not proof of NFT behavior. Historical contracts, proxies, ownership, storage, minting paths, transfer behavior and security need source-specific review. The evaluation worksheet uses the catalogue dimensions while keeping unknown fields unknown. Preliminary source-reading notes are separately identified and do not establish NFT classification or a completed security review.

Funded filtering and exact-value sorting show ETH held at the snapshot. They do not establish claimability, entitlement or recovery potential. Withdrawal-like ABI names are leads only; permissions, beneficiaries, liabilities and current state need review. No transactions are sent.

Downloads: `/data/catalogue.json`, `/data/research.json`, `/data/research-source.json`, and `/data/contracts/{lowercase-address}.json`. Each contract artifact preserves runtime code, captured source/ABI response, block identity and attribution. The upstream repo retains the compressed originals and reproducible capture scripts.

## Updating content

1. Merge sourced YAML/research changes in `historicalNFTs`.
2. Advance `revision` in `historical-nfts.source.json` to the full upstream commit SHA.
3. Run tests, build and production UI checks; push the frontend to `main`.

Upstream changes alone do not publish. Generated `src/generated/`, `public/data/`, `.cache/` and `build/` are ignored; never hand-edit them as editorial source. The build validates complete research coverage, unique addresses, preserved source fields, code hashes, block identity and per-address artifact consistency.

## Netlify and static output

Netlify uses Node 22, `npm run build`, and publish directory `build`. Existing domain configuration stays in place. The build produces HTML for every collection and research address, route-specific titles/descriptions/canonical and social metadata, a PNG social image, sitemap, and a real `404.html`.

Unknown URLs return 404 through Netlify; known routes have their own index files. Research detail pages are `noindex,follow` while classifications remain unresolved; collection pages and the research overview remain discoverable. Parameterized views enhance the prerendered page client-side, without hydrating mismatched server markup. Unused marketplace template routes, demo bids, fake account pages and template assets have been removed.

Publishing uses the existing Netlify Git integration. A GitHub push and a successful local build are separate from live deployment verification; check the deployed `/data/source.json` and bundle identity after publication.
