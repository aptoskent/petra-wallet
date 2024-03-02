// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQueryClient, UseMutationOptions, useMutation } from 'react-query';
import useSequenceNumber from '@petra/core/hooks/useSequenceNumber';
import { useTransactions } from '@petra/core/hooks/useTransactions';
import {
  isSequenceNumberTooOldError,
  PayloadFactory,
  useTransactionSimulation,
  UseTransactionSimulationOptions,
} from '@petra/core/queries/transaction';
import queryKeys from '@petra/core/queries/queryKeys';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import {
  buildAccountTransferPayload,
  buildCoinTransferPayload,
  TransactionOptions,
} from '@petra/core/transactions';
import { CoinTransferTransaction, OnChainTransaction } from '@petra/core/types';
import useParseTransaction from '@petra/core/hooks/useParseTransaction';
import { aptosCoinStructTag } from '@petra/core/constants';

import { coinEvents } from '@petra/core/utils/analytics/events';
import { useAnalytics } from 'core/hooks/useAnalytics';

// TODO: Figure out how to return this directly with the query hook
export type OnChainCoinTransferTxn = CoinTransferTransaction &
  OnChainTransaction;

export interface UseCoinTransferParams {
  amount: bigint | undefined;
  doesRecipientExist: boolean | undefined;
  gasUnitPrice: number | undefined;
  maxGasAmount: number | undefined;
  recipient: string | undefined;
  structTag?: string;
}

enum TransferCoinError {
  COIN_TRANSFER_TO_UNINITIALIZED_ACCOUNT = 'Error: Account is not initialized on chain, send APT to this account to initialize it',
}

/**
 * Query a coin transfer simulation for the specified recipient and amount
 */
export function useCoinTransferSimulation(
  {
    amount,
    doesRecipientExist,
    gasUnitPrice,
    maxGasAmount,
    recipient,
    structTag = aptosCoinStructTag,
  }: UseCoinTransferParams,
  options?: UseTransactionSimulationOptions,
) {
  const isReady =
    recipient !== undefined && amount !== undefined && amount >= 0n;

  return useTransactionSimulation(
    [
      'coinTransferSimulation',
      recipient,
      amount?.toString(),
      gasUnitPrice,
      maxGasAmount,
      structTag,
    ],
    () => {
      // Note: in the future, if custom coins are able to be directly transferred and
      // used to instantiate accounts, this will need to change
      if (!doesRecipientExist && structTag !== aptosCoinStructTag) {
        throw new Error(
          TransferCoinError.COIN_TRANSFER_TO_UNINITIALIZED_ACCOUNT,
        );
      }
      return doesRecipientExist
        ? buildCoinTransferPayload({
            amount: amount!,
            recipient: recipient!,
            structTag,
          })
        : buildAccountTransferPayload({
            amount: amount!,
            recipient: recipient!,
          });
    },
    {
      ...options,
      enabled: isReady && options?.enabled,
    },
  );
}

type SubmitCoinTransferParams = {
  amount: bigint;
  doesRecipientExist: boolean;
  recipient: string;
  structTag?: string;
};

export type UseTransactionSubmitOptions<TParams> = UseMutationOptions<
  OnChainTransaction,
  Error,
  TParams
> & { txnOptions?: TransactionOptions };

/**
 * Allow the user to specify an externally estimated gas fee that will be used
 * to compute the maxGasAmount
 */
export function useTransactionSubmit<TParams>(
  payloadFactory: PayloadFactory<TParams>,
  options?: UseTransactionSubmitOptions<TParams>,
) {
  const { increment: incrementSeqNumber, invalidate: invalidateSeqNumber } =
    useSequenceNumber();
  const { buildRawTransaction, signTransaction, submitTransaction } =
    useTransactions();
  const parseTransaction = useParseTransaction();

  return useMutation(
    async (params: TParams) => {
      const payload = payloadFactory(params);
      const rawTxn = await buildRawTransaction(payload, options?.txnOptions);
      const signedTxn = await signTransaction(rawTxn);
      try {
        return (await submitTransaction(signedTxn).then((txn) =>
          parseTransaction(txn),
        )) as OnChainTransaction;
      } catch (err) {
        if (isSequenceNumberTooOldError(err)) {
          await invalidateSeqNumber();
        }
        throw err;
      }
    },
    {
      retry: (count, err) => count === 0 && isSequenceNumberTooOldError(err),
      ...options,
      async onSuccess(...params) {
        await incrementSeqNumber();
        if (options?.onSuccess) {
          options.onSuccess(...params);
        }
      },
    },
  );
}

/**
 * Mutation for submitting a coin transfer transaction
 */
export function useCoinTransferTransaction(
  options?: UseTransactionSubmitOptions<SubmitCoinTransferParams>,
) {
  const queryClient = useQueryClient();
  const { activeAccountAddress } = useActiveAccount();
  const { trackEvent } = useAnalytics();
  const { activeNetwork } = useNetworks();

  return useTransactionSubmit<SubmitCoinTransferParams>(
    ({
      amount,
      doesRecipientExist,
      recipient,
      structTag = aptosCoinStructTag,
    }) => {
      // Note: in the future, if custom coins are able to be directly transferred and
      // used to instantiate accounts, this will need to change
      if (!doesRecipientExist && structTag !== aptosCoinStructTag) {
        throw new Error(
          TransferCoinError.COIN_TRANSFER_TO_UNINITIALIZED_ACCOUNT,
        );
      }
      const transferPayload = doesRecipientExist
        ? buildCoinTransferPayload({ amount, recipient, structTag })
        : buildAccountTransferPayload({
            amount,
            recipient,
          });

      return transferPayload;
    },
    {
      ...options,
      async onMutate() {
        await Promise.all([
          queryClient.invalidateQueries([
            queryKeys.getAccountOctaCoinBalance,
            activeAccountAddress,
          ]),
          queryClient.invalidateQueries([
            queryKeys.getUserTransactions,
            activeAccountAddress,
          ]),
        ]);
      },
      async onSettled(txn, error, ...rest) {
        const coinTransfer = txn as OnChainCoinTransferTxn | undefined;

        const eventType = coinTransfer?.success
          ? coinEvents.TRANSFER_APTOS_COIN
          : coinEvents.ERROR_TRANSFER_APTOS_COIN;

        const params = {
          amount: coinTransfer?.amount.toString(),
          coinType: coinTransfer?.coinType,
          fromAddress: coinTransfer?.sender,
          network: activeNetwork.nodeUrl,
          txnVersion: coinTransfer?.version,
        };

        trackEvent({ eventType, params });

        if (options?.onSettled && txn) {
          options.onSettled(txn, error, ...rest);
        }
      },
    },
  );
}
