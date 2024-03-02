// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type { CoinActivityFieldsFragment } from '@petra/indexer-client';
import { Types } from 'aptos';
import { useCallback } from 'react';
import useRestApi from '../hooks/useRestApi';
import { useNetworks } from '../hooks/useNetworks';
import { BaseConfirmedActivityItem, ConfirmedActivityItem } from '../types';
import { normalizeTimestamp } from '../transactions';

function useParseIndexerCoinActivityItem() {
  const { getCoinInfo, getNameFromAddress, getTransaction } = useRestApi();

  return useCallback(
    async (
      activity: CoinActivityFieldsFragment,
    ): Promise<ConfirmedActivityItem> => {
      const isCoinTransferTxn =
        activity.entry_function_id_str === '0x1::coin::transfer' ||
        activity.entry_function_id_str === '0x1::aptos_account::transfer';
      const isDeposit = activity.activity_type === '0x1::coin::DepositEvent';
      const isGasFee = activity.is_gas_fee;

      const normalizedTimestamp = normalizeTimestamp(
        activity.transaction_timestamp,
      );
      const datetime = new Date(normalizedTimestamp);

      const coinInfo = await getCoinInfo(activity.coin_type);
      const common: BaseConfirmedActivityItem = {
        amount: BigInt(isDeposit ? activity.amount : -activity.amount),
        coinInfo,
        creationNum: activity.event_creation_number,
        sequenceNum: activity.event_sequence_number,
        status: activity.is_transaction_success ? 'success' : 'failed',
        timestamp: datetime.getTime(),
        txnVersion: activity.transaction_version,
      };

      if (isCoinTransferTxn && !isGasFee) {
        const txn = await getTransaction(activity.transaction_version);
        const recipient = (txn.payload as Types.EntryFunctionPayload)
          .arguments[0];
        return {
          recipient,
          recipientName: await getNameFromAddress(recipient),
          sender: txn.sender,
          senderName: await getNameFromAddress(txn.sender),
          type: 'coinTransfer',
          ...common,
        };
      }

      return {
        type: isGasFee ? 'gasFee' : 'coinEvent',
        ...common,
      };
    },
    [getCoinInfo, getNameFromAddress, getTransaction],
  );
}

/**
 * Check if specified item is duplicated, by comparing it to the
 * key of the last item fetched from the indexer. Since the query results are sorted,
 * this is the only check needed to know if an element should be discarded
 * @param curr item to be compared
 * @param last last item from the previous query result
 */
function isActivityItemDuplicated(
  curr: CoinActivityFieldsFragment,
  last: CoinActivityFieldsFragment,
) {
  if (curr.transaction_version !== last.transaction_version) {
    return curr.transaction_version > last.transaction_version;
  }
  if (curr.event_account_address !== last.event_account_address) {
    return curr.event_account_address > last.event_account_address;
  }
  if (curr.event_creation_number !== last.event_creation_number) {
    return curr.event_creation_number > last.event_creation_number;
  }
  return curr.event_sequence_number > last.event_sequence_number;
}

interface IndexedActivityProviderState {
  isDone: boolean;
  lastItem?: CoinActivityFieldsFragment;
  offset: number;
  prevStartTimestamp?: number;
}

export default function useIndexedActivityProviderFactory() {
  const { indexerClient } = useNetworks();
  const parseIndexerCoinActivityItem = useParseIndexerCoinActivityItem();

  return (address: string, queryStep: number) => {
    const state: IndexedActivityProviderState = {
      isDone: false,
      offset: 0,
    };

    async function fetchMore() {
      // Fetch some activity items from the indexer endpoint
      const result = (await indexerClient?.getAccountCoinActivity({
        address,
        limit: queryStep,
        offset: state.offset,
      })) ?? { coin_activities: [] };

      // Parse indexed activity items and extract start timestamp
      const newItems: ConfirmedActivityItem[] = [];
      await Promise.all(
        result.coin_activities.map(async (item) => {
          if (
            !state.lastItem ||
            !isActivityItemDuplicated(item, state.lastItem)
          ) {
            const parsedItem = await parseIndexerCoinActivityItem(item);
            newItems.push(parsedItem);
          }
        }),
      );

      // Update state
      state.offset += result.coin_activities.length;
      state.lastItem =
        result.coin_activities[result.coin_activities.length - 1];
      state.isDone = result.coin_activities.length < queryStep;

      return newItems;
    }

    return {
      fetchMore,
      isDone: () => state.isDone,
    };
  };
}
