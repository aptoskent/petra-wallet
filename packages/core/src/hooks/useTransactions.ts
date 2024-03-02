// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { Types, TxnBuilderTypes, HexString } from 'aptos';
import { TransactionPayload } from '../serialization';

import useRestApi from './useRestApi';
import { useActiveAccount } from './useAccounts';
import { useNetworks } from './useNetworks';
import useSequenceNumber from './useSequenceNumber';
import useSigner from './useSigner';
import {
  buildRawTransactionFromBCSPayload,
  encodePayload,
  simulateTransaction as simulateTransactionMaster,
  submitTransaction as submitTransactionMaster,
  TransactionOptions,
} from '../transactions';

export function useTransactions() {
  const { aptosClient } = useNetworks();
  const { activeAccount } = useActiveAccount();
  const { addPendingTxn } = useRestApi();
  const { withSigner } = useSigner();
  const publicKey = HexString.ensure(activeAccount.publicKey).toUint8Array();

  const { get: getSequenceNumber } = useSequenceNumber();

  async function normalizePayload(payload: TransactionPayload) {
    return payload instanceof TxnBuilderTypes.TransactionPayload
      ? payload
      : encodePayload(aptosClient, payload);
  }

  async function buildRawTransaction(
    payload: TransactionPayload,
    options?: TransactionOptions,
  ) {
    const [chainId, sequenceNumber] = await Promise.all([
      aptosClient.getChainId(),
      getSequenceNumber(),
    ]);

    const normalizedPayload = await normalizePayload(payload);
    return buildRawTransactionFromBCSPayload(
      options?.sender ?? activeAccount.address,
      options?.sequenceNumber ?? sequenceNumber,
      chainId,
      normalizedPayload,
      options,
    );
  }

  const signTransaction = async (rawTxn: TxnBuilderTypes.RawTransaction) =>
    withSigner(activeAccount, (signer) => signer.signTransaction(rawTxn));

  const signMultiAgentTransaction = async (
    rawTxn: TxnBuilderTypes.MultiAgentRawTransaction,
  ) =>
    withSigner(activeAccount, (signer) =>
      signer.signMultiAgentTransaction(rawTxn),
    );

  const simulateTransaction = (rawTxn: TxnBuilderTypes.RawTransaction) =>
    simulateTransactionMaster(publicKey, aptosClient, rawTxn);

  const submitTransaction = async (
    signedTxn: TxnBuilderTypes.SignedTransaction,
  ) => {
    const pendingTxn = await submitTransactionMaster(aptosClient, signedTxn);
    try {
      const confirmedTxn = await aptosClient.waitForTransactionWithResult(
        pendingTxn.hash,
      );
      return confirmedTxn as Types.Transaction_UserTransaction;
    } catch (err) {
      await addPendingTxn(pendingTxn);
      throw err;
    }
  };

  return {
    aptosClient,
    buildRawTransaction,
    normalizePayload,
    signMultiAgentTransaction,
    signTransaction,
    simulateTransaction,
    submitTransaction,
  };
}

export default useTransactions;
