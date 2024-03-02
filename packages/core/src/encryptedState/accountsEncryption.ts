// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { randomBytes, secretbox } from 'tweetnacl';
import { Accounts } from '../types';
import { EncryptedAccounts } from './types';

export function encryptAccounts(
  accounts: Accounts,
  encryptionKey: Uint8Array,
): EncryptedAccounts {
  const plaintext = JSON.stringify(accounts);
  const nonce = randomBytes(secretbox.nonceLength);
  const plaintextBytes = new Uint8Array(Buffer.from(plaintext));
  const ciphertext = secretbox(plaintextBytes, nonce, encryptionKey);
  return { ciphertext, nonce };
}

export function decryptAccounts(
  { ciphertext, nonce }: EncryptedAccounts,
  encryptionKey: Uint8Array,
): Accounts {
  const plaintext = secretbox.open(ciphertext, nonce, encryptionKey)!;
  const decodedPlaintext = Buffer.from(plaintext).toString();
  return JSON.parse(decodedPlaintext) as Accounts;
}
