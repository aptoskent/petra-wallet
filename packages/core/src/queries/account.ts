// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ApiError, AptosClient, MaybeHexString } from 'aptos';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import {
  aptosCoinStoreStructTag,
  aptosCoinStructTag,
  aptosStakePoolStructTag,
} from '../constants';
import { useAppState } from '../hooks/useAppState';
import { useNetworks } from '../hooks/useNetworks';
import useRestApi from '../hooks/useRestApi';
import { CoinInfoData } from '../types';
import { getCoinStoresByCoinType } from '../utils/resource';
import {
  useFetchAccountResource,
  useFetchAccountResources,
} from './useAccountResources';

/**
 * QUERY KEYS
 */
export const accountQueryKeys = Object.freeze({
  getAccountCoinResources: 'getAccountCoinResources',
  getAccountExists: 'getAccountExists',
  getAccountOctaCoinBalance: 'getAccountOctaCoinBalance',
  getAccountStakeBalance: 'getAccountStakeBalance',
  getAccountStakeInfo: 'getAccountStakeInfo',
  getSequenceNumber: 'getSequenceNumber',
} as const);

// ------------------------------------------------------------------------- //

const defaultAccountExistsQueryParams = {
  cacheTime: 10000,
  staleTime: 10000,
};

function fetchAccountExists(aptosClient: AptosClient, address: string) {
  return aptosClient
    .getAccount(address)
    .then(() => true)
    .catch(() => false);
}

export function useFetchAccountExists() {
  const { aptosClient } = useNetworks();
  const queryClient = useQueryClient();

  return async (address: string) =>
    queryClient.fetchQuery(
      [accountQueryKeys.getAccountExists, address],
      () => fetchAccountExists(aptosClient, address),
      { ...defaultAccountExistsQueryParams },
    );
}

interface UseAccountExistsProps {
  address?: string;
}

/**
 * Check whether an account associated to the specified address exists
 */
export const useAccountExists = ({ address }: UseAccountExistsProps) => {
  const { aptosClient } = useNetworks();

  return useQuery(
    [accountQueryKeys.getAccountExists, address],
    () => fetchAccountExists(aptosClient, address!),
    {
      ...defaultAccountExistsQueryParams,
      enabled: address !== undefined,
    },
  );
};

/**
 * Query coin balance for the specified account in Octa -> APT * 10^-8
 * @param address account address of the balance to be queried
 * @param options? query options
 */
export function useAccountOctaCoinBalance(
  address: string | undefined,
  options?: UseQueryOptions<bigint>,
) {
  const fetchAccountResource = useFetchAccountResource();
  const { activeNetworkName } = useNetworks();
  return useQuery<bigint>(
    [accountQueryKeys.getAccountOctaCoinBalance, address, activeNetworkName],
    async () =>
      fetchAccountResource(address!, aptosCoinStoreStructTag)
        .then((res: any) => BigInt(res.data.coin.value))
        .catch((err) => {
          if (err instanceof ApiError && err.status === 404) {
            return BigInt(0);
          }
          throw err;
        }),
    {
      enabled: Boolean(address),
      retry: 0,
      ...options,
    },
  );
}

export type AccountCoinResource = {
  balance: bigint;
  info: CoinInfoData;
  type: string;
};

export interface AccountCoinResourceResponse {
  recognizedCoins: AccountCoinResource[];
  unrecognizedCoins: AccountCoinResource[];
}

export const getAccountCoinResourcesKey = (
  activeNetworkName: string,
  address: string,
) => [accountQueryKeys.getAccountCoinResources, address, activeNetworkName];

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
  address: string | undefined,
  options?: UseQueryOptions<AccountCoinResourceResponse>,
) {
  const fetchAccountResources = useFetchAccountResources();
  const { getCoinInfo } = useRestApi();
  const { featureConfig } = useAppState();
  const { activeNetworkName } = useNetworks();

  return useQuery<AccountCoinResourceResponse>(
    getAccountCoinResourcesKey(activeNetworkName, address || ''),
    async () =>
      fetchAccountResources(address!)
        .then(async (resources) => {
          const coinStores = getCoinStoresByCoinType(resources);
          const result: AccountCoinResource[] = [];
          // Extract info for non-empty coin stores
          await Promise.all(
            Object.entries(coinStores).map(async ([coinType, coinStore]) => {
              const balance = BigInt(coinStore.coin.value);
              const coinInfo = await getCoinInfo(coinType);
              if (coinInfo !== undefined) {
                coinInfo.type = coinType;
                result.push({ balance, info: coinInfo, type: coinType });
              }
            }),
          );

          result.sort(compareCoinResources);

          // check feature config for recognized coins
          const recognizedCoinStoreTypes = [aptosCoinStructTag];
          const featureConfigCoins = featureConfig?.coins
            ? featureConfig.coins[activeNetworkName]
            : undefined;
          if (featureConfigCoins) {
            Object.values(featureConfigCoins).forEach((coin) => {
              recognizedCoinStoreTypes.push(coin.coinStore);
            });
          }

          const recognizedCoins: AccountCoinResource[] = [];
          const unrecognizedCoins: AccountCoinResource[] = [];
          for (const coin of result) {
            if (recognizedCoinStoreTypes.includes(coin.info.type)) {
              recognizedCoins.push(coin);
            } else {
              unrecognizedCoins.push(coin);
            }
          }
          return { recognizedCoins, unrecognizedCoins };
        })
        .catch((err) => {
          if (err instanceof ApiError && err.status === 404) {
            return { recognizedCoins: [], unrecognizedCoins: [] };
          }
          throw err;
        }),
    {
      enabled: Boolean(address),
      retry: 0,
      ...options,
    },
  );
}

/**
 * Query stake balance for the specified account
 * @param address account address of the balance to be queried
 * @param options query options
 */
export function useAccountStakeBalance(
  address: string | undefined,
  options?: UseQueryOptions<bigint>,
) {
  const { aptosClient } = useNetworks();

  return useQuery<bigint>(
    [accountQueryKeys.getAccountStakeBalance, address],
    async () =>
      aptosClient
        .getAccountResource(address!, aptosStakePoolStructTag)
        .then((res: any) => BigInt(res.data.active.value))
        .catch((err) => {
          if (err instanceof ApiError && err.status === 404) {
            return BigInt(0);
          }
          throw err;
        }),
    {
      enabled: Boolean(address),
      retry: 0,
      ...options,
    },
  );
}

export interface StakeInfo {
  delegatedVoter: MaybeHexString;
  lockedUntilSecs: string;
  operatorAddress: MaybeHexString;
  value: bigint;
}

/**
 * Query stake info for the specified account
 * @param address account address of the balance to be queried
 * @param options query options
 * @returns {StakeInfo}
 */
export function useAccountStakeInfo(
  address: string | undefined,
  options?: UseQueryOptions<StakeInfo | undefined>,
) {
  const { aptosClient } = useNetworks();

  return useQuery<StakeInfo | undefined>(
    [accountQueryKeys.getAccountStakeInfo, address],
    async () => {
      try {
        return await aptosClient
          .getAccountResource(address!, aptosStakePoolStructTag)
          .then(
            (res: any) =>
              ({
                delegatedVoter: res.data.delegated_voter,
                lockedUntilSecs: res.data.locked_until_secs,
                operatorAddress: res.data.operator_address,
                value: BigInt(res.data.active.value),
              } as StakeInfo),
          );
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          return undefined;
        }
        throw err;
      }
    },
    {
      enabled: Boolean(address),
      retry: 0,
      ...options,
    },
  );
}

export interface GetSequenceNumber {
  address: MaybeHexString;
  aptosClient: AptosClient;
}

export const getSequenceNumber = async ({
  address,
  aptosClient,
}: GetSequenceNumber) => {
  const account = await aptosClient.getAccount(address);
  return BigInt(account.sequence_number);
};
