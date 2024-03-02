// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TxnBuilderTypes, Types } from 'aptos';
import { useMutation, UseQueryOptions, UseMutationOptions } from 'react-query';
import useParseTransaction from '../hooks/useParseTransaction';
import { MoveStatusCode, MoveVmError } from '../move';
import { OnChainTransaction } from '../types';
import { useTransactions } from '../hooks/useTransactions';
import useSequenceNumber from '../hooks/useSequenceNumber';
import { TransactionOptions } from '../transactions';

export type RawTransaction = TxnBuilderTypes.RawTransaction;
export type TransactionPayload =
  | TxnBuilderTypes.TransactionPayload
  | Types.EntryFunctionPayload;

export type UseTransactionSubmitOptions<TParams> = UseMutationOptions<
  OnChainTransaction,
  Error,
  TParams
> & { txnOptions?: TransactionOptions };

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

export function isSequenceNumberTooOldError(err: unknown) {
  return (
    err instanceof MoveVmError &&
    err.statusCode === MoveStatusCode.SEQUENCE_NUMBER_TOO_OLD
  );
}

/**
 * Allow the user to specify an externally estimated gas fee that will be used
 * to compute the maxGasAmount
 */
export default function useTransactionSubmit<TParams>(
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
