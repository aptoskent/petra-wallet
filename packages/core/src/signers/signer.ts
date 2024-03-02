// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TxnBuilderTypes } from 'aptos';

export default interface Signer {
  close(): Promise<void>;

  signBuffer(buffer: Uint8Array): Promise<Uint8Array>;

  signMultiAgentTransaction(
    txn: TxnBuilderTypes.MultiAgentRawTransaction,
  ): Promise<Uint8Array>;

  signTransaction(
    txn: TxnBuilderTypes.RawTransaction,
  ): Promise<TxnBuilderTypes.SignedTransaction>;
}
