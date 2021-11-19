import { BNFTCreated, BNFTUpgraded } from "../../generated/BNFTRegistry/BNFTRegistry";

import { BNFT as BNFTContract } from "../../generated/templates";
import { IERC721Metadata } from "../../generated/BNFTRegistry/IERC721Metadata";
import { getOrInitBNFT } from "../helpers/initializers";

export function handleBNFTCreated(event: BNFTCreated): void {
  BNFTContract.create(event.params.bNftProxy);

  let bnft = getOrInitBNFT(event.params.bNftProxy);

  bnft.nftAsset = event.params.nftAsset;
  bnft.tokenContractImpl = event.params.bNftImpl;

  let bNftContract = IERC721Metadata.bind(event.params.bNftProxy);

  bnft.name = bNftContract.name();
  bnft.symbol = bNftContract.symbol();

  bnft.save();
}

export function handleBNFTUpgraded(event: BNFTUpgraded): void {
  let bnft = getOrInitBNFT(event.params.bNftProxy);

  bnft.tokenContractImpl = event.params.bNftImpl;

  let bNftContract = IERC721Metadata.bind(event.params.bNftProxy);

  bnft.name = bNftContract.name();
  bnft.symbol = bNftContract.symbol();

  bnft.save();
}
