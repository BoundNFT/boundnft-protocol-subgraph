import { Initialized, Mint, Burn, FlashLoan } from "../../generated/templates/BNFT/BNFT";
import { Mint as MintAction, Burn as BurnAction, FlashLoan as FlashLoanAction } from "../../generated/schema";
import { getOrInitBNFT, getOrInitTokenOwner } from "../helpers/initializers";
import { zeroAddress, zeroBI } from "../utils/converters";
import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { EventTypeRef, getHistoryId } from "../utils/id-generation";
import { ERC721 } from "../../generated/templates/BNFT/ERC721";

export function handleInitialized(event: Initialized): void {}

export function handleMint(event: Mint): void {
  let bnft = getOrInitBNFT(event.address);

  bnft.lifetimeMints = bnft.lifetimeMints.plus(new BigInt(1));
  bnft.save();

  let ERC721Contract = ERC721.bind(event.address);
  let tokenItem = getOrInitTokenOwner(event.address, event.params.nftTokenId);
  tokenItem.bnft = bnft.id;
  tokenItem.nftAsset = event.params.nftAsset;
  tokenItem.owner = event.params.owner;
  let uriCallValue = ERC721Contract.try_tokenURI(event.params.nftTokenId);
  if (!uriCallValue.reverted) {
    tokenItem.tokenUri = uriCallValue.value;
  }
  tokenItem.save();

  let mintHistory = new MintAction(getHistoryId(event, EventTypeRef.Mint));
  mintHistory.bnft = bnft.id;
  mintHistory.nftAsset = event.params.nftAsset;
  mintHistory.nftTokenId = event.params.nftTokenId;
  mintHistory.owner = event.params.owner;
  mintHistory.user = event.params.user;
  mintHistory.timestamp = event.block.timestamp.toI32();
  mintHistory.save();
}

export function handleBurn(event: Burn): void {
  let bnft = getOrInitBNFT(event.address);

  bnft.lifetimeBurns = bnft.lifetimeBurns.plus(new BigInt(1));
  bnft.save();

  let tokenItem = getOrInitTokenOwner(event.address, event.params.nftTokenId);
  tokenItem.owner = zeroAddress();
  tokenItem.save();

  let burnHistory = new BurnAction(getHistoryId(event, EventTypeRef.Burn));
  burnHistory.bnft = bnft.id;
  burnHistory.nftAsset = event.params.nftAsset;
  burnHistory.nftTokenId = event.params.nftTokenId;
  burnHistory.owner = event.params.owner;
  burnHistory.user = event.params.user;
  burnHistory.timestamp = event.block.timestamp.toI32();
  burnHistory.save();
}

export function handleFlashLoan(event: FlashLoan): void {
  let bnft = getOrInitBNFT(event.address);

  bnft.lifetimeFlashLoans = bnft.lifetimeFlashLoans.plus(new BigInt(1));
  bnft.save();

  let flashLoan = new FlashLoanAction(getHistoryId(event, EventTypeRef.FlashLoan));
  flashLoan.bnft = bnft.id;
  flashLoan.nftAsset = event.params.nftAsset;
  flashLoan.nftTokenId = event.params.tokenId;
  flashLoan.target = event.params.target;
  flashLoan.initiator = event.params.initiator;
  flashLoan.timestamp = event.block.timestamp.toI32();
  flashLoan.save();
}
