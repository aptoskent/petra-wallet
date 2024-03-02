// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Types } from 'aptos';
import { useRef } from 'react';
import {
  aptosCoinStructTag,
  aptosAccountCoinTransferFunction,
} from '../constants';
import { parseMoveAbortDetails, parseMoveMiscError } from '../move';
import {
  BaseTransaction,
  CoinBalanceChange,
  CoinInfoData,
  CoinStoreResourceData,
  EventHandle,
  Resource,
  Transaction,
  TransactionError,
  isEntryFunctionPayload,
} from '../types';
import useRestApi from './useRestApi';
import { useFetchNameFromAddress } from '../queries/useNameAddress';
import { getCoinStoresByCoinType } from '../utils/resource';
import { normalizeAddress } from '../utils/account';

export type AnyTransaction =
  | Types.Transaction_UserTransaction
  | Types.Transaction_PendingTransaction;

// region Utils

/**
 * Check if an event belongs to a specific event handle
 */
function doesEventBelongToHandle(event: Types.Event, eventHandle: EventHandle) {
  return (
    event.guid.account_address === eventHandle.guid.id.addr &&
    event.guid.creation_number === eventHandle.guid.id.creation_num
  );
}

/**
 * Utility function for asynchronously mapping an object using a mapping function
 * @param input input object
 * @param mapFn asynchronous mapping function
 */
async function asyncObjectMap<TInput, TOutput>(
  input: { [key: string]: TInput },
  mapFn: (input: TInput, key: string) => Promise<TOutput>,
) {
  const inputEntries = Object.entries(input);
  const outputEntries = await Promise.all(
    inputEntries.map(
      async ([key, value]) => [key, await mapFn(value, key)] as const,
    ),
  );
  return Object.fromEntries(outputEntries);
}

// endregion

type ResourcesByAccount = Record<string, Resource[]>;

const coinTransferFunction = '0x1::coin::transfer';
const accountTransferFunction = '0x1::aptos_account::transfer';
const coinMintFunction = '0x1::aptos_coin::mint';

/**
 * Parse the new state of resources affected by a transaction, grouped by owner address
 * @param txn originating transaction
 */
function getNewResourcesStateByAccount(txn: Types.UserTransaction) {
  const newResourcesStateByOwner: ResourcesByAccount = {};
  for (const change of txn.changes) {
    if (change.type === 'write_resource') {
      const { address, data } = change as Types.WriteResource;
      const normalizedAddress = normalizeAddress(address);
      const newResourceState = data as Resource;
      if (normalizedAddress in newResourcesStateByOwner) {
        newResourcesStateByOwner[normalizedAddress].push(newResourceState);
      } else {
        newResourcesStateByOwner[normalizedAddress] = [newResourceState];
      }
    }
  }
  return newResourcesStateByOwner;
}

function isOnChainTransaction(
  txn: AnyTransaction,
): txn is Types.Transaction_UserTransaction {
  return txn.type === 'user_transaction';
}

function parseError(vmStatus: string): TransactionError | undefined {
  if (vmStatus === 'Executed successfully') {
    return undefined;
  }

  const abortDetails = parseMoveAbortDetails(vmStatus);
  if (abortDetails !== undefined) {
    return {
      type: 'abort',
      ...abortDetails,
    };
  }

  // Note: considering an unmatched VM status as miscellaneous error
  const miscError = parseMoveMiscError(vmStatus);
  return {
    description: miscError ?? vmStatus,
    type: 'miscellaneous',
  };
}

/**
 * Hook that provides a function for parsing a `Types.Transaction` into
 * a managed transaction
 */
export default function useParseTransaction() {
  const cachedRestApi = useRestApi();
  const fetchNameFromAddress = useFetchNameFromAddress();

  // A tiny optimization for sharing CoinInfo refs instead of
  // having every `CoinBalanceChange` instance hold a copy
  const coinInfoMap = useRef<Record<string, CoinInfoData>>({}).current;
  async function getCoinInfo(coinType: string) {
    if (coinType in coinInfoMap) {
      return coinInfoMap[coinType];
    }
    const coinInfo = await cachedRestApi.getCoinInfo(coinType);
    if (coinInfo !== undefined) {
      coinInfoMap[coinType] = coinInfo;
    }
    return coinInfo;
  }

  /**
   * Get the coin store balance change from the associated events
   * @param coinType coin type associated to the store
   * @param coinStore coin store resource
   * @param events events emitted during the transaction
   */
  async function getCoinBalanceChange(
    coinType: string,
    coinStore: CoinStoreResourceData,
    events: Types.Event[],
  ) {
    const depositEventHandle = coinStore.deposit_events;
    const withdrawEventHandle = coinStore.withdraw_events;

    let amount = BigInt(0);
    for (const event of events) {
      if (doesEventBelongToHandle(event, depositEventHandle)) {
        amount += BigInt(event.data.amount);
      } else if (doesEventBelongToHandle(event, withdrawEventHandle)) {
        amount -= BigInt(event.data.amount);
      }
    }

    const coinInfo = await getCoinInfo(coinType);
    return {
      amount,
      coinInfo,
    } as CoinBalanceChange;
  }

  return async (txn: AnyTransaction): Promise<Transaction> => {
    const expirationTimestamp = Number(txn.expiration_timestamp_secs) * 1000;
    const gasUnitPrice = Number(txn.gas_unit_price);
    const { payload } = txn;
    const sender = normalizeAddress(txn.sender);
    const senderName = await fetchNameFromAddress(sender);

    const sharedProps = {
      expirationTimestamp,
      gasUnitPrice,
      hash: txn.hash,
      payload,
      sender,
      senderName,
    };

    let baseProps: BaseTransaction;
    if (isOnChainTransaction(txn)) {
      const resourcesByAccount = getNewResourcesStateByAccount(txn);
      const coinBalanceChangesByAccount = await asyncObjectMap(
        resourcesByAccount,
        async (resources) => {
          const coinStores = getCoinStoresByCoinType(resources);
          const balanceChanges = await asyncObjectMap(
            coinStores,
            async (coinStore, coinType) =>
              getCoinBalanceChange(coinType, coinStore, txn.events),
          );
          // Filter out zero-sum balance changes
          for (const [coinType, balanceChange] of Object.entries(
            balanceChanges,
          )) {
            if (balanceChange.amount === BigInt(0)) {
              delete balanceChanges[coinType];
            }
          }
          return balanceChanges;
        },
      );

      const timestamp = Math.round(Number(txn.timestamp) / 1000);
      const gasFee = Number(txn.gas_used);
      const version = Number(txn.version);
      const error = parseError(txn.vm_status);

      baseProps = {
        coinBalanceChanges: coinBalanceChangesByAccount,
        error,
        gasFee,
        onChain: true,
        rawChanges: txn.changes,
        rawEvents: txn.events,
        success: txn.success,
        timestamp,
        version,
        ...sharedProps,
      };
    } else {
      baseProps = {
        onChain: false,
        ...sharedProps,
      };
    }

    if (isEntryFunctionPayload(payload)) {
      if (
        payload.function === coinTransferFunction ||
        payload.function === accountTransferFunction ||
        payload.function === aptosAccountCoinTransferFunction
      ) {
        const recipient = normalizeAddress(payload.arguments[0]);
        const recipientName = await fetchNameFromAddress(recipient);
        const amount = BigInt(payload.arguments[1]);
        const coinType = payload.type_arguments[0] ?? aptosCoinStructTag;
        const coinInfo = await getCoinInfo(coinType);

        return {
          amount,
          coinInfo,
          coinType,
          recipient,
          recipientName,
          type: 'transfer',
          ...baseProps,
        };
      }

      if (payload.function === coinMintFunction) {
        const recipient = normalizeAddress(payload.arguments[0]);
        const amount = BigInt(payload.arguments[1]);
        const coinInfo = await getCoinInfo(aptosCoinStructTag);
        return {
          amount,
          coinInfo,
          recipient,
          type: 'mint',
          ...baseProps,
        };
      }
    }

    return {
      type: 'generic',
      ...baseProps,
    };
  };
}
