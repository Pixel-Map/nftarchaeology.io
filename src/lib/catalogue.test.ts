import { filterNFTs, getNFT, nfts, filterOptions, CatalogueFilters } from './catalogue';

function allFilters(): CatalogueFilters {
  const options = (values: string[]) => values.map(field => ({ field, checked: true }));
  return {
    year: options(Array.from(new Set(nfts.map(nft => String(nft.year))))),
    standard: options(filterOptions.Standard),
    assetDataLocation: options(filterOptions.AssetDataLocation),
    categories: options(filterOptions.Category),
  };
}

test('all collections have detail URLs, local logos, and grades', () => {
  expect(nfts.length).toBeGreaterThanOrEqual(18);
  expect(getNFT('pixelmap')?.title).toBe('PixelMap');
  expect(filterNFTs(allFilters())).toHaveLength(nfts.length);
  for (const nft of nfts) {
    expect(getNFT(nft.slug)).toBe(nft);
    expect(nft.logo).toMatch(/^\/data\/images\//);
    expect(nft.grade).toMatch(/^[ABCDF][+-]?$/);
  }
  expect(getNFT('missing-collection')).toBeUndefined();
  expect(JSON.stringify(nfts)).not.toContain('api.nftarchaeology.io');
});

test('combines years and categories, matching any selected category', () => {
  const filters = allFilters();
  filters.year = [{ field: '2016', checked: true }];
  filters.categories = [{ field: 'Billboard', checked: true }, { field: 'Lottery', checked: true }];
  expect(filterNFTs(filters).map(nft => nft.slug)).toEqual(['pixelmap']);
});

test('unchecking every option in any group returns no collections', () => {
  for (const field of ['year', 'standard', 'assetDataLocation', 'categories'] as const) {
    const filters = allFilters();
    filters[field] = filters[field].map(option => ({ ...option, checked: false }));
    expect(filterNFTs(filters)).toEqual([]);
  }
});
