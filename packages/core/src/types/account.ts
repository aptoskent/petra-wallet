// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export interface EncryptedAccounts {
  ciphertext: string;
  nonce: string;
}

export interface PublicAccount {
  address: string;
  name?: string;
  publicKey: string;
}

export type LocalAccount = PublicAccount & {
  mnemonic?: string;
  privateKey: string;
  type?: 'local';
};

// region Ledger

export type BaseLedgerAccount = PublicAccount & {
  hdPath: string;
  type: 'ledger';
};

export type LedgerHidAccount = BaseLedgerAccount & {
  transport: 'hid';
};

export type LedgerBluetoothAccount = BaseLedgerAccount & {
  transport: 'ble';
};

export type LedgerSpeculosAccount = BaseLedgerAccount & {
  transport: 'speculos';
};

export type LedgerAccount =
  | LedgerHidAccount
  | LedgerBluetoothAccount
  | LedgerSpeculosAccount;

export type LedgerTransport = LedgerAccount['transport'];

// endregion

export type KeystoneAccount = PublicAccount & {
  device?: string;
  hdPath: string;
  index: number;
  type: 'keystone';
  xfp: string;
};

export type Account = LocalAccount | LedgerAccount | KeystoneAccount;
export type Accounts = Record<string, Account>;
