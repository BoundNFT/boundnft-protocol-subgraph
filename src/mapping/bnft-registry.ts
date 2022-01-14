import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { Initialized, BNFTCreated, BNFTUpgraded } from "../../generated/BNFTRegistry/BNFTRegistry";

import { BNFT as BNFTContract } from "../../generated/templates";
import { ERC721 } from "../../generated/BNFTRegistry/ERC721";
import { createMapContractToRegistry, getOrInitBNFT, getOrInitRegistry } from "../helpers/initializers";

export function handleInitialized(event: Initialized): void {
  let registry = getOrInitRegistry(event.address);
  registry.bnftGenericImpl = event.params.genericImpl;
  registry.symbolPrefix = event.params.symbolPrefix;
  registry.namePrefix = event.params.namePrefix;
  registry.save();
}

export function handleBNFTCreated(event: BNFTCreated): void {
  let registry = getOrInitRegistry(event.address);
  registry.save();

  createMapContractToRegistry(event.params.bNftProxy, registry.id);
  BNFTContract.create(event.params.bNftProxy);

  let bnft = getOrInitBNFT(registry.id, event.params.bNftProxy);

  bnft.registry = registry.id;
  bnft.nftAsset = event.params.nftAsset;
  bnft.bnftImpl = event.params.bNftImpl;

  {
    let bnftContract = ERC721.bind(event.params.bNftProxy);

    let nameCallValue = bnftContract.try_name();
    if (!nameCallValue.reverted) {
      bnft.name = nameCallValue.value;
    }
    let symbolCallValue = bnftContract.try_symbol();
    if (!symbolCallValue.reverted) {
      bnft.symbol = symbolCallValue.value;
    }
  }

  {
    let nftContract = ERC721.bind(event.params.nftAsset);

    let nameCallValue = nftContract.try_name();
    if (!nameCallValue.reverted) {
      bnft.nftName = nameCallValue.value;
    }
    let symbolCallValue = nftContract.try_symbol();
    if (!symbolCallValue.reverted) {
      bnft.nftSymbol = symbolCallValue.value;
    }
  }

  bnft.save();
}

export function handleBNFTUpgraded(event: BNFTUpgraded): void {
  let registry = getOrInitRegistry(event.address);
  registry.save();

  let bnft = getOrInitBNFT(registry.id, event.params.bNftProxy);

  bnft.bnftImpl = event.params.bNftImpl;

  let bnftContract = ERC721.bind(event.params.bNftProxy);

  let nameCallValue = bnftContract.try_name();
  if (!nameCallValue.reverted) {
    bnft.name = nameCallValue.value;
  }
  let symbolCallValue = bnftContract.try_symbol();
  if (!symbolCallValue.reverted) {
    bnft.symbol = symbolCallValue.value;
  }

  bnft.save();
}
