// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type { TokenTypes, Types } from 'aptos';
import { AptosName } from '../utils/names';
import { MoveAbortDetails } from '../move/abort';
import { CoinInfoData } from './resource';

export interface CoinBalanceChange {
  amount: bigint;
  coinInfo?: CoinInfoData;
}

export interface TokenBalanceChange {
  amount: bigint;
  tokenDataId: TokenTypes.TokenDataId;
}

export type CoinBalanceChangesByCoinType = Record<string, CoinBalanceChange>;
export type CoinBalanceChangesByAccount = Record<
  string,
  CoinBalanceChangesByCoinType
>;

interface MiscellaneousError {
  description: string;
  type: 'miscellaneous';
}

type AbortError = MoveAbortDetails & {
  type: 'abort';
};

export type TransactionError = MiscellaneousError | AbortError;

// region By type

export interface BaseTransactionProps {
  expirationTimestamp: number;
  gasUnitPrice: number;
  hash: string;
  payload: Types.TransactionPayload;
  sender: string;
  senderName?: AptosName;
}

export type PendingTransaction = BaseTransactionProps & {
  onChain: false;
};

export type OnChainTransaction = BaseTransactionProps & {
  coinBalanceChanges: CoinBalanceChangesByAccount;
  error?: TransactionError;
  gasFee: number;
  onChain: true;
  rawChanges: Types.WriteSetChange[];
  rawEvents: Types.Event[];
  success: boolean;
  timestamp: number;
  version: number;
};

// endregion

export type BaseTransaction = PendingTransaction | OnChainTransaction;

// region By payload

export type CoinTransferTransaction = BaseTransaction & {
  amount: bigint;
  coinInfo?: CoinInfoData;
  coinType: string;
  recipient: string;
  recipientName?: AptosName;
  type: 'transfer';
};

export type CoinMintTransaction = BaseTransaction & {
  amount: bigint;
  coinInfo?: CoinInfoData;
  recipient: string;
  type: 'mint';
};

export type GenericTransaction = BaseTransaction & {
  type: 'generic';
};

// endregion

export type Transaction =
  | CoinTransferTransaction
  | CoinMintTransaction
  | GenericTransaction;

export function isEntryFunctionPayload(
  payload: Types.TransactionPayload,
): payload is Types.TransactionPayload_EntryFunctionPayload {
  return payload.type === 'entry_function_payload';
}
