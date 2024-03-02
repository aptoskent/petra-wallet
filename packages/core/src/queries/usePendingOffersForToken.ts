// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TokenClaim } from '../types/token';
import { useNetworks } from '../hooks/useNetworks';
import useIndexedPendingOffersForTokenProviderFactory from './useIndexedPendingOffersForTokenProviderFactory';
import { usePaginatedQuery } from './usePaginatedQuery';

const pageSize = 12;
const staleTime = 20000;

export const getPendingOffersForTokenQueryKey = (
  activeNetworkName: string,
  idHash: string,
) => [activeNetworkName, idHash, 'pendingOffersForToken'];

/**
 * Infinite query for pending offers for a token.
 * Use indexer only
 * @param idHash token_data_id_hash of the token
 */
export default function usePendingOffersForToken(idHash: string) {
  const { activeNetworkName } = useNetworks();

  // region Indexed tokens query (only when token processor is available)
  const indexedPendingOffersForTokenProviderFactory =
    useIndexedPendingOffersForTokenProviderFactory();
  const indexedTokensPendingOfferClaims = usePaginatedQuery<TokenClaim>(
    [...getPendingOffersForTokenQueryKey(activeNetworkName, idHash), 'indexed'],
    () => indexedPendingOffersForTokenProviderFactory(idHash, pageSize),
    pageSize,
    {
      enabled: true,
      retry: 0,
      staleTime,
    },
  );

  return indexedTokensPendingOfferClaims;
}
