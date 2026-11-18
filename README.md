# NFT Archaeology

The existing React site, published as static files on Netlify. No API server or database is needed.

## Run locally

Use Node 22 and npm:

```sh
npm ci
npm start
```

`npm start`, `npm run build`, and `npm test` first download the pinned content from GitHub. Internet access and `tar` are required at build time. Visitors need neither GitHub nor the former API to load the catalogue or its images.

```sh
npm test -- --watchAll=false
npm run build
```

The deployable site is in `build/`. Generated files under `src/generated/` and copied images under `public/data/` are ignored by Git.

## Source of truth and updates

All editorial data and images remain in [Pixel-Map/historicalNFTs](https://github.com/Pixel-Map/historicalNFTs). Edit YAML there, not in generated files here.

`historical-nfts.source.json` pins a full upstream commit SHA. Each build downloads that revision, validates records against its schema, checks image references and existing collection URLs, and generates the catalogue. An unavailable or invalid source fails the build rather than publishing an empty catalogue. The deployed `/data/source.json` records its provenance.

To publish new content:

1. Merge YAML/image changes in `historicalNFTs`.
2. Set `revision` in `historical-nfts.source.json` to that commit's full SHA.
3. Run tests and the production build, then push this repo to the branch Netlify deploys.

Data repo changes alone do not trigger publication. Pinning makes deployments repeatable and keeps unreviewed data changes out of production.

The original API's year, score, and grade calculations are preserved in `scripts/build-data.mjs`. When changing that upstream policy, update the build calculation too. The pinned source has one known schema violation: Angel Battles' excerpt exceeds 280 characters. The build accepts only that field/constraint at that exact revision and preserves the text. Resolve it upstream before advancing the pin.

Logos and Markdown images hosted on the old API are copied into `/data/images/`. External links and optional Twitter/Dune embeds remain external. The obsolete price feed and hardcoded USD conversion have been removed.

## Netlify

`netlify.toml` specifies Node 22, `npm run build`, and publish directory `build`. Keep the existing Netlify domain configuration.

The SPA rewrite in `public/_redirects` (also declared in Netlify config) preserves direct requests and refreshes for `/explore`, `/timeline`, `/faq`, and `/nft-details/:id`. Existing assets are served before the fallback. Unknown collection IDs show a recovery link instead of loading forever.

Push validated changes to the site's production branch to deploy through its existing Git integration. Alternatively, from an authenticated Netlify CLI:

```sh
netlify deploy --dir=build --prod
```

No GitHub Pages setup or DNS change is necessary.
