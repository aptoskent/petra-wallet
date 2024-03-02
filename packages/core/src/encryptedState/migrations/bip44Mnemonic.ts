// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Accounts } from '../../types';
import { deriveEncryptionKey } from '../../utils/keyDerivation';
import { decryptAccounts, encryptAccounts } from '../accountsEncryption';
import { EncryptedStateMigration } from '../types';

const bip44MnemonicMigration: EncryptedStateMigration = {
  upgrade: async ({
    encryptedAccounts,
    keyDerivationAlgorithm,
    password,
    salt,
  }) => {
    const encryptionKey = await deriveEncryptionKey(
      keyDerivationAlgorithm,
      password,
      salt,
    );
    const currAccounts = decryptAccounts(encryptedAccounts, encryptionKey);
    const newAccounts: Accounts = {};
    for (const [key, currAccount] of Object.entries(currAccounts)) {
      const newAccount = { ...currAccount };
      const hasMnemonic =
        newAccount.type === 'local' || newAccount.type === undefined;
      if (hasMnemonic) {
        delete newAccount.mnemonic;
      }
      newAccounts[key] = newAccount;
    }
    const newEncryptedAccounts = encryptAccounts(newAccounts, encryptionKey);
    return { encryptedAccounts: newEncryptedAccounts };
  },
};

export default bip44MnemonicMigration;
