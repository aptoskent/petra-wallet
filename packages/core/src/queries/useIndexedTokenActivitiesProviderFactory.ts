// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type { TokenActivitiesFragment } from '@petra/indexer-client';

import { useNetworks } from '../hooks/useNetworks';
import { TokenActivity } from '../types';

/**
 * Check if an activity of token is duplicated, by comparing it to the
 * transaction_timestamp and transaction_version and name
 * of the last activity fetched from the indexer.
 * @param curr token activity to be compared
 * @param last token activity from the previous query result
 */
function isTokenActivityDuplicated(curr: TokenActivity, last: TokenActivity) {
  if (curr.transactionTimestamp !== last.transactionTimestamp) {
    return curr.transactionTimestamp > last.transactionTimestamp;
  }

  if (curr.transactionVersion !== last.transactionVersion) {
    return curr.transactionVersion > last.transactionVersion;
  }

  return curr.name > last.name;
}

/**
 * Parse token activity from the result of an indexer query
 * @param data token activity
 */
export function parseTokenActivity(
  tokenActivity: TokenActivitiesFragment,
): TokenActivity {
  return {
    accountAddress: tokenActivity.event_account_address,
    coinAmount: tokenActivity.coin_amount,
    coinType: tokenActivity.coin_type,
    collectionDataIdHash: tokenActivity.collection_data_id_hash,
    collectionName: tokenActivity.collection_name,
    creationNumber: tokenActivity.event_creation_number,
    creatorAddress: tokenActivity.creator_address,
    fromAddress: tokenActivity.from_address,
    name: tokenActivity.name,
    propertyVersion: tokenActivity.property_version,
    sequenceNumber: tokenActivity.event_sequence_number,
    toAddress: tokenActivity.to_address,
    tokenAmount: tokenActivity.token_amount,
    tokenDataIdHash: tokenActivity.token_data_id_hash,
    transactionTimestamp: tokenActivity.transaction_timestamp,
    transactionVersion: tokenActivity.transaction_version,
    transferType: tokenActivity.transfer_type,
  };
}

interface IndexedTokensProviderState {
  buffer: TokenActivity[];
  isDone: boolean;
  lastTokenActivity?: TokenActivity;
  offset: number;
}

/**
 * Factory for building a token provider that fetches data from the indexer.
 */
export default function useIndexedTokenActivitiesProviderFactory() {
  const { indexerClient } = useNetworks();

  return (tokenIdHash: string, queryStep: number) => {
    const state: IndexedTokensProviderState = {
      buffer: [],
      isDone: false,
      offset: 0,
    };

    async function fetchMore() {
      const result = (await indexerClient?.getTokenActivities({
        idHash: tokenIdHash,
        limit: queryStep,
        offset: state.offset,
      })) ?? { token_activities: [] };

      for (const tokenActivity of result.token_activities) {
        const parsedTokenActivity = parseTokenActivity(tokenActivity);
        if (
          !state.lastTokenActivity ||
          !isTokenActivityDuplicated(
            parsedTokenActivity,
            state.lastTokenActivity,
          )
        ) {
          state.buffer.push(parsedTokenActivity);
        }
      }

      state.offset += result.token_activities.length;
      state.lastTokenActivity = state.buffer[state.buffer.length - 1];
      state.isDone = result.token_activities.length < queryStep;
    }

    async function fetch(amount: number) {
      while (!state.isDone && state.buffer.length < amount) {
        // eslint-disable-next-line no-await-in-loop
        await fetchMore();
      }

      return state.buffer.splice(0, amount);
    }

    return { fetch };
  };
}
