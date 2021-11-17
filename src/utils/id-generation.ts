import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Address } from "@graphprotocol/graph-ts/index";

export enum EventTypeRef {
  NoType,
  Mint,
  Burn,
  FlashLoan,
}

export function getHistoryId(event: ethereum.Event, type: EventTypeRef = EventTypeRef.NoType): string {
  let postfix = type !== EventTypeRef.NoType ? ":" + type.toString() : "";
  return event.transaction.hash.toHexString() + postfix;
}

export function getHistoryEntityId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + ":" + event.logIndex.toString();
}

export function getBNftId(bNftAddress: Address): string {
  return bNftAddress.toHexString();
}

export function getNftAssetId(nftAsset: Address): string {
  return nftAsset.toHexString();
}

export function getTokenOwnerId(nftAsset: Address, tokenId: BigInt): string {
  return nftAsset.toHexString() + tokenId.toString();
}