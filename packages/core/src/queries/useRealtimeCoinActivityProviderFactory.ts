// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ApiError, Types } from 'aptos';
import useRestApi from '../hooks/useRestApi';
import {
  CoinEvent,
  isCoinEvent,
  BaseConfirmedActivityItem,
  ConfirmedActivityItem,
} from '../types';
import { getCoinStoresByCoinType } from '../utils/resource';
import { useFetchAccountResources } from './useAccountResources';
import useEventProviderFactory, {
  EventProvider,
} from './useEventProviderFactory';

function handleGetTransactionError(err: any) {
  if (err instanceof ApiError && err.errorCode === 'internal_error') {
    const { message } = JSON.parse(err.message);
    const match = message?.match(/min available version is (\d+)\.$/);
    if (match) {
      return Number(match[1]);
    }
  } else {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  return undefined;
}

interface RealtimeCoinActivityProviderState {
  // Coin event providers used to extract coin activity
  eventProviders: Record<string, EventProvider[]>;
  isDone: boolean;
  minAvailableTxnVersion: number;
}

/**
 * Factory for building a coin activity provider that fetches data from
 * the fullnode REST API.
 */
export default function useRealtimeCoinActivityProviderFactory() {
  const fetchResources = useFetchAccountResources();
  const { getCoinInfo, getNameFromAddress, getTransaction } = useRestApi();
  const eventProviderFactory = useEventProviderFactory();

  return async (address: string) => {
    const state: RealtimeCoinActivityProviderState = {
      eventProviders: {},
      isDone: false,
      minAvailableTxnVersion: 0,
    };

    // Initialize coin event providers. We're looking at both deposit and withdraw events
    // from each coin store associated with the account
    const resources = await fetchResources(address);
    const coinStores = getCoinStoresByCoinType(resources);
    Object.entries(coinStores).forEach(([coinType, coinStore]) => {
      state.eventProviders[coinType] = [
        eventProviderFactory(coinStore.deposit_events),
        eventProviderFactory(coinStore.withdraw_events),
      ];
    });

    async function parseCoinEvent(
      creationNum: number,
      coinType: string,
      event: CoinEvent,
    ): Promise<ConfirmedActivityItem> {
      const coinInfo = await getCoinInfo(coinType);
      const isDeposit = event.type === '0x1::coin::DepositEvent';

      // Fetch associated transaction to extract missing details (e.g. status, timestamp, type)
      const txn = (await getTransaction(
        event.version,
      )) as Types.UserTransaction;
      const timestamp = Number(txn.timestamp) / 1000;
      const common: BaseConfirmedActivityItem = {
        amount: BigInt(isDeposit ? event.data.amount : -event.data.amount),
        coinInfo,
        creationNum,
        sequenceNum: event.sequenceNumber,
        status: txn.success ? 'success' : 'failed',
        timestamp,
        txnVersion: BigInt(event.version),
      };

      if (txn.payload.type === 'entry_function_payload') {
        const { arguments: args, function: functionName } =
          txn.payload as Types.EntryFunctionPayload;
        if (functionName === '0x1::coin::transfer') {
          const recipient = args[0];
          return {
            ...common,
            recipient,
            recipientName: await getNameFromAddress(recipient),
            sender: txn.sender,
            senderName: await getNameFromAddress(txn.sender),
            type: 'coinTransfer',
          };
        }
      }

      return {
        type: 'coinEvent',
        ...common,
      };
    }

    async function fetchMore(): Promise<ConfirmedActivityItem[]> {
      // region Fetch and buffer events
      // In order to ensure proper ordering, we need to keep track of the common
      // start version, and we only extract events after that version.
      let currStartVersion = 0;
      const allProviders = Object.values(state.eventProviders).flat();
      await Promise.all(
        allProviders.map(async (provider) => {
          const startVersion = await provider.fetchMore();
          currStartVersion = Math.max(currStartVersion, startVersion);
        }),
      );

      // TODO: fetch user transactions from common startVersion

      const items: ConfirmedActivityItem[] = [];
      const parsePromises: Promise<void>[] = [];
      for (const [coinType, providers] of Object.entries(
        state.eventProviders,
      )) {
        for (const provider of providers) {
          for (const event of provider.extract(currStartVersion)) {
            const isTxnPruned = event.version < state.minAvailableTxnVersion;
            if (isCoinEvent(event) && !isTxnPruned) {
              const promise = parseCoinEvent(
                provider.creationNum,
                coinType,
                event,
              )
                .then((item) => {
                  items.push(item);
                })
                .catch((err) => {
                  state.minAvailableTxnVersion = Math.max(
                    state.minAvailableTxnVersion,
                    handleGetTransactionError(err) ?? event.version,
                  );
                });
              parsePromises.push(promise);
            }
          }
        }
      }
      await Promise.all(parsePromises);

      state.isDone = allProviders.every((provider) => provider.isDone());
      return items;
    }

    return {
      fetchMore,
      isDone: () => state.isDone,
    };
  };
}
