// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TokenActivity } from '../types/token';
import { useNetworks } from '../hooks/useNetworks';
import { useIsTokenProcessorAvailable } from './useIndexerStatus';
import useIndexedTokenActivitiesProviderFactory from './useIndexedTokenActivitiesProviderFactory';
import { usePaginatedQuery } from './usePaginatedQuery';

const tokensPageSize = 12;
const tokensStaleTime = 20000;

export const getAccountTokensQueryKey = (
  activeNetworkName: string,
  idHash: string,
) => [activeNetworkName, idHash, 'tokenActivities'];

/**
 * Infinite query for token activities by a token id hash.
 * @param tokenIdHash id hash of the token
 */
export default function useTokenActivities(tokenIdHash: string) {
  const { activeNetworkName } = useNetworks();
  const isTokenProcessorAvailable = useIsTokenProcessorAvailable();

  const indexedTokenActivitiesProviderFactory =
    useIndexedTokenActivitiesProviderFactory();
  const indexedTokenActivities = usePaginatedQuery<TokenActivity>(
    [...getAccountTokensQueryKey(activeNetworkName, tokenIdHash), 'indexed'],
    () => indexedTokenActivitiesProviderFactory(tokenIdHash, tokensPageSize),
    tokensPageSize,
    {
      enabled: isTokenProcessorAvailable.data,
      retry: 0,
      staleTime: tokensStaleTime,
    },
  );

  return indexedTokenActivities;
}
