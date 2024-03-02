// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { Resource, ResourceType, ResourceTypeValue } from '../types/resource';
import { useNetworks } from '../hooks/useNetworks';

export const getAccountResourcesQueryKey = 'getAccountResources';

const defaultQueryOptions = {
  staleTime: 3000,
};

/**
 * Function for manually fetching account resources.
 * Leverages react-query caching mechanisms and shares data with `useAccountResources` query
 */
export function useFetchAccountResources() {
  const { activeNetworkName, aptosClient } = useNetworks();
  const queryClient = useQueryClient();

  return (address: string) =>
    queryClient.fetchQuery<Resource[]>(
      [getAccountResourcesQueryKey, address, activeNetworkName],
      async () =>
        aptosClient.getAccountResources(address) as Promise<Resource[]>,
      defaultQueryOptions,
    );
}

/**
 * Function for manually fetching an account specific resource.
 * Leverages react-query caching mechanisms and shares data with other resource queries
 */
export function useFetchAccountResource(): FetchAccountResource {
  const fetchResources = useFetchAccountResources();
  return async <T extends ResourceType>(
    address: string,
    type: T,
  ): Promise<ResourceTypeValue<T> | undefined> => {
    const resources = await fetchResources(address);
    return resources.find((res) => res.type === type) as
      | ResourceTypeValue<T>
      | undefined;
  };
}

export type FetchAccountResource = <T extends ResourceType>(
  address: string,
  resourceType: T,
) => Promise<ResourceTypeValue<T> | undefined>;

/**
 * Query for retrieving account resources
 * @param address account address
 * @param options query options
 */
export function useAccountResources(
  address: string | undefined,
  options?: UseQueryOptions<Resource[] | undefined>,
) {
  const { aptosClient } = useNetworks();

  return useQuery<Resource[] | undefined>(
    [getAccountResourcesQueryKey, address],
    async () =>
      address !== undefined
        ? (aptosClient.getAccountResources(address) as Promise<Resource[]>)
        : undefined,
    {
      ...defaultQueryOptions,
      ...options,
    },
  );
}

/**
 * Query for retrieving an account resource
 * @param address account address
 * @param options query options
 */
export function useAccountResource<T extends ResourceType>(
  address: string | undefined,
  resourceType: T,
  options?: UseQueryOptions<ResourceTypeValue<T> | undefined>,
) {
  const { aptosClient } = useNetworks();

  return useQuery<ResourceTypeValue<T> | undefined>(
    [getAccountResourcesQueryKey, address, resourceType],
    async () =>
      address !== undefined
        ? (aptosClient.getAccountResource(address, resourceType) as Promise<
            ResourceTypeValue<T> | undefined
          >)
        : undefined,
    {
      ...defaultQueryOptions,
      ...options,
    },
  );
}
