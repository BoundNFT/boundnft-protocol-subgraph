import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import { BNFT } from "../../generated/schema";
import { zeroAddress, zeroBD, zeroBI } from "../utils/converters";
import { getBNftId } from "../utils/id-generation";

export function getOrInitBNFT(bNftAddress: Address): BNFT {
  let bnftId = getBNftId(bNftAddress);
  let bnft = BNFT.load(bnftId);
  if (!bnft) {
    bnft = new BNFT(bnftId);
    bnft.nftAsset = new Bytes(1);
    bnft.tokenContractImpl = zeroAddress();
  }
  return bnft as BNFT;
}
