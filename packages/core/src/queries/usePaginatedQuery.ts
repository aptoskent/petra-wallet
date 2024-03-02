// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  QueryKey,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
} from 'react-query';

/**
 * Standardized data provider for paginated data of undetermined length
 */
export interface PaginatedDataProvider<T> {
  fetch: (amount: number) => Promise<T[]>;
}

/**
 * Standard page format for paginated data.
 * The state is defined by the provider instance alone
 */
export interface PaginatedDataPage<T> {
  items: T[];
  provider: PaginatedDataProvider<T>;
}

type Factory<T> = () => T | Promise<T>;
export type PaginatedDataProviderFactory<T> = Factory<PaginatedDataProvider<T>>;

export type UsePaginatedQueryOptions<T> = Omit<
  UseInfiniteQueryOptions<T>,
  'getNextPageParam'
>;

/**
 * Specialization of `useInfiniteQuery` that uses q standardized data provider format.
 * @param queryKey query key to forward to `useInfiniteQuery`
 * @param providerFactory factory for the data provider, used when fetching the first page
 * @param pageSize page size
 * @param options options to be forwarded to `useInfiniteKey`
 */
export function usePaginatedQuery<T>(
  queryKey: QueryKey,
  providerFactory: PaginatedDataProviderFactory<T>,
  pageSize: number,
  options?: UsePaginatedQueryOptions<PaginatedDataPage<T>>,
) {
  return useInfiniteQuery<PaginatedDataPage<T>>(
    queryKey,
    async ({ pageParam }) => {
      const provider = pageParam ?? (await providerFactory());
      const items = await provider.fetch(pageSize);
      return { items, provider };
    },
    {
      ...options,
      getNextPageParam: ({ items, provider }) =>
        items.length === pageSize ? provider : undefined,
    },
  );
}
