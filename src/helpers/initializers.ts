import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import { ContractMapping, Registry, BNFT, TokenItem, FlashLoanApproveItem } from "../../generated/schema";
import { zeroAddress, zeroBD, zeroBI } from "../utils/converters";
import { getRegistryId, getBNftId, getTokenItemId, getFlashLoanApproveItemId } from "../utils/id-generation";

export function getRegistryByEvent(event: ethereum.Event): string {
  let contractAddress = event.address.toHexString();
  let contractMapping = ContractMapping.load(contractAddress);
  if (contractMapping === null) {
    throw new Error(contractAddress + "is not registered in ContractMapping");
  }
  return contractMapping.registry;
}

export function getRegistryByAddress(address: Address): string {
  let contractAddress = address.toHexString();
  let contractMapping = ContractMapping.load(contractAddress);
  if (contractMapping === null) {
    throw new Error(contractAddress + "is not registered in ContractMapping");
  }
  return contractMapping.registry;
}

export function createMapContractToRegistry(_contractAddress: Address, registry: string): void {
  let contractMapping = getOrInitContractMapping(_contractAddress);
  contractMapping.registry = registry;
  contractMapping.save();
}

export function getOrInitContractMapping(_contractAddress: Address): ContractMapping {
  let contractAddress = _contractAddress.toHexString();
  let contractMapping = ContractMapping.load(contractAddress);
  if (!contractMapping) {
    contractMapping = new ContractMapping(contractAddress);
    contractMapping.registry = "";
  }

  return contractMapping as ContractMapping;
}

export function getOrInitRegistry(registryAddress: Address): Registry {
  let registryId = getRegistryId(registryAddress);
  let registry = Registry.load(registryId);
  if (!registry) {
    registry = new Registry(registryId);
    registry.bnftGenericImpl = new Bytes(1);
    registry.totalBNFTs = zeroBI();
  }
  return registry as Registry;
}

export function getOrInitBNFT(registryId: string, bnftAddress: Address): BNFT {
  let bnftId = getBNftId(registryId, bnftAddress);
  let bnft = BNFT.load(bnftId);
  if (!bnft) {
    bnft = new BNFT(bnftId);
    bnft.registry = registryId;
    bnft.symbol = "";
    bnft.name = "";
    bnft.bnftProxy = bnftAddress;
    bnft.bnftImpl = zeroAddress();

    bnft.nftAsset = new Bytes(1);
    bnft.nftSymbol = "";
    bnft.nftName = "";

    bnft.lifetimeMints = zeroBI();
    bnft.lifetimeBurns = zeroBI();
    bnft.lifetimeFlashLoans = zeroBI();

    bnft.totalTokens = zeroBI();
  }
  return bnft as BNFT;
}

export function getOrInitTokenItem(registryId: string, bnftId: string, tokenId: BigInt): TokenItem {
  let itemId = getTokenItemId(registryId, bnftId, tokenId);
  let item = TokenItem.load(itemId);
  if (!item) {
    item = new TokenItem(itemId);
    item.registry = registryId;
    item.bnft = "";
    item.tokenId = tokenId;
    item.owner = zeroAddress();
    item.tokenUri = "";
    item.minter = zeroAddress();
  }
  return item as TokenItem;
}

export function getOrInitFlashLoanApproveItem(
  registryId: string,
  bnftId: string,
  owner: Address,
  operator: Address
): FlashLoanApproveItem {
  let itemId = getFlashLoanApproveItemId(registryId, bnftId, owner, operator);
  let item = FlashLoanApproveItem.load(itemId);
  if (!item) {
    item = new FlashLoanApproveItem(itemId);
    item.registry = registryId;
    item.bnft = bnftId;
    item.owner = owner;
    item.operator = operator;
    item.approved = false;
  }
  return item as FlashLoanApproveItem;
}
