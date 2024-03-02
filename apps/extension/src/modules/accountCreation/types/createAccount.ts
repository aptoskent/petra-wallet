// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { LedgerAccount } from '@petra/core/types';

type LedgerTransport = LedgerAccount['transport'];

export interface CreateNewAccountParams {
  generatedMnemonic: string;
  source: 'generated';
}

export interface CreateAccountFromPrivateKeyParams {
  privateKey: string;
  source: 'privateKey';
}

export interface CreateAccountFromMnemonicParams {
  mnemonic: string;
  source: 'mnemonic';
}

export interface CreateAccountFromLedgerParams {
  address: string;
  hdPath: string;
  publicKey: string;
  source: 'ledger';
  transport: LedgerTransport;
}

export type CreateAccountParams =
  | CreateNewAccountParams
  | CreateAccountFromPrivateKeyParams
  | CreateAccountFromMnemonicParams
  | CreateAccountFromLedgerParams;

export type CreateAccountSource = CreateAccountParams['source'];
