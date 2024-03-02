// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TransactionPayload } from '@petra/core/serialization';
import { useQueryClient } from 'react-query';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useTransactionSubmit } from 'core/mutations/transaction';
import { TransactionOptions } from '@petra/core/transactions';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { getAccountActivityQueryKey } from '@petra/core/queries/useActivity';
import queryKeys from '@petra/core/queries/queryKeys';

/**
 * Mutation for the coin swap
 * This mutation will accept a transaction payload from quoteSelected.route.makePayload
 * It will submit a transaction via signAndSubmitTransaction
 */
export function useCoinSwapMutation(txnOptions?: TransactionOptions) {
  const { activeAccountAddress } = useActiveAccount();
  const { activeNetworkName } = useNetworks();
  const queryClient = useQueryClient();

  return useTransactionSubmit<TransactionPayload>((payload) => payload, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeys.getAccountResources);
      await Promise.all([
        queryClient.invalidateQueries([
          queryKeys.getAccountOctaCoinBalance,
          activeAccountAddress,
        ]),
        queryClient.invalidateQueries(queryKeys.getAccountCoinResources),
        queryClient.invalidateQueries(
          getAccountActivityQueryKey(activeNetworkName, activeAccountAddress),
        ),
      ]);
    },
    txnOptions,
  });
}

export default useCoinSwapMutation;
