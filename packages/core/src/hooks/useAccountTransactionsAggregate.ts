// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from 'react-query';
import { useNetworks } from './useNetworks';

export const useAccountTransactionsAggregateQueryKey = (
  networkName: string,
  address: string,
) => ['useAccountTransactionsAggregateQueryKey', networkName, address];

export default function useAccountTransactionsAggregate(address: string) {
  const { activeNetworkName, indexerClient } = useNetworks();

  async function fetchAggregate() {
    const result = (await indexerClient?.getActivitiesAggregate({
      account_address: address,
    })) ?? {
      address_events_summary: [
        {
          block_metadata: {
            timestamp: undefined,
          },
          num_distinct_versions: 0,
        },
      ],
    };
    const summary = result.address_events_summary[0];

    const timestampData = summary?.block_metadata?.timestamp;
    let timestamp;
    if (timestampData) {
      timestamp = new Date(timestampData);
    }

    return {
      count: summary?.num_distinct_versions ?? 0,
      firstTimestamp: timestamp,
    };
  }

  return useQuery<{ count: number; firstTimestamp: Date | undefined }>(
    useAccountTransactionsAggregateQueryKey(activeNetworkName, address),
    fetchAggregate,
    {
      retry: 0,
    },
  );
}
