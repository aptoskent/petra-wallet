// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { AptosAccount, HexString } from 'aptos';
import { derivePath } from 'ed25519-hd-key';
import { getAptosBip44Path } from '@petra/core/utils/account';
import { LedgerAccount, LocalAccount } from '@petra/core/types';
import { CreateAccountParams } from '../types/createAccount';

export function createLocalAccount(privateKeyBytes: Buffer): LocalAccount {
  const aptosAccount = new AptosAccount(privateKeyBytes);

  const privateKey = HexString.fromBuffer(privateKeyBytes).toString();
  const publicKey = aptosAccount.pubKey().toString();
  const address = aptosAccount.address().toString();

  return {
    address,
    privateKey,
    publicKey,
    type: 'local',
  };
}

export function createAccountFromPrivateKey(privateKey: string) {
  const privateKeyHex = HexString.ensure(privateKey).noPrefix();
  const privateKeyBytes = Buffer.from(privateKeyHex, 'hex');
  return createLocalAccount(privateKeyBytes);
}

export async function createAccountFromMnemonic(mnemonic: string) {
  if (!bip39.validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid mnemonic');
  }
  const derivationPath = getAptosBip44Path();
  const seedBytes = await bip39.mnemonicToSeed(mnemonic);
  const seed = Buffer.from(seedBytes).toString('hex');
  const { key: privateKeyBytes } = derivePath(derivationPath, seed);
  const account = createLocalAccount(privateKeyBytes);
  return { ...account, mnemonic };
}

export function createAccountFromLedger(params: Omit<LedgerAccount, 'type'>) {
  const account: LedgerAccount = {
    address: params.address,
    hdPath: params.hdPath,
    publicKey: params.publicKey,
    transport: params.transport,
    type: 'ledger',
  };
  return account;
}

export async function createAccount(params: CreateAccountParams) {
  switch (params.source) {
    case 'generated': {
      return createAccountFromMnemonic(params.generatedMnemonic);
    }
    case 'privateKey': {
      return createAccountFromPrivateKey(params.privateKey);
    }
    case 'mnemonic': {
      return createAccountFromMnemonic(params.mnemonic);
    }
    case 'ledger': {
      return createAccountFromLedger(params);
    }
    default: {
      throw new Error('Unexpected source');
    }
  }
}
