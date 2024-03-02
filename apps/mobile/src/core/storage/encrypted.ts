// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable class-methods-use-this */

import EncryptedStorage from 'react-native-encrypted-storage';
import type {
  Storage as StorageInterface,
  StorageChanges,
} from '@petra/core/storage';

export default class EncryptedNativeStorage<TState>
  implements StorageInterface<TState>
{
  async get<TKey extends keyof TState>(keys: TKey[]) {
    const values = {} as Pick<TState, TKey>;
    await Promise.all(
      keys.map(async (key) => {
        const serialized = await EncryptedStorage.getItem(key as string);
        values[key] = serialized ? JSON.parse(serialized) : undefined;
      }),
    );

    return values;
  }

  async set(values: Partial<TState>) {
    await Promise.all(
      Object.entries(values).map(([key, value]) => {
        if (value !== undefined) {
          const serialized = JSON.stringify(value);
          return EncryptedStorage.setItem(key, serialized);
        }
        return EncryptedStorage.removeItem(key);
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange(callback: (changes: StorageChanges<TState>) => void) {
    // TODO
    return () => {};
  }
}
