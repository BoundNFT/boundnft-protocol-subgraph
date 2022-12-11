import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Address } from "@graphprotocol/graph-ts/index";

export function getHistoryEntityId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + ":" + event.logIndex.toString();
}

export function getRegistryId(registryAddress: Address): string {
  return registryAddress.toHexString();
}

export function getBNftId(registryId: string, bnftAddress: Address): string {
  return registryId + bnftAddress.toHexString();
}

export function getTokenItemId(bnftId: string, tokenId: BigInt): string {
  return bnftId + tokenId.toString();
}

export function getBNFTMinterId(bnftId: string, minterAddress: Address): string {
  return bnftId + minterAddress.toHexString();
}
