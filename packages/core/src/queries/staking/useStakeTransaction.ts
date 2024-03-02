// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { BCS, TxnBuilderTypes } from 'aptos';
import { StakeOperation } from './types';
import { useTransactionSimulation } from '../transaction';
import { maxGasFeeFromEstimated } from '../../transactions';
import { RefetchInterval } from '../../hooks/constants';
import { useTransactions } from '../../hooks/useTransactions';

interface UseStakeTransactionProps {
  address: string;
  amount: string;
  operation: StakeOperation;
}

export function useStakeTransaction({
  address,
  amount,
  operation,
}: UseStakeTransactionProps) {
  const { buildRawTransaction, signTransaction, submitTransaction } =
    useTransactions();
  const { AccountAddress, EntryFunction, TransactionPayloadEntryFunction } =
    TxnBuilderTypes;

  const payload = new TransactionPayloadEntryFunction(
    EntryFunction.natural(
      '0x1::delegation_pool',
      operation,
      [],
      [
        BCS.bcsToBytes(AccountAddress.fromHex(address)),
        BCS.bcsSerializeUint64(BigInt(amount)),
      ],
    ),
  );

  const simulation = useTransactionSimulation(
    ['stake transaction', address, amount, operation],
    payload,
    {
      keepPreviousData: true,
      refetchInterval: RefetchInterval.STANDARD,
    },
  );

  const gas = simulation.data
    ? {
        gasFee: simulation.data.gasFee,
        gasUnitPrice: simulation.data.gasUnitPrice,
        maxGasAmount: maxGasFeeFromEstimated(simulation.data.gasFee),
      }
    : null;

  return {
    error: simulation.error?.message || simulation.data?.error?.description,
    gas,
    isLoading: simulation.isLoading,
    async submitTransaction() {
      if (!gas) throw new Error('Wait for gas estimation to complete');
      const rawTxn = await buildRawTransaction(payload, {
        gasUnitPrice: gas.gasUnitPrice,
        maxGasAmount: gas.maxGasAmount,
      });
      const signedTxn = await signTransaction(rawTxn);
      return submitTransaction(signedTxn);
    },
  };
}

export default useStakeTransaction;
