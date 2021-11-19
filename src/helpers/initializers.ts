import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import { BNFT, TokenOwner } from "../../generated/schema";
import { zeroAddress, zeroBD, zeroBI } from "../utils/converters";
import { getBNftId, getTokenOwnerId } from "../utils/id-generation";

export function getOrInitBNFT(bNftAddress: Address): BNFT {
  let bnftId = getBNftId(bNftAddress);
  let bnft = BNFT.load(bnftId);
  if (!bnft) {
    bnft = new BNFT(bnftId);
    bnft.nftAsset = new Bytes(1);
    bnft.symbol = "";
    bnft.name = "";
    bnft.tokenContractImpl = zeroAddress();
    bnft.lifetimeMints = zeroBI();
    bnft.lifetimeBurns = zeroBI();
    bnft.lifetimeFlashLoans = zeroBI();
  }
  return bnft as BNFT;
}

export function getOrInitTokenOwner(nftAsset: Address, tokenId: BigInt): TokenOwner {
  let itemId = getTokenOwnerId(nftAsset, tokenId);
  let item = TokenOwner.load(itemId);
  if (!item) {
    item = new TokenOwner(itemId);
    item.bnft = "";
    item.nftAsset = new Bytes(1);
    item.nftTokenId = tokenId;
    item.owner = zeroAddress();
    item.tokenUri = "";
  }
  return item as TokenOwner;
}
