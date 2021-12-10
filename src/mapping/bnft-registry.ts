import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { BNFTCreated, BNFTUpgraded } from "../../generated/BNFTRegistry/BNFTRegistry";

import { BNFT as BNFTContract } from "../../generated/templates";
import { ERC721 } from "../../generated/BNFTRegistry/ERC721";
import { getOrInitBNFT } from "../helpers/initializers";

export function handleBNFTCreated(event: BNFTCreated): void {
  BNFTContract.create(event.params.bNftProxy);

  let bnft = getOrInitBNFT(event.params.bNftProxy);

  bnft.nftAsset = event.params.nftAsset;
  bnft.tokenContractImpl = event.params.bNftImpl;

  let bNftContract = ERC721.bind(event.params.bNftProxy);

  let nameCallValue = bNftContract.try_name();
  if (!nameCallValue.reverted) {
    bnft.name = nameCallValue.value;
  }
  let symbolCallValue = bNftContract.try_symbol();
  if (!symbolCallValue.reverted) {
    bnft.symbol = symbolCallValue.value;
  }

  bnft.save();
}

export function handleBNFTUpgraded(event: BNFTUpgraded): void {
  let bnft = getOrInitBNFT(event.params.bNftProxy);

  bnft.tokenContractImpl = event.params.bNftImpl;

  let bNftContract = ERC721.bind(event.params.bNftProxy);

  let nameCallValue = bNftContract.try_name();
  if (!nameCallValue.reverted) {
    bnft.name = nameCallValue.value;
  }
  let symbolCallValue = bNftContract.try_symbol();
  if (!symbolCallValue.reverted) {
    bnft.symbol = symbolCallValue.value;
  }

  bnft.save();
}
