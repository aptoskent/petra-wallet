// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  migrateEncryptedState,
  setEncryptedStateMigrationConfig,
} from './migrate';
import { EncryptedStateMigration } from './types';

function makeMockMigration(version: number) {
  return jest.mocked<EncryptedStateMigration>({
    downgrade: jest.fn(
      async () => ({ last: version - 1, [version]: false } as any),
    ),
    upgrade: jest.fn(async () => ({ last: version, [version]: true } as any)),
  });
}

const dummyContext: any = {};

describe('encryptedState migrations', () => {
  test('single', async () => {
    const mockMigration = makeMockMigration(1);
    setEncryptedStateMigrationConfig({
      migrations: [mockMigration],
    });

    {
      const updates = await migrateEncryptedState(0, dummyContext, 1);
      expect(mockMigration.upgrade).toHaveBeenCalled();
      expect(updates).toHaveProperty('last', 1);
      expect(updates).toHaveProperty('1', true);
    }

    {
      const updates = await migrateEncryptedState(1, dummyContext, 0);
      expect(mockMigration.downgrade).toHaveBeenCalled();
      expect(updates).toHaveProperty('last', 0);
      expect(updates).toHaveProperty('1', false);
    }
  });

  test('chained migrations', async () => {
    const mockMigrations = [
      makeMockMigration(1),
      makeMockMigration(2),
      makeMockMigration(3),
    ];
    setEncryptedStateMigrationConfig({
      migrations: mockMigrations,
    });

    {
      const updates = await migrateEncryptedState(0, dummyContext, 3);
      expect(mockMigrations[0].upgrade).toHaveBeenCalled();
      expect(mockMigrations[1].upgrade).toHaveBeenCalled();
      expect(mockMigrations[2].upgrade).toHaveBeenCalled();
      expect(updates).toHaveProperty('last', 3);
      expect(updates).toHaveProperty('1', true);
      expect(updates).toHaveProperty('2', true);
      expect(updates).toHaveProperty('3', true);
    }

    {
      const updates = await migrateEncryptedState(3, dummyContext, 1);
      expect(mockMigrations[2].downgrade).toHaveBeenCalled();
      expect(mockMigrations[1].downgrade).toHaveBeenCalled();
      expect(mockMigrations[0].downgrade).not.toHaveBeenCalled();
      expect(updates).toHaveProperty('last', 1);
      expect(updates).toHaveProperty('3', false);
      expect(updates).toHaveProperty('2', false);
      expect(updates).not.toHaveProperty('1');
    }

    {
      const updates = await migrateEncryptedState(1, dummyContext, 0);
      expect(mockMigrations[0].downgrade).toHaveBeenCalled();
      expect(updates).toHaveProperty('last', 0);
      expect(updates).toHaveProperty('1', false);
    }
  });
});
