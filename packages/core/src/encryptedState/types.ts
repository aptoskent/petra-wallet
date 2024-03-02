// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Accounts } from '../types';
import { KeyDerivationAlgorithm } from '../utils/keyDerivation';

export interface EncryptedAccounts {
  ciphertext: Uint8Array;
  nonce: Uint8Array;
}

export interface EncryptedState {
  encryptedAccounts: EncryptedAccounts;
  keyDerivationAlgorithm: KeyDerivationAlgorithm;
  salt: Uint8Array;
  version: number;
}

export interface UnlockedEncryptedState {
  accounts: Accounts;
  encryptionKey: Uint8Array;
}

export interface EncryptedStateUpdates {
  encryptedAccounts?: EncryptedAccounts;
  keyDerivationAlgorithm?: KeyDerivationAlgorithm;
  salt?: Uint8Array;
}

export interface EncryptedStateMigrationContext {
  encryptedAccounts: EncryptedAccounts;
  keyDerivationAlgorithm: KeyDerivationAlgorithm;
  password: string;
  salt: Uint8Array;
}

export type EncryptedStateMigrationContextUpdates = EncryptedStateUpdates & {
  unlockedEncryptedState?: UnlockedEncryptedState;
};

export type EncryptedStateMigrationFunc = (
  context: EncryptedStateMigrationContext,
) => Promise<EncryptedStateMigrationContextUpdates>;

export interface EncryptedStateMigration {
  downgrade?: EncryptedStateMigrationFunc;
  upgrade: EncryptedStateMigrationFunc;
}

export interface EncryptedStateMigrationConfig {
  firstAvailableVersion?: number;
  migrations: EncryptedStateMigration[];
  targetVersion?: number;
}
