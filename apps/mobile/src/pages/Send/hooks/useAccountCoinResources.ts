// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { aptosCoinStructTag } from '@petra/core/constants';
import useCoinListDict from '@petra/core/hooks/useCoinListDict';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import useRestApi from '@petra/core/hooks/useRestApi';
import { CoinInfoData } from '@petra/core/types';
import getCoinStoresByCoinType from '@petra/core/utils/resource';
import { ApiError } from 'aptos';
import { useCallback } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
import {
  getAccountResourcesQueryKey,
  useFetchAccountResources,
} from './useAccountResources';

export interface CoinMetadata {
  logoUrl: string;
}

export interface CoinInfoWithMetadata extends CoinInfoData {
  metadata?: CoinMetadata;
}

export type AccountCoinResource = {
  balance: bigint;
  info: CoinInfoWithMetadata;
  type: string;
};

export const getAccountCoinResourcesQueryKey = (
  activeNetworkName: string,
  address: string,
) => [...getAccountResourcesQueryKey(activeNetworkName, address), 'coin'];

function defaultCompare<T>(lhs: T, rhs: T) {
  if (lhs < rhs) {
    return -1;
  }
  if (lhs > rhs) {
    return 1;
  }
  return 0;
}

/**
 * Sort by descending balance, with APT always on top
 */
function compareCoinResources(
  lhs: AccountCoinResource,
  rhs: AccountCoinResource,
) {
  // Override sorting for APT
  if (lhs.type === aptosCoinStructTag && rhs.type !== aptosCoinStructTag) {
    return -1;
  }
  if (lhs.type !== aptosCoinStructTag && rhs.type === aptosCoinStructTag) {
    return 1;
  }

  return (
    // Sort by descending balance
    defaultCompare(rhs.balance, lhs.balance) ||
    // then by ascending name
    defaultCompare(lhs.info.name, rhs.info.name) ||
    // then by ascending type
    defaultCompare(lhs.type, rhs.type) ||
    0
  );
}

/**
 * Query for all the coins in the user's account
 * @param address account address of the balance to be queried
 * @param options? query options
 */
export function useAccountCoinResources(
  address: string,
  options?: UseQueryOptions<AccountCoinResource[]>,
) {
  const { activeNetworkName } = useNetworks();
  const { getCoinInfo } = useRestApi();
  const { coinListDict } = useCoinListDict();
  const fetchAccountResources = useFetchAccountResources();

  const fetchCoinResources = useCallback(
    (_address: string) =>
      fetchAccountResources(_address)
        .then(async (resources) => {
          const coinStores = getCoinStoresByCoinType(resources);
          const result: AccountCoinResource[] = [];
          // Extract info for non-empty coin stores
          await Promise.all(
            Object.entries(coinStores).map(async ([coinType, coinStore]) => {
              const balance = BigInt(coinStore.coin.value);
              const coinInfo = await getCoinInfo(coinType);
              const metadata = coinListDict[coinType];
              if (coinInfo !== undefined) {
                coinInfo.type = coinType;
                result.push({
                  balance,
                  info: {
                    ...coinInfo,
                    metadata: metadata
                      ? { logoUrl: metadata.logo_url }
                      : undefined,
                  },
                  type: coinType,
                });
              }
            }),
          );
          result.sort(compareCoinResources);
          return result;
        })
        .catch((err) => {
          if (err instanceof ApiError && err.status === 404) {
            return [];
          }
          throw err;
        }),
    [coinListDict, fetchAccountResources, getCoinInfo],
  );

  return useQuery<AccountCoinResource[]>(
    getAccountCoinResourcesQueryKey(activeNetworkName, address),
    () => fetchCoinResources(address),
    {
      retry: 0,
      ...options,
    },
  );
}
