// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Types, TokenTypes } from 'aptos';

/**
 * The REST API exposes the event's originating transaction version,
 * but the type in the Aptos SDK has not been updated yet
 */
export type EventWithVersion = Types.Event & { version: string };

/**
 * Preprocessed version of an Event. Mostly using numbers instead of strings
 */
interface BaseEvent {
  guid: {
    address: string;
    creationNumber: number;
  };
  sequenceNumber: number;
  version: number;
}

export type CoinWithdrawEvent = BaseEvent & {
  data: { amount: string };
  type: '0x1::coin::WithdrawEvent';
};

export type CoinDepositEvent = BaseEvent & {
  data: { amount: string };
  type: '0x1::coin::DepositEvent';
};

export type TokenWithdrawEvent = BaseEvent & {
  data: { amount: string; id: TokenTypes.TokenId };
  type: '0x3::token::WithdrawEvent';
};

export type TokenDepositEvent = BaseEvent & {
  data: { amount: string; id: TokenTypes.TokenId };
  type: '0x3::token::DepositEvent';
};

export type GenericEvent = BaseEvent & {
  data: any;
  type: Types.MoveType;
};

export type Event =
  | CoinWithdrawEvent
  | CoinDepositEvent
  | TokenWithdrawEvent
  | TokenDepositEvent
  | GenericEvent;

export type CoinEvent = CoinDepositEvent | CoinWithdrawEvent;

export function isCoinEvent(event: Event): event is CoinEvent {
  return (
    event.type === '0x1::coin::DepositEvent' ||
    event.type === '0x1::coin::WithdrawEvent'
  );
}
