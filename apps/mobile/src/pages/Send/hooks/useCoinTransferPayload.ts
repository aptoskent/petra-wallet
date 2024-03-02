// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  buildAccountTransferPayload,
  buildCoinTransferPayload,
} from '@petra/core/transactions';
import { useMemo } from 'react';

export default function useCoinTransferPayload(
  recipient: string,
  amount: bigint,
  coinType: string,
  doesRecipientExist?: boolean,
) {
  return useMemo(() => {
    if (!amount || doesRecipientExist === undefined) {
      return undefined;
    }

    return doesRecipientExist
      ? buildCoinTransferPayload({
          amount,
          recipient,
          structTag: coinType,
        })
      : buildAccountTransferPayload({
          amount,
          recipient,
        });
  }, [amount, coinType, doesRecipientExist, recipient]);
}
