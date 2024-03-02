// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  AptosClient,
  BCS,
  Types,
  TxnBuilderTypes,
  TransactionBuilderEd25519,
} from 'aptos';

import { handleApiError, throwForVmError } from './utils';

/**
 * Applies an empty signature, which the fullnode API expects for simulations
 */
function emptySigningFunction() {
  const invalidSigBytes = new Uint8Array(64);
  return new TxnBuilderTypes.Ed25519Signature(invalidSigBytes);
}

export async function simulateTransaction(
  publicKey: Uint8Array,
  aptosClient: AptosClient,
  rawTxn: TxnBuilderTypes.RawTransaction,
) {
  const signedTxnBuilder = new TransactionBuilderEd25519(
    emptySigningFunction,
    publicKey,
  );
  const signedTxn = signedTxnBuilder.sign(rawTxn);
  try {
    const simulationFlags = {
      // Using value 0 as flag for automatic estimation
      estimateGasUnitPrice: rawTxn.gas_unit_price === BigInt(0),
      estimateMaxGasAmount: rawTxn.max_gas_amount === BigInt(0),
      estimatePrioritizedGasUnitPrice: false,
    };
    const [txn] = await aptosClient.submitBCSSimulation(
      signedTxn,
      simulationFlags,
    );
    const userTxn = {
      ...txn,
      type: 'user_transaction',
    } as Types.Transaction_UserTransaction;
    throwForVmError(userTxn);
    return userTxn;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function submitTransaction(
  aptosClient: AptosClient,
  signedTxn: TxnBuilderTypes.SignedTransaction,
) {
  try {
    const encodedSignedTxn = BCS.bcsToBytes(signedTxn);
    return await aptosClient.submitSignedBCSTransaction(encodedSignedTxn);
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}
