// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  ActivityItem,
  ConfirmedActivityItem,
  UnconfirmedActivityItem,
  isConfirmedActivityItem,
} from '../types';
import useRestApi, { CachedPendingTransaction } from '../hooks/useRestApi';

// region Utils

function parseUnconfirmedCoinActivityItem(
  txn: CachedPendingTransaction,
): UnconfirmedActivityItem {
  const expirationTimestamp = Number(txn.expiration_timestamp_secs) * 1000;
  const isPending = txn.timestamp < expirationTimestamp;
  return {
    expirationTimestamp,
    status: isPending ? 'pending' : 'expired',
    txnHash: txn.hash,
  };
}

function getActivityItemTimestamp(item: ActivityItem) {
  return isConfirmedActivityItem(item)
    ? item.timestamp
    : item.expirationTimestamp;
}

// endregion

interface ConfirmedActivityProvider {
  fetchMore: () => Promise<ConfirmedActivityItem[]>;
  isDone: () => boolean;
}

type UnifiedFactory<T> = () => T | Promise<T>;
type ConfirmedActivityProviderFactory =
  UnifiedFactory<ConfirmedActivityProvider>;

interface ActivityProviderState {
  buffer: ActivityItem[];
  prevStartTimestamp?: number;
  provider: ConfirmedActivityProvider;
}

export default function useActivityProviderFactory(
  coinActivityProviderFactory: ConfirmedActivityProviderFactory,
) {
  const { getPendingTxns } = useRestApi();

  return async (address: string) => {
    const state: ActivityProviderState = {
      buffer: [],
      provider: await coinActivityProviderFactory(),
    };

    async function fetchMore() {
      const confirmedItems = await state.provider.fetchMore();

      let startTimestamp: number | undefined;
      confirmedItems.forEach((item) => {
        startTimestamp = startTimestamp
          ? Math.min(startTimestamp, item.timestamp)
          : item.timestamp;
      });

      // Use the timestamp range to fetch pending transactions and parse them into activity items
      const endTimestamp = state.prevStartTimestamp;
      const unconfirmedItems = await getPendingTxns(
        address,
        startTimestamp,
        endTimestamp,
      )
        .then((txns) =>
          txns.map((txn) => parseUnconfirmedCoinActivityItem(txn)),
        )
        .then((txns) => Promise.all(txns));

      // Combine and sort all new activity items and pushed them into the buffer
      const sortedMergedItems = [...unconfirmedItems, ...confirmedItems].sort(
        (a, b) => getActivityItemTimestamp(b) - getActivityItemTimestamp(a),
      );
      state.buffer.push(...sortedMergedItems);

      // Update state
      state.prevStartTimestamp = startTimestamp;
    }

    async function fetch(amount: number) {
      while (!state.provider.isDone() && state.buffer.length < amount) {
        // eslint-disable-next-line no-await-in-loop
        await fetchMore();
      }

      // Extract the required amount of activity items
      return state.buffer.splice(0, amount);
    }

    return { fetch };
  };
}
