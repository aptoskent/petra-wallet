// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TokenClaim } from '../types/token';
import { useNetworks } from '../hooks/useNetworks';
import useIndexedTokensPendingOfferClaimsProviderFactory from './useIndexedTokensPendingOfferClaimsProviderFactory';
import {
  UsePaginatedQueryOptions,
  usePaginatedQuery,
  PaginatedDataPage,
} from './usePaginatedQuery';

const pageSize = 50;
const staleTime = 20000;

export const getTokenPendingOfferClaimQueryKey = (
  activeNetworkName: string,
  address: string,
) => [activeNetworkName, address, 'tokenPendingClaims'];

export const getHiddenTokenPendingClaimsQueryKey = (
  activeNetworkName: string,
  address: string,
) => [activeNetworkName, address, 'hiddenTokenPendingClaims'];

/**
 * Infinite query for tokens pending claims for an account.
 * Use indexer only
 * @param address address of the owner account
 */
export default function useAccountTokensPendingOfferClaims(
  address: string,
  showHiddenOffers?: boolean,
  options?: UsePaginatedQueryOptions<PaginatedDataPage<TokenClaim>>,
) {
  const { activeNetworkName } = useNetworks();
  const queryKey = showHiddenOffers
    ? getHiddenTokenPendingClaimsQueryKey(activeNetworkName, address)
    : getTokenPendingOfferClaimQueryKey(activeNetworkName, address);

  // region Indexed tokens query (only when token processor is available)
  const indexedTokensPendingClaimsProviderFactory =
    useIndexedTokensPendingOfferClaimsProviderFactory(showHiddenOffers);
  const indexedTokensPendingOfferClaims = usePaginatedQuery<TokenClaim>(
    [...queryKey, 'indexed'],
    () => indexedTokensPendingClaimsProviderFactory(address, pageSize),
    pageSize,
    {
      ...options,
      enabled: true,
      retry: 0,
      staleTime,
    },
  );

  return indexedTokensPendingOfferClaims;
}
