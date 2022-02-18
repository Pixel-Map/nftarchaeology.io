import {NFT} from "../interfaces/nft.interface";


export const getFilteredNFTs = (nfts: NFT[], assetStorageTypesFilter: { field: string, checked: boolean }[], yearFilter: { field: string, checked: boolean }[], standardFilter: { field: string, checked: boolean }[]) => {
  const filteredNFTs = []
  for (const nft of nfts) {
    let matchesAssetStorageType = false
    for (const assetStorageType of assetStorageTypesFilter) {
      if (assetStorageType.checked) {
        if (nft.assetDataLocation.toLowerCase() === assetStorageType.field.toLowerCase()) {
          matchesAssetStorageType = true
        }
      }
    }

    let matchesYearFilter = false
    for (const year of yearFilter) {
      if (year.checked) {
        if (new Date(nft.creationTimestamp.replace(" +UTC","")).getFullYear().toString().toLowerCase() === year.field.toLowerCase()) {
          matchesYearFilter = true
        }
      }
    }

    let matchesStandardFilter = false
    for (const ercStandard of standardFilter) {
      if (ercStandard.checked) {
        if (nft.standard.toLowerCase() === ercStandard.field.toLowerCase()) {
          matchesStandardFilter = true
        }
      }
    }

    if (matchesAssetStorageType && matchesYearFilter && matchesStandardFilter) {
      filteredNFTs.push(nft)
    }
  }
  return filteredNFTs
}