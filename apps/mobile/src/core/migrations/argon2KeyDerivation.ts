// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { EncryptedStateMigration } from '@petra/core/encryptedState';
import {
  decryptAccounts,
  encryptAccounts,
} from '@petra/core/encryptedState/accountsEncryption';
import { deriveEncryptionKey } from '@petra/core/utils/keyDerivation';

const argon2KeyDerivationMigration: EncryptedStateMigration = {
  downgrade: async ({
    encryptedAccounts,
    keyDerivationAlgorithm,
    password,
    salt,
  }) => {
    const targetKeyDerivationAlgorithm = 'pbkdf2';
    if (keyDerivationAlgorithm === targetKeyDerivationAlgorithm) {
      return {};
    }
    const prevEncryptionKey = await deriveEncryptionKey(
      keyDerivationAlgorithm,
      password,
      salt,
    );
    const accounts = decryptAccounts(encryptedAccounts, prevEncryptionKey);
    const newEncryptionKey = await deriveEncryptionKey(
      targetKeyDerivationAlgorithm,
      password,
      salt,
    );
    const newEncryptedAccounts = encryptAccounts(accounts, newEncryptionKey);
    return {
      encryptedAccounts: newEncryptedAccounts,
      keyDerivationAlgorithm: targetKeyDerivationAlgorithm,
    };
  },
  upgrade: async ({
    encryptedAccounts,
    keyDerivationAlgorithm,
    password,
    salt,
  }) => {
    const argon2keyDerivationAlgorithm = 'argon2';
    if (keyDerivationAlgorithm === argon2keyDerivationAlgorithm) {
      return {};
    }
    const prevEncryptionKey = await deriveEncryptionKey(
      keyDerivationAlgorithm,
      password,
      salt,
    );
    const accounts = decryptAccounts(encryptedAccounts, prevEncryptionKey);

    const newEncryptionKey = await deriveEncryptionKey(
      argon2keyDerivationAlgorithm,
      password,
      salt,
    );
    const newEncryptedAccounts = encryptAccounts(accounts, newEncryptionKey);
    return {
      encryptedAccounts: newEncryptedAccounts,
      keyDerivationAlgorithm: argon2keyDerivationAlgorithm,
    };
  },
};

export default argon2KeyDerivationMigration;
