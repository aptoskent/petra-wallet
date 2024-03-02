// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosClient, TxnBuilderTypes, Types } from 'aptos';
import { QueryKey, useQuery, UseQueryOptions } from 'react-query';
import { useNetworks } from '../hooks/useNetworks';
import useParseTransaction, {
  AnyTransaction,
} from '../hooks/useParseTransaction';
import { MoveStatusCode, MoveVmError } from '../move';
import { TransactionPayload } from '../serialization';
import { OnChainTransaction, Transaction } from '../types';
import { useTransactions } from '../hooks/useTransactions';
import useSequenceNumber from '../hooks/useSequenceNumber';
import useRestApi from '../hooks/useRestApi';
import { TransactionOptions } from '../transactions';

export type UserTransaction = Types.UserTransaction;
export type RawTransaction = TxnBuilderTypes.RawTransaction;

export function isSequenceNumberTooOldError(err: unknown) {
  return (
    err instanceof MoveVmError &&
    err.statusCode === MoveStatusCode.SEQUENCE_NUMBER_TOO_OLD
  );
}

export const transactionQueryKeys = Object.freeze({
  getAccountLatestTransactionTimestamp: 'getAccountLatestTransactionTimestamp',
  getCoinTransferSimulation: 'getCoinTransferSimulation',
  getCoinTransferTransactions: 'getCoinTransferTransactions',
  getTransaction: 'getTransaction',
  getUserTransactions: 'getUserTransactions',
  registerAltCoinSimulation: 'registerAltCoinSimulation',
  registerCustomCoinSimulation: 'registerCustomCoinSimulation',
} as const);

/**
 * Get successful user transactions for the specified account
 */
export async function getUserTransactions(
  aptosClient: AptosClient,
  address: string,
) {
  const transactions = await aptosClient.getAccountTransactions(address, {
    limit: 200,
  });
  return transactions
    .filter((t) => t.type === 'user_transaction')
    .map((t) => t as UserTransaction)
    .filter((t) => t.success);
}

export async function getTransactionEvents(
  aptosClient: AptosClient,
  address: string,
  eventType: string | string[],
) {
  const transactions = await getUserTransactions(aptosClient, address);
  const eventTypes = Array.isArray(eventType) ? eventType : [eventType];
  const events: Types.Event[] = [];
  transactions.forEach((t) => {
    const foundEvents = t.events.filter(
      (event) => eventTypes.indexOf(event.type) !== -1,
    );
    events.push(...foundEvents);
  });
  return events;
}

// region Use transactions

export function useUserTransactions(
  address: string | undefined,
  options?: UseQueryOptions<UserTransaction[]>,
) {
  const { aptosClient } = useNetworks();

  return useQuery<UserTransaction[]>(
    [transactionQueryKeys.getUserTransactions, address],
    async () => getUserTransactions(aptosClient, address!),
    {
      ...options,
      enabled: Boolean(aptosClient && address) && options?.enabled,
    },
  );
}

// endregion

export const useTransaction = (
  versionOrHash: number | string | undefined,
  options?: UseQueryOptions<Transaction>,
) => {
  const { aptosClient } = useNetworks();
  const { getTransaction } = useRestApi();
  const parseTransaction = useParseTransaction();

  return useQuery<Transaction>(
    [transactionQueryKeys.getTransaction, versionOrHash],
    async () => {
      const isHash = `${versionOrHash}`.slice(0, 2) === '0x';
      const txn = isHash
        ? ((await aptosClient.getTransactionByHash(
            versionOrHash as string,
          )) as AnyTransaction)
        : await getTransaction(Number(versionOrHash));
      return parseTransaction(txn);
    },
    {
      ...options,
      enabled: Boolean(versionOrHash) && options?.enabled,
    },
  );
};

export function useAccountLatestTransactionTimestamp(
  address?: string,
  options?: UseQueryOptions<Date | undefined>,
) {
  const { aptosClient } = useNetworks();

  return useQuery<Date | undefined>(
    [transactionQueryKeys.getAccountLatestTransactionTimestamp, address],
    async () => {
      const txns = await aptosClient.getAccountTransactions(address!, {
        limit: 1,
      });
      const latestTxn = (txns as UserTransaction[]).pop();
      return latestTxn && new Date(Number(latestTxn?.timestamp) / 1000);
    },
    {
      ...options,
      enabled: Boolean(address) && options?.enabled,
    },
  );
}

export type PayloadFactory<TParams = void> = (
  params: TParams,
) => TransactionPayload;
export type PayloadOrFactory<TParams = void> =
  | TransactionPayload
  | PayloadFactory<TParams>;

export type UseTransactionSimulationOptions = UseQueryOptions<
  OnChainTransaction,
  Error
> & {
  txnOptions?: TransactionOptions;
};

export function useTransactionSimulation(
  queryKey: QueryKey,
  payloadOrFactory: PayloadOrFactory,
  options?: UseTransactionSimulationOptions,
) {
  const { invalidate: invalidateSeqNumber } = useSequenceNumber();
  const { buildRawTransaction, simulateTransaction } = useTransactions();
  const parseTransaction = useParseTransaction();

  return useQuery<OnChainTransaction, Error>(
    [...queryKey, { ...options?.txnOptions }],
    async () => {
      const payload =
        payloadOrFactory instanceof Function
          ? payloadOrFactory()
          : payloadOrFactory;

      const rawTxn = await buildRawTransaction(payload, options?.txnOptions);
      try {
        const simulatedTxn = await simulateTransaction(rawTxn);
        return (await parseTransaction(simulatedTxn)) as OnChainTransaction;
      } catch (err) {
        if (isSequenceNumberTooOldError(err)) {
          await invalidateSeqNumber();
        }
        throw err;
      }
    },
    {
      cacheTime: 0,
      retry: (count, err) => count === 0 && isSequenceNumberTooOldError(err),
      ...options,
    },
  );
}
