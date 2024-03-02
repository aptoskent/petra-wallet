// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  AptosAccount,
  TxnBuilderTypes,
  TransactionBuilder,
  HexString,
} from 'aptos';
import { LocalAccount } from '../types';
import Signer from './signer';

export default class LocalSigner implements Signer {
  private aptosAccount: AptosAccount;

  constructor(account: LocalAccount) {
    const privateKey = HexString.ensure(account.privateKey).toUint8Array();
    this.aptosAccount = new AptosAccount(privateKey, account.address);
  }

  async signBuffer(buffer: Uint8Array) {
    return this.aptosAccount.signBuffer(buffer).toUint8Array();
  }

  async signTransaction(txn: TxnBuilderTypes.RawTransaction) {
    const signingMessage = TransactionBuilder.getSigningMessage(txn);
    const publicKey = this.aptosAccount.pubKey().toUint8Array();
    const signature = await this.signBuffer(signingMessage);

    const authenticator = new TxnBuilderTypes.TransactionAuthenticatorEd25519(
      new TxnBuilderTypes.Ed25519PublicKey(publicKey),
      new TxnBuilderTypes.Ed25519Signature(signature),
    );

    return new TxnBuilderTypes.SignedTransaction(txn, authenticator);
  }

  async signMultiAgentTransaction(
    txn: TxnBuilderTypes.MultiAgentRawTransaction,
  ) {
    const signingMessage = TransactionBuilder.getSigningMessage(txn);
    const signature = await this.signBuffer(signingMessage);
    return signature;
  }

  // eslint-disable-next-line class-methods-use-this
  async close() {
    // no-op
  }
}
