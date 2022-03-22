export const sortNFTs = (nfts: unknown[]) => {
  return nfts.sort(
// @ts-ignore
    (a, b) =>
      // @ts-ignore
      new Date(a.creationTimestamp.replace(" +UTC", "")) -
      // @ts-ignore
      new Date(b.creationTimestamp.replace(" +UTC", ""))
  );
}