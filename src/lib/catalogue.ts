import records from '../generated/nfts.json';
import filters from '../generated/filters.json';
import { NFT } from '../interfaces/nft.interface';

export const nfts = records as NFT[];
export const filterOptions = filters;

type Selection = { field: string; checked: boolean };
export type CatalogueFilters = Record<'year' | 'standard' | 'assetDataLocation' | 'categories', Selection[]>;

export function filterNFTs(selections: CatalogueFilters): NFT[] {
  return nfts.filter(nft => Object.entries(selections).every(([field, options]) => {
    const selected = options.filter(option => option.checked).map(option => option.field);
    const value = nft[field as keyof CatalogueFilters];
    return Array.isArray(value)
      ? value.some(item => selected.includes(item))
      : selected.includes(String(value));
  }));
}

export function getNFT(slug: string | undefined): NFT | undefined {
  return nfts.find(nft => nft.slug === slug);
}
