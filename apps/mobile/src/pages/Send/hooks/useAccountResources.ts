// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useNetworks } from '@petra/core/hooks/useNetworks';
import { CoinInfoData, Resource } from '@petra/core/types';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';

export interface CoinMetadata {
  logoUrl: string;
}

export type AccountCoinResource = {
  balance: bigint;
  info: CoinInfoData;
  metadata?: CoinMetadata;
  type: string;
};

const defaultQueryOptions = {
  staleTime: 3000,
};

export const getAccountResourcesQueryKey = (
  activeNetworkName: string,
  address: string,
) => [activeNetworkName, address, 'resources'];

/**
 * Function for manually fetching account resources.
 * Leverages react-query caching mechanisms and shares data with `useAccountResources` query
 */
export function useFetchAccountResources() {
  const { activeNetworkName, aptosClient } = useNetworks();
  const queryClient = useQueryClient();
  return (address: string) =>
    queryClient.fetchQuery<Resource[]>(
      getAccountResourcesQueryKey(activeNetworkName, address),
      async () =>
        aptosClient.getAccountResources(address) as Promise<Resource[]>,
      defaultQueryOptions,
    );
}

export function useAccountResources<TResource = Resource>(
  address: string,
  options?: UseQueryOptions<Resource[], Error, TResource[]>,
) {
  const { activeNetworkName, aptosClient } = useNetworks();
  return useQuery<Resource[], Error, TResource[]>(
    getAccountResourcesQueryKey(activeNetworkName, address),
    () => aptosClient.getAccountResources(address) as Promise<Resource[]>,
    { ...defaultQueryOptions, ...options },
  );
}
