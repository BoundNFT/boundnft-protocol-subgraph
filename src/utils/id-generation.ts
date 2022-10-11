import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Address } from "@graphprotocol/graph-ts/index";

export enum EventTypeRef {
  NoType,
  Mint,
  Burn,
  FlashLoan,
  flashLoanApprove,
}

export function getHistoryId(event: ethereum.Event, type: EventTypeRef = EventTypeRef.NoType): string {
  let postfix = type !== EventTypeRef.NoType ? ":" + type.toString() : "";
  return event.transaction.hash.toHexString() + postfix;
}

export function getHistoryEntityId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + ":" + event.logIndex.toString();
}

export function getRegistryId(registryAddress: Address): string {
  return registryAddress.toHexString();
}

export function getBNftId(registryId: string, bnftAddress: Address): string {
  return registryId + bnftAddress.toHexString();
}

export function getTokenItemId(registryId: string, bnftId: string, tokenId: BigInt): string {
  return registryId + bnftId + tokenId.toString();
}

export function getFlashLoanApproveItemId(
  registryId: string,
  bnftId: string,
  owner: Address,
  operator: Address
): string {
  return registryId + bnftId + owner.toHexString() + operator.toHexString();
}
