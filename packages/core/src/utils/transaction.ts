// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type {
  CoinBalanceChange,
  OnChainTransaction,
  TokenBalanceChange,
} from '../types';
import { tokenDepositStructTag, tokenWithdrawStructTag } from '../constants';

interface ParseTokenBalanceChangesParams {
  activeAccountAddress: string;
  transaction?: OnChainTransaction | undefined;
}

export function parsePersonalTokenBalanceChanges({
  activeAccountAddress,
  transaction,
}: ParseTokenBalanceChangesParams) {
  const tokenBalanceEvents: TokenBalanceChange[] = [];

  if (!transaction?.rawEvents) {
    return tokenBalanceEvents;
  }

  for (const event of transaction.rawEvents) {
    if (
      event.type === tokenWithdrawStructTag &&
      event.guid.account_address === activeAccountAddress
    ) {
      tokenBalanceEvents.push({
        amount: BigInt(event.data.amount) * -1n,
        tokenDataId: event.data.id.token_data_id,
      });
    } else if (
      event.type === tokenDepositStructTag &&
      event.guid.account_address === activeAccountAddress
    ) {
      tokenBalanceEvents.push({
        amount: BigInt(event.data.amount),
        tokenDataId: event.data.id.token_data_id,
      });
    }
  }
  return tokenBalanceEvents;
}

type ParseCoinBalanceChangesParams = ParseTokenBalanceChangesParams;

export function parsePersonalCoinBalanceChanges({
  activeAccountAddress,
  transaction,
}: ParseCoinBalanceChangesParams) {
  const hasCoinBalanceChanges =
    transaction !== undefined &&
    transaction.coinBalanceChanges[activeAccountAddress] &&
    Object.keys(transaction.coinBalanceChanges[activeAccountAddress]).length >
      0;

  if (!hasCoinBalanceChanges) {
    return undefined;
  }

  const personalCoinBalanceChanges =
    transaction.coinBalanceChanges[activeAccountAddress];

  const replacementDict: Record<string, CoinBalanceChange> = {};
  for (const [key, value] of Object.entries(personalCoinBalanceChanges)) {
    if (value.coinInfo) {
      replacementDict[key] = {
        amount: value.amount,
        coinInfo: value.coinInfo,
      };
    } else {
      replacementDict[key] = {
        amount: value.amount,
      };
    }
  }
  return replacementDict;
}
