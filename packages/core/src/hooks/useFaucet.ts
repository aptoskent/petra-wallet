// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useMutation, useQueryClient } from 'react-query';
import { getAccountActivityQueryKey } from '../queries/useActivity';
import { queryKeys } from '../queries/queryKeys';
import { useNetworks } from './useNetworks';

interface FundAccountParams {
  address: string;
  amount: number;
}

export function useFaucet() {
  const { activeNetwork, faucetClient } = useNetworks();
  const queryClient = useQueryClient();

  function fundAccount({ address, amount }: FundAccountParams) {
    if (!faucetClient) {
      throw new Error('Faucet is not available');
    }
    return faucetClient.fundAccount(address, amount);
  }

  const { isLoading, mutateAsync, ...other } = useMutation({
    mutationFn: fundAccount,
    onSuccess: async (result, { address }: FundAccountParams) => {
      if (result) {
        // Other queries depend on this, so this needs to complete invalidating
        // before invalidating other queries
        await queryClient.invalidateQueries([
          queryKeys.getAccountResources,
          address,
        ]);
        await Promise.all([
          queryClient.invalidateQueries([
            queryKeys.getAccountOctaCoinBalance,
            address,
          ]),
          queryClient.invalidateQueries([
            queryKeys.getAccountCoinResources,
            address,
          ]),
          queryClient.invalidateQueries(
            getAccountActivityQueryKey(activeNetwork.name, address),
          ),
        ]);
      }
    },
  });

  if (!faucetClient) {
    return {
      canFundAccount: false as const,
    };
  }

  return {
    canFundAccount: true as const,
    fundAccount: mutateAsync,
    isFunding: isLoading,
    ...other,
  };
}

export default useFaucet;
