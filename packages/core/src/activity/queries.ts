// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useInfiniteQuery } from 'react-query';
import {
  InputMaybe,
  Account_Transactions_Bool_Exp,
  Coin_Activities_Bool_Exp,
  Token_Activities_Bool_Exp,
} from '@petra/indexer-client/src/generated/types';
import { useNetworks } from '../hooks/useNetworks';
import { transformPetraActivity } from './transform';
import { type ActivityEvent } from './types';

const MAX_INDEXER_INT = BigInt('9223372036854775807');

export interface UseActivityConfig {
  coin_activities_where?: InputMaybe<
    Coin_Activities_Bool_Exp | Coin_Activities_Bool_Exp[]
  >;
  token_activities_where?: InputMaybe<
    Token_Activities_Bool_Exp | Token_Activities_Bool_Exp[]
  >;
  where?: InputMaybe<
    Account_Transactions_Bool_Exp | Account_Transactions_Bool_Exp[]
  >;
}

export type {
  Account_Transactions_Bool_Exp,
  Token_Activities_Bool_Exp,
  Coin_Activities_Bool_Exp,
};

// eslint-disable-next-line import/prefer-default-export
export function useActivity(address: string, config?: UseActivityConfig) {
  const { activeNetworkName, indexerClient } = useNetworks();

  async function fetchActivity({ pageParam }: { pageParam?: bigint }) {
    const response = await indexerClient?.getConsolidatedActivities({
      address,
      coin_activities_where: config?.coin_activities_where ?? [],
      limit: 10,
      max_transaction_version: (pageParam ?? MAX_INDEXER_INT).toString(),
      token_activities_where: config?.token_activities_where ?? [],
      where: config?.where ?? [],
    });
    const indexerEvents = response?.account_transactions ?? [];
    const events: ActivityEvent[] = indexerEvents.reduce((acc, x) => {
      try {
        // @ts-ignore
        acc.push(...transformPetraActivity({ account_address: address, ...x }));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.debug('failed to transform activity', x, e);
      }
      return acc;
    }, []);
    return {
      events,
      min_version: indexerEvents[indexerEvents.length - 1]?.transaction_version,
    };
  }

  return useInfiniteQuery({
    getNextPageParam: (lastPage) => lastPage.min_version,
    queryFn: fetchActivity,
    queryKey: ['activity', activeNetworkName, address],
    staleTime: 60 * 1000,
  });
}
