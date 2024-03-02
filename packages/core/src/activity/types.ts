// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { CoinInfoData } from '../types';
import { AptosName } from '../utils/names';

export type ActivityEvent =
  | StakeEvent
  | SendCoinEvent
  | ReceiveCoinEvent
  | SwapCoinEvent
  | GasEvent
  | SendTokenEvent
  | ReceiveTokenEvent
  | SendTokenOfferEvent
  | ReceiveTokenOfferEvent
  | MintTokenEvent;

export type BaseEvent = {
  account: string;
  eventIndex: number;
  gas: bigint;
  success: boolean;
  timestamp: Date;
  version: bigint;
};

export type AptosIdentity = {
  address: string;
  name?: AptosName;
};

/** When you send coin to somebody. */
export interface SendCoinEventBase {
  _type: 'send';
  amount: bigint;
  coin: string;
  coinInfo?: CoinInfoData;
  receiver: AptosIdentity;
}
export interface SendCoinEvent extends BaseEvent, SendCoinEventBase {}

export interface StakeEventBase {
  _type: 'add-stake' | 'unstake' | 'withdraw-stake';
  amount: string;
  pool: string;
}

export interface StakeEvent extends BaseEvent, StakeEventBase {}

/** When you receive coin from somebody. */
export interface ReceiveCoinEventBase {
  _type: 'receive';
  amount: bigint;
  coin: string;
  coinInfo?: CoinInfoData;
  sender: AptosIdentity;
}
export interface ReceiveCoinEvent extends BaseEvent, ReceiveCoinEventBase {}

/** When you swap {coin, amount} in exchange for {swapCoin, swapAmount}. */
export interface SwapCoinEventBase {
  _type: 'swap';
  amount: bigint;
  coin: string;
  coinInfo?: CoinInfoData;
  swapAmount: bigint;
  swapCoin: string;
}
export interface SwapCoinEvent extends BaseEvent, SwapCoinEventBase {}

/**
 * A miscellaneous gas fee (i.e. when you pay gas but there are no other
 * coin/token activities in the transaction).
 */
export type GasEvent = BaseEvent & {
  _type: 'gas';
};

/**
 * When you send a token to somebody; either by them claiming your offer, or
 * through direct transfer.
 */
export type SendTokenEvent = BaseEvent & {
  _type: 'send_token';
  collection: string;
  name: string;
  receiver: AptosIdentity;
  uri: string;
};

/**
 * When you receive a token from somebody; either by you claiming their offer,
 * or through direct transfer.
 */
export type ReceiveTokenEvent = BaseEvent & {
  _type: 'receive_token';
  collection: string;
  name: string;
  sender: AptosIdentity | null;
  uri: string;
};

/** When you offer a token to somebody. */
export type SendTokenOfferEvent = BaseEvent & {
  _type: 'send_token_offer';
  collection: string;
  name: string;
  receiver: AptosIdentity;
  uri: string;
};

/** When somebody offers you a token. */
export type ReceiveTokenOfferEvent = BaseEvent & {
  _type: 'receive_token_offer';
  collection: string;
  name: string;
  sender: AptosIdentity;
  uri: string;
};

/** When a token is minted. */
export type MintTokenEvent = BaseEvent & {
  _type: 'mint_token';
  collection: string;
  minter: AptosIdentity;
  name: string;
  uri: string;
};
