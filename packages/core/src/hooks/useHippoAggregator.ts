// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { TradeAggregator } from '@manahippo/hippo-sdk';
import { UseQueryOptions, useQuery } from 'react-query';
import type { RawCoinInfo } from '@manahippo/coin-list';
import useHippoCoinListClient from './useHippoCoinListClient';
import { useNetworks } from './useNetworks';
import useHippoNetworkConfig from './useHippoNetworkConfig';

const loadAdditionalCoinsQueryKey = (activeNetworkName: string) => [
  'getAdditionalCoins',
  activeNetworkName,
];

interface ExtraOptions {
  trackTradeAggregatorErrorEvent: () => void;
}

const useHippoAggregator = (
  options?: UseQueryOptions<RawCoinInfo[]>,
  extraOptions?: ExtraOptions,
) => {
  const { aptosClient } = useNetworks();
  const { activeNetworkName } = useNetworks();
  const networkConfig = useHippoNetworkConfig();
  const hippoCoinListClient = useHippoCoinListClient();

  const { isLoading, isSuccess } = useQuery<RawCoinInfo[]>(
    loadAdditionalCoinsQueryKey(activeNetworkName),
    async () => hippoCoinListClient.update(),
    {
      enabled: true,
      retry: 0,
      ...options,
    },
  );

  const hippoAggregator = useMemo(() => {
    if (networkConfig && isSuccess) {
      try {
        return new TradeAggregator(
          // This is neccessary because of aptos sdk mismatches
          // could lead to issues so I'm messaging hippo with a resolution
          aptosClient as any,
          networkConfig,
          hippoCoinListClient,
        );
      } catch {
        extraOptions?.trackTradeAggregatorErrorEvent();
        return undefined;
      }
    }
    return undefined;
  }, [
    aptosClient,
    hippoCoinListClient,
    networkConfig,
    isSuccess,
    extraOptions,
  ]);

  return {
    hippoAggregator,
    isLoading,
  };
};

export default useHippoAggregator;
