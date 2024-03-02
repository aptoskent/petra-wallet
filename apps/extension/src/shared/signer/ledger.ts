// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Transport from '@ledgerhq/hw-transport';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { Signer } from '@petra/core/signers';
import { LedgerAccount, LedgerTransport } from '@petra/core/types';
import { TxnBuilderTypes, TransactionBuilder, HexString } from 'aptos';
import axios from 'axios';

import Aptos from 'core/ledger';
import SpeculosHttpTransport from 'core/utils/hw-transport-node-speculos-http';

const isProductionEnv = process.env.NODE_ENV === 'production';
const speculosEndpoint = isProductionEnv
  ? 'http://localhost:5000'
  : '/speculos';

export async function makeLedgerClient(transportType: LedgerTransport) {
  let transport: Transport;
  if (transportType === 'speculos') {
    const instance = axios.create({ baseURL: speculosEndpoint });
    transport = new SpeculosHttpTransport(instance as any, {});
  } else if (transportType === 'hid') {
    transport = await TransportWebHID.create();
  } else {
    throw new Error('Unsupported transport');
  }

  return new Aptos(transport);
}

export default class LedgerSigner implements Signer {
  private constructor(
    private readonly ledgerClient: Aptos,
    private readonly hdPath: string,
    private readonly publicKey: string,
  ) {}

  static async create({ hdPath, publicKey, transport }: LedgerAccount) {
    const ledgerClient = await makeLedgerClient(transport);
    return new LedgerSigner(ledgerClient, hdPath, publicKey);
  }

  async signBuffer(buffer: Uint8Array) {
    const { signature } = await this.ledgerClient.signTransaction(
      this.hdPath,
      Buffer.from(buffer),
    );
    return signature;
  }

  async signTransaction(txn: TxnBuilderTypes.RawTransaction) {
    const publicKey = HexString.ensure(this.publicKey).toUint8Array();
    const signingMessage = TransactionBuilder.getSigningMessage(txn);
    const { signature } = await this.ledgerClient.signTransaction(
      this.hdPath,
      Buffer.from(signingMessage),
    );

    const authenticator = new TxnBuilderTypes.TransactionAuthenticatorEd25519(
      new TxnBuilderTypes.Ed25519PublicKey(publicKey),
      new TxnBuilderTypes.Ed25519Signature(signature),
    );

    return new TxnBuilderTypes.SignedTransaction(txn, authenticator);
  }

  // eslint-disable-next-line class-methods-use-this
  async signMultiAgentTransaction(
    txn: TxnBuilderTypes.MultiAgentRawTransaction,
  ): Promise<Uint8Array> {
    throw new Error(`Not implemented for multi agent transaction: ${txn}`);
  }

  async close() {
    await this.ledgerClient.transport.close();
  }
}
