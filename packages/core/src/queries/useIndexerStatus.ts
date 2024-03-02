// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from 'react-query';
import { useNetworks } from '../hooks/useNetworks';

export const getIndexerProcessorIsAvailableQueryKey = (
  activeNetworkName: string,
  processor: string,
) => [activeNetworkName, 'indexer', processor, 'isAvailable'];

/**
 * Determine if an indexer processor is available and up to date for the current network
 * @param processor processor name
 */
function useIsIndexerProcessorAvailable(processor: string) {
  const { activeNetworkName, indexerClient } = useNetworks();

  return useQuery<boolean>(
    getIndexerProcessorIsAvailableQueryKey(activeNetworkName, processor),
    async () => {
      if (!indexerClient) {
        return false;
      }

      try {
        // TODO: check last processed version to determine if indexer is falling behind
        await indexerClient.getProcessorLastVersion({ processor });
        return true;
      } catch (err) {
        return false;
      }
    },
    {
      staleTime: 60000,
    },
  );
}

export function useIsTokenProcessorAvailable() {
  return useIsIndexerProcessorAvailable('token_processor');
}

export function useIsCoinProcessorAvailable() {
  return useIsIndexerProcessorAvailable('coin_processor');
}
