// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-await-in-loop */

import bs58 from 'bs58';
import { PersistentState } from '../types';
import {
  EncryptedStateMigrationConfig,
  EncryptedStateMigrationContext,
  EncryptedStateUpdates,
} from './types';

let migrationConfig: EncryptedStateMigrationConfig | undefined;

export function setEncryptedStateMigrationConfig(
  newValue: EncryptedStateMigrationConfig,
) {
  migrationConfig = newValue;
}

function getMigration(forVersion: number) {
  if (migrationConfig === undefined) {
    throw new Error('Migration config not set');
  }

  const { firstAvailableVersion = 0, migrations } = migrationConfig;
  const migration = migrations[forVersion - firstAvailableVersion - 1];
  if (migration === undefined) {
    throw new Error(`Migration with version ${forVersion} not available`);
  }

  return migration;
}

export function getTargetEncryptedStateVersion() {
  if (migrationConfig === undefined) {
    throw new Error('Migration config not set');
  }
  const {
    firstAvailableVersion = 0,
    migrations,
    targetVersion,
  } = migrationConfig;
  return targetVersion ?? firstAvailableVersion + migrations.length;
}

export async function migrateEncryptedState(
  fromVersion: number,
  initialContext: EncryptedStateMigrationContext,
  toVersion: number,
) {
  let stateUpdates: EncryptedStateUpdates = {};
  if (fromVersion < toVersion) {
    for (
      let currVersion = fromVersion;
      currVersion < toVersion;
      currVersion += 1
    ) {
      const migration = getMigration(currVersion + 1);
      const currContext = { ...initialContext, ...stateUpdates };
      const newStateUpdates = await migration.upgrade(currContext);
      stateUpdates = { ...stateUpdates, ...newStateUpdates };
    }
  } else if (fromVersion > toVersion) {
    for (
      let currVersion = fromVersion;
      currVersion > toVersion;
      currVersion -= 1
    ) {
      const migration = getMigration(currVersion);
      if (migration.downgrade === undefined) {
        throw new Error(
          `Migration to version ${currVersion} cannot be downgraded.`,
        );
      }

      const currContext = { ...initialContext, ...stateUpdates };
      const newStateUpdates = await migration.downgrade(currContext);
      stateUpdates = { ...stateUpdates, ...newStateUpdates };
    }
  }
  return stateUpdates;
}

export function encryptedStateUpdatesToPersistentStateUpdates(
  encryptedStateUpdates: EncryptedStateUpdates,
) {
  const persistentStateChanges: Partial<PersistentState> = {};
  if (encryptedStateUpdates.encryptedAccounts) {
    const { ciphertext, nonce } = encryptedStateUpdates.encryptedAccounts;
    persistentStateChanges.encryptedAccounts = {
      ciphertext: bs58.encode(ciphertext),
      nonce: bs58.encode(nonce),
    };
  }
  if (encryptedStateUpdates.salt) {
    persistentStateChanges.salt = bs58.encode(encryptedStateUpdates.salt);
  }
  if (encryptedStateUpdates.keyDerivationAlgorithm) {
    persistentStateChanges.keyDerivationAlgorithm =
      encryptedStateUpdates.keyDerivationAlgorithm;
  }
  return persistentStateChanges;
}
