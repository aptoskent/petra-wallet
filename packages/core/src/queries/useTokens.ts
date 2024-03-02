// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TokenData } from '../types/token';
import { useNetworks } from '../hooks/useNetworks';
import { useIsTokenProcessorAvailable } from './useIndexerStatus';
import useIndexedTokensProviderFactory from './useIndexedTokensProviderFactory';
import {
  PaginatedDataPage,
  UsePaginatedQueryOptions,
  usePaginatedQuery,
} from './usePaginatedQuery';
import useRealtimeTokenProviderFactory from './useRealtimeTokensProviderFactory';

const tokensPageSize = 12;
const tokensStaleTime = 20000;

export const getAccountTokensQueryKey = (
  activeNetworkName: string,
  address: string,
) => [activeNetworkName, address, 'tokens'];

/**
 * Infinite query for tokens owned by an account. Use indexer when available,
 * otherwise rely on fullnode REST api
 * @param address address of the owner account
 */
export function useAccountTokens(
  address: string,
  options?: UsePaginatedQueryOptions<PaginatedDataPage<TokenData>>,
) {
  const { activeNetworkName } = useNetworks();
  const isTokenProcessorAvailable = useIsTokenProcessorAvailable();

  // region Indexed tokens query (only when token processor is available)
  const indexedTokensProviderFactory = useIndexedTokensProviderFactory();
  const indexedTokens = usePaginatedQuery<TokenData>(
    [...getAccountTokensQueryKey(activeNetworkName, address), 'indexed'],
    () => indexedTokensProviderFactory(address, tokensPageSize),
    tokensPageSize,
    {
      ...options,
      enabled: isTokenProcessorAvailable.data,
      retry: 0,
      staleTime: tokensStaleTime,
    },
  );
  // endregion

  const useFallback =
    isTokenProcessorAvailable.data === false || indexedTokens.isError;
  const realtimeTokenProviderFactory = useRealtimeTokenProviderFactory();
  const realtimeTokens = usePaginatedQuery<TokenData>(
    [...getAccountTokensQueryKey(activeNetworkName, address), 'realtime'],
    () => realtimeTokenProviderFactory(address),
    tokensPageSize,
    {
      ...options,
      enabled: useFallback,
      retry: 0,
      staleTime: tokensStaleTime,
    },
  );

  const res = useFallback ? realtimeTokens : indexedTokens;

  return {
    ...res,
    allTokens: res.data?.pages.flatMap((page) => page.items) || [],
  };
}
