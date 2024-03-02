// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/return-await */

import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { AptosName } from '../utils/names';
import useRestApi from '../hooks/useRestApi';

export const getAddressFromNameQueryKey = 'getAddressFromName';
export const getNameFromAddressQueryKey = 'getNameFromAddress';

const defaultQueryOptions = {
  cacheTime: 60000,
  staleTime: 60000,
};

/**
 * Perform reverse lookup of the preferred name associated with an address.
 * Note: the underlying query is using the cached REST API, but it's still valuable
 * to use react-query in order to perform a single fetch per multiple requests
 * i.e. when querying the activity the same address lookup is requested many times
 * @param options query options
 */
export function useFetchNameFromAddress(
  options?: UseQueryOptions<AptosName | undefined>,
) {
  const queryClient = useQueryClient();
  const { getNameFromAddress } = useRestApi();
  return async (address: string) =>
    queryClient.fetchQuery<AptosName | undefined>(
      [getNameFromAddressQueryKey, address],
      async () => getNameFromAddress(address),
      {
        ...defaultQueryOptions,
        ...options,
      },
    );
}

export function useNameFromAddress(
  address: string | undefined,
  options?: UseQueryOptions<AptosName | undefined>,
) {
  const { getNameFromAddress } = useRestApi();
  return useQuery<AptosName | undefined>(
    [getNameFromAddressQueryKey, address],
    async () =>
      address !== undefined ? getNameFromAddress(address) : undefined,
    {
      ...defaultQueryOptions,
      ...options,
    },
  );
}

/**
 * Query the address linked to an aptos name ending in .apt
 * @param name aptos name
 * @param options query options
 */
export function useAddressFromName(
  name: AptosName | undefined,
  options?: UseQueryOptions<string | undefined>,
) {
  const { getAddressFromName } = useRestApi();
  return useQuery<string | undefined>(
    [getAddressFromNameQueryKey, name?.toString()],
    async () =>
      name !== undefined ? await getAddressFromName(name) : undefined,
    {
      ...defaultQueryOptions,
      ...options,
    },
  );
}
