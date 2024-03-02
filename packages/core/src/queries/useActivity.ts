// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useNetworks } from '../hooks/useNetworks';
import { useIsCoinProcessorAvailable } from './useIndexerStatus';
import { ActivityItem } from '../types/activity';
import useActivityProviderFactory from './useActivityProviderFactory';
import useIndexedActivityProviderFactory from './useIndexedActivityProviderFactory';
import { usePaginatedQuery } from './usePaginatedQuery';
import useRealtimeCoinActivityProviderFactory from './useRealtimeCoinActivityProviderFactory';

const activityPageSize = 20;
const activityStaleTime = 20000;

/**
 * Account activity query key builder
 */
export const getAccountActivityQueryKey = (
  activeNetworkName: string,
  address: string,
) => [activeNetworkName, address, 'activity'];

/**
 * Query hook for account activity.
 * The account activity is fetched from the indexer by default,
 * but it seamlessly falls back to the fullnode REST API when the indexer is unavailable.
 * @param address account address for which to query activity
 */
export default function useActivity(address: string) {
  const { activeNetworkName } = useNetworks();
  const isCoinProcessorAvailable = useIsCoinProcessorAvailable();

  // region Indexed activity query (only when coin processor is available)
  const indexedCoinActivityProviderFactory =
    useIndexedActivityProviderFactory();
  const indexedActivityProviderFactory = useActivityProviderFactory(() =>
    indexedCoinActivityProviderFactory(address, activityPageSize),
  );
  const indexedActivity = usePaginatedQuery<ActivityItem>(
    [...getAccountActivityQueryKey(activeNetworkName, address), 'indexed'],
    () => indexedActivityProviderFactory(address),
    activityPageSize,
    {
      enabled: isCoinProcessorAvailable.data,
      retry: 0,
      staleTime: activityStaleTime,
    },
  );
  // endregion

  // region Realtime activity query (only when fallback required)
  const useFallback =
    isCoinProcessorAvailable.data === false || indexedActivity.isError;
  const realtimeCoinActivityProviderFactory =
    useRealtimeCoinActivityProviderFactory();
  const realtimeActivityProviderFactory = useActivityProviderFactory(() =>
    realtimeCoinActivityProviderFactory(address),
  );
  const realtimeActivity = usePaginatedQuery<ActivityItem>(
    [...getAccountActivityQueryKey(activeNetworkName, address), 'realtime'],
    () => realtimeActivityProviderFactory(address),
    activityPageSize,
    {
      enabled: useFallback,
      retry: 0,
      staleTime: activityStaleTime,
    },
  );
  // endregion

  return useFallback ? realtimeActivity : indexedActivity;
}
