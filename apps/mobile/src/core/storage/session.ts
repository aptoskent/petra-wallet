// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable class-methods-use-this */

import type {
  Storage as StorageInterface,
  StorageChanges,
} from '@petra/core/storage';

export default class SessionNativeStorage<TState>
  implements StorageInterface<TState>
{
  storage = new Map<string, string>();

  async get<TKey extends keyof TState>(keys: TKey[]) {
    const values = {} as Pick<TState, TKey>;
    await Promise.all(
      keys.map(async (key) => {
        const serialized = this.storage.get(key as string);
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
          return this.storage.set(key, serialized);
        }
        return this.storage.delete(key);
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange(callback: (changes: StorageChanges<TState>) => void) {
    // TODO
    return () => {};
  }
}
