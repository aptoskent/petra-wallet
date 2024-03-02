// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Signer } from '@petra/core/signers';
import { KeystoneAccount } from '@petra/core/types';
import { HexString, TransactionBuilder, TxnBuilderTypes } from 'aptos';
import AptosKeyring from './keyring';
import { KeystoneSignatureError, KeystoneSignatureErrorType } from './errors';

const petraOrigin = 'Petra';

export default class KeystoneSigner implements Signer {
  private readonly publicKey: string;

  private readonly keyring: AptosKeyring;

  constructor(account: KeystoneAccount) {
    this.publicKey = account.publicKey;
    this.keyring = AptosKeyring.fromAccount(account);
  }

  async signBuffer(buffer: Uint8Array) {
    const { signature } = await this.keyring.signMessage(
      this.publicKey,
      buffer,
      undefined,
      petraOrigin,
    );
    return signature;
  }

  async signTransaction(txn: TxnBuilderTypes.RawTransaction) {
    const publicKey = HexString.ensure(this.publicKey).toUint8Array();
    const signingMessage = TransactionBuilder.getSigningMessage(txn);

    try {
      const { signature } = await this.keyring.signTransaction(
        this.publicKey,
        Buffer.from(signingMessage),
        undefined,
        petraOrigin,
      );

      const authenticator = new TxnBuilderTypes.TransactionAuthenticatorEd25519(
        new TxnBuilderTypes.Ed25519PublicKey(publicKey),
        new TxnBuilderTypes.Ed25519Signature(signature),
      );

      return new TxnBuilderTypes.SignedTransaction(txn, authenticator);
    } catch (err: any) {
      // Convert Keystone error into more user-friendly one
      if (
        err instanceof Error &&
        err.message.startsWith('KeystoneError#invalid_data')
      ) {
        throw new KeystoneSignatureError(
          KeystoneSignatureErrorType.InvalidData,
        );
      }
      throw err;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async signMultiAgentTransaction(
    txn: TxnBuilderTypes.MultiAgentRawTransaction,
  ): Promise<Uint8Array> {
    throw new Error(`Not implemented for multi agent transaction: ${txn}`);
  }

  close = async () => {};
}
