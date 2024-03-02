// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import useParseTransaction from '@petra/core/hooks/useParseTransaction';
import useSequenceNumber from '@petra/core/hooks/useSequenceNumber';
import { useTransactions } from '@petra/core/hooks/useTransactions';
import { MoveStatusCode, MoveVmError } from '@petra/core/move';
import { TransactionPayload } from '@petra/core/serialization';
import { TransactionOptions } from '@petra/core/transactions';
import { OnChainTransaction } from '@petra/core/types';
import { BCS, HexString, TxnBuilderTypes } from 'aptos';
import { useMemo } from 'react';
import { QueryKey, useQuery, UseQueryOptions } from 'react-query';

export function isSequenceNumberTooOldError(err: unknown) {
  return (
    err instanceof MoveVmError &&
    err.statusCode === MoveStatusCode.SEQUENCE_NUMBER_TOO_OLD
  );
}

export function getTransactionSimulationQueryKey(
  networkName: string,
  senderAddress: string,
  serializedPayload?: string,
  options?: TransactionOptions,
): QueryKey {
  return [
    networkName,
    senderAddress,
    'txnSimulation',
    serializedPayload,
    { ...options },
  ];
}

interface UseTransactionSimulationOptions
  extends UseQueryOptions<OnChainTransaction> {
  txnOptions?: TransactionOptions;
}

export default function useTransactionSimulation(
  payload: TransactionPayload | undefined,
  options?: UseTransactionSimulationOptions,
) {
  const { activeNetworkName } = useNetworks();
  const { activeAccountAddress } = useActiveAccount();

  const { invalidate: invalidateSeqNumber } = useSequenceNumber();
  const { buildRawTransaction, simulateTransaction } = useTransactions();
  const parseTransaction = useParseTransaction();

  const serializedPayload = useMemo(() => {
    if (payload === undefined) {
      return undefined;
    }
    // TODO: maybe just hash?
    if (payload instanceof TxnBuilderTypes.TransactionPayload) {
      const serializedBytes = BCS.bcsToBytes(payload);
      return HexString.fromUint8Array(serializedBytes).toShortString();
    }
    return JSON.stringify(payload);
  }, [payload]);

  return useQuery<OnChainTransaction>(
    getTransactionSimulationQueryKey(
      activeNetworkName,
      activeAccountAddress,
      serializedPayload,
      options?.txnOptions,
    ),
    async () => {
      const rawTxn = await buildRawTransaction(payload!, options?.txnOptions);
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
      retry: (count, err) => count === 0 && isSequenceNumberTooOldError(err),
      ...options,
      enabled: payload !== undefined && options?.enabled,
    },
  );
}
