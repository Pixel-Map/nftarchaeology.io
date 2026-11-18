import records from "../generated/nfts.json";
import source from "../generated/source.json";
import research from "../generated/research.json";
import researchSource from "../generated/research-source.json";

export const nfts = [...records].sort((a, b) =>
  a.deployedAt.localeCompare(b.deployedAt),
);
export { source, researchSource };
export const bySlug = Object.fromEntries(nfts.map((nft) => [nft.slug, nft]));
export const contractIndex = {};
for (const nft of nfts) {
  for (const contract of [
    ...nft.contracts,
    ...(nft.wrapperContract
      ? [{ name: "Wrapper", ...nft.wrapperContract }]
      : []),
  ]) {
    const key = contract.address.toLowerCase();
    contractIndex[key] = [
      ...(contractIndex[key] || []),
      { slug: nft.slug, title: nft.title, role: contract.name },
    ];
  }
}
export const candidates = research.map((row) => ({
  ...row,
  known: contractIndex[row.address.toLowerCase()] || [],
}));
export const unresolved = candidates.filter((row) => !row.known.length);
export const facets = {
  year: "Deployment year",
  storage: "Asset storage",
  standard: "Token standard",
  category: "Category",
};
const fields = {
  year: "year",
  storage: "assetDataLocation",
  standard: "standard",
  category: "categories",
};
export const options = Object.fromEntries(
  Object.entries(fields).map(([key, field]) => [
    key,
    [
      ...new Set(
        nfts
          .flatMap((nft) => nft[field])
          .filter(Boolean)
          .map(String),
      ),
    ].sort(),
  ]),
);
export const shortAddress = (address) =>
  `${address.slice(0, 8)}…${address.slice(-6)}`;
export const date = (iso) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
export const sourceFile = (nft) =>
  `${source.repository}/blob/${source.revision}/nfts/${nft.slug}.yaml`;
export const correction = (title, body) =>
  `${source.repository}/issues/new?${new URLSearchParams({ title, body })}`;
export const marketURL = (nft) =>
  nft.openseaCollection && !nft.openseaCollection.includes("/placeholder")
    ? nft.openseaCollection
    : null;
const text = (value) =>
  String(value || "")
    .normalize("NFKD")
    .toLowerCase();

export function queryCollections(params, saved = [], omitFacet = "") {
  const q = text(params.get("q")).trim();
  const result = nfts.filter((nft) => {
    const searchable = [
      nft.title,
      nft.excerpt,
      ...(nft.creators || []),
      ...nft.categories,
      ...nft.contracts.map((c) => c.address),
      nft.wrapperContract?.address,
    ].join(" ");
    return (
      (!q || text(searchable).includes(q)) &&
      (!params.has("saved") || saved.includes(nft.slug)) &&
      (!params.has("concerns") || nft.flags.length > 0) &&
      Object.entries(fields).every(
        ([key, field]) =>
          key === omitFacet ||
          !params.has(key) ||
          params
            .getAll(key)
            .some((value) =>
              (Array.isArray(nft[field])
                ? nft[field].map(String)
                : [String(nft[field])]
              ).includes(value),
            ),
      )
    );
  });
  const sort = params.get("sort");
  return result.sort((a, b) =>
    sort === "name"
      ? a.title.localeCompare(b.title)
      : (sort === "newest" ? -1 : 1) * a.deployedAt.localeCompare(b.deployedAt),
  );
}

export function researchResults(params) {
  const q = text(params.get("q")).trim();
  return candidates
    .filter(
      (row) =>
        (!row.known.length || params.get("known") === "include") &&
        (!q ||
          text(
            [
              row.name,
              row.address,
              row.category,
              ...(row.sourceFileNames || []),
              ...(row.abiFunctionNames || []),
              ...row.selectors.map((s) => s.signature),
            ].join(" "),
          ).includes(q)) &&
        (!params.get("year") || row.year === params.get("year")) &&
        (!params.get("signal") || row.signal === params.get("signal")),
    )
    .sort((a, b) =>
      params.get("sort") === "name"
        ? (a.name || a.address).localeCompare(b.name || b.address)
        : (params.get("sort") === "newest" ? -1 : 1) *
          a.created.localeCompare(b.created),
    );
}

export function updateParam(params, key, value, multiple = false) {
  const next = new URLSearchParams(params);
  const existing = next.getAll(key);
  next.delete(key);
  if (multiple) {
    for (const item of existing.includes(value)
      ? existing.filter((item) => item !== value)
      : [...existing, value])
      next.append(key, item);
  } else if (value) next.set(key, value);
  next.delete("page");
  return next;
}

export function compareIds(value) {
  return [...new Set((value || "").split(","))]
    .filter((id) => bySlug[id])
    .slice(0, 4);
}

// Compare unsigned integer strings without floating-point rounding or BigInt polyfills.
export function compareWei(left, right) {
  const a = String(left).replace(/^0+/, "") || "0";
  const b = String(right).replace(/^0+/, "") || "0";
  return a.length !== b.length
    ? Math.sign(a.length - b.length)
    : a === b
      ? 0
      : a > b
        ? 1
        : -1;
}
