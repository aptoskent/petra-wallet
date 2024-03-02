// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from 'react-query';
import { useNetworks } from './useNetworks';

export const getAccountTokensTotalQueryKey = (
  networkName: string,
  address: string,
) => ['getAccountTokensTotalQueryKey', networkName, address];

export default function useAccountTokensTotal(address: string) {
  const { activeNetworkName, indexerClient } = useNetworks();

  async function fetchCount() {
    const result = (await indexerClient?.getAccountTokensTotal({
      address,
    })) ?? {
      current_token_ownerships: [],
      current_token_ownerships_v2_aggregate: { aggregate: { count: 0 } },
    };

    return result.current_token_ownerships_v2_aggregate.aggregate?.count ?? 0;
  }

  return useQuery<number>(
    getAccountTokensTotalQueryKey(activeNetworkName, address),
    fetchCount,
    {
      retry: 0,
    },
  );
}
