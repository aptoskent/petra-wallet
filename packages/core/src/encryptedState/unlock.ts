// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { deriveEncryptionKey } from '../utils/keyDerivation';
import { decryptAccounts } from './accountsEncryption';
import { EncryptedState, UnlockedEncryptedState } from './types';

export default async function unlockEncryptedState(
  { encryptedAccounts, keyDerivationAlgorithm, salt }: EncryptedState,
  password: string,
): Promise<UnlockedEncryptedState> {
  const encryptionKey = await deriveEncryptionKey(
    keyDerivationAlgorithm,
    password,
    salt,
  );
  const accounts = decryptAccounts(encryptedAccounts, encryptionKey);
  return { accounts, encryptionKey };
}
