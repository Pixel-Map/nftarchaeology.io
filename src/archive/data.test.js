import {
  compareWei,
  nfts,
  candidates,
  unresolved,
  source,
  researchSource,
  queryCollections,
  researchResults,
  compareIds,
  updateParam,
  marketURL,
} from "./data";

test("ETH sorting preserves differences below floating-point precision", () => {
  expect(compareWei("1000000000000000000001", "1000000000000000000000")).toBe(
    1,
  );
  expect(compareWei("0", "000")).toBe(0);
  expect(compareWei("999", "1000")).toBe(-1);
});

test("finds original and wrapper addresses irrespective of case", () => {
  const pixelmap = nfts.find((nft) => nft.slug === "pixelmap");
  for (const address of [
    pixelmap.contracts[0].address,
    pixelmap.wrapperContract.address,
  ]) {
    expect(
      queryCollections(new URLSearchParams({ q: address.toUpperCase() })).map(
        (n) => n.slug,
      ),
    ).toContain("pixelmap");
  }
});

test("combines OR within a facet and AND across facets; sorting and saved views work", () => {
  expect(
    queryCollections(
      new URLSearchParams("year=2016&category=Billboard&category=Lottery"),
    ).map((n) => n.slug),
  ).toEqual(["pixelmap"]);
  expect(
    queryCollections(new URLSearchParams("saved=1"), ["pixelmap"]).map(
      (n) => n.slug,
    ),
  ).toEqual(["pixelmap"]);
  expect(queryCollections(new URLSearchParams("saved=1"), [])).toEqual([]);
  const oldest = queryCollections(new URLSearchParams());
  const newest = queryCollections(new URLSearchParams("sort=newest"));
  expect(newest.map((n) => n.slug)).toEqual(
    [...oldest].reverse().map((n) => n.slug),
  );
  expect(queryCollections(new URLSearchParams("year=1800"))).toEqual([]);
});

test("filter removal preserves search and view; comparison only accepts four distinct real entries", () => {
  expect(
    updateParam(
      new URLSearchParams("q=art&year=2017&year=2018&view=table&page=2"),
      "year",
      "2017",
      true,
    ).toString(),
  ).toBe("q=art&view=table&year=2018");
  expect(compareIds("pixelmap,pixelmap,missing,etheria")).toEqual([
    "pixelmap",
    "etheria",
  ]);
  expect(
    compareIds(
      nfts
        .slice(0, 8)
        .map((n) => n.slug)
        .join(","),
    ),
  ).toHaveLength(4);
});

test("research retains every unique source address, known matches are excluded by default, and facts remain unresolved", () => {
  expect(candidates).toHaveLength(researchSource.count);
  expect(new Set(candidates.map((row) => row.address)).size).toBe(
    candidates.length,
  );
  expect(researchResults(new URLSearchParams())).toHaveLength(
    unresolved.length,
  );
  expect(researchResults(new URLSearchParams("known=include"))).toHaveLength(
    candidates.length,
  );
  expect(source.revision).toMatch(/^[a-f0-9]{40}$/);
  for (const row of candidates) {
    expect(row.status).toBe("unresolved");
    expect(row.balanceWei).toMatch(/^\d+$/);
    expect(row.runtimeSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(row.evaluation.ethRecoverability).toBe("not-assessed");
  }
  for (const row of candidates.filter((row) => row.known.length))
    expect(unresolved).not.toContain(row);
});

test("deployment timestamps preserve UTC and placeholder marketplace links are omitted", () => {
  expect(nfts.find((n) => n.slug === "pixelmap").deployedAt).toBe(
    "2016-11-17T04:29:10.000Z",
  );
  expect(nfts.every((nft) => Number.isFinite(Date.parse(nft.deployedAt)))).toBe(
    true,
  );
  expect(marketURL(nfts.find((n) => n.slug === "cryptopunks"))).toBe(null);
});
