// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosName } from '../utils/names';

export type TokenStandard = 'v1' | 'v2';

export interface TokenData {
  amount?: number;
  collection: string;
  collectionData?: CollectionData;
  collectionDataIdHash?: string;
  creator: string;
  description: string;
  // TODO: In V2 this is not a hash, this is very confusing
  idHash: string;
  isSoulbound: boolean;
  metadataUri: string;
  name: string;
  tokenStandard: TokenStandard;
}

export type ExtendedTokenData = TokenData & {
  collectionData?: CollectionData;
  lastTxnVersion: bigint;
  propertyVersion?: number;
  tokenProperties: { [key: string]: string };
};

export interface TokenClaim {
  amount: number;
  collectionData: CollectionData;
  fromAddress: string;
  fromAddressName?: AptosName;
  lastTransactionTimestamp: string;
  lastTransactionVersion: number;
  toAddress: string;
  toAddressName?: AptosName;
  tokenData: ExtendedTokenData;
}

export enum TokenEvent {
  CancelOffer = '0x3::token_transfers::TokenCancelOfferEvent',
  Claim = '0x3::token_transfers::TokenClaimEvent',
  Create = '0x3::token::CreateTokenDataEvent',
  Deposit = '0x3::token::DepositEvent',
  Mint = '0x3::token::MintTokenEvent',
  Mutate = '0x3::token::MutateTokenPropertyMapEvent',
  Offer = '0x3::token_transfers::TokenOfferEvent',
  Withdraw = '0x3::token::WithdrawEvent',
}

export interface CollectionData {
  collectionDataIdHash?: string;
  collectionName?: string;
  creatorAddress?: string;
  description?: string;
  idHash?: string;
  metadataUri?: string;
  name?: string;
  supply?: number;
}

export interface TokenActivity {
  accountAddress: string;
  coinAmount?: number;
  coinType?: string | null;
  collectionDataIdHash: string;
  collectionName: string;
  creationNumber: number;
  creatorAddress: string;
  fromAddress?: string | null;
  name: string;
  propertyVersion: number;
  sequenceNumber: number;
  toAddress?: string | null;
  tokenAmount: number;
  tokenDataIdHash: string;
  transactionTimestamp: string;
  transactionVersion: string;
  transferType: string;
}

export default TokenData;
