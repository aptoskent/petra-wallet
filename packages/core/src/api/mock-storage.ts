// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Storage, StorageChangesCallback } from '../storage';

export default class MockStorage<State> implements Storage<State> {
  private data: State = {} as State;

  private callbacks: Set<StorageChangesCallback<State>> = new Set();

  async get<TKey extends keyof State>(keys: TKey[]) {
    const result = {} as Pick<State, TKey>;
    for (const key of keys) {
      result[key] = this.data[key];
    }
    return result;
  }

  async set(values: Partial<State>) {
    const keys = Object.keys(values) as (keyof State)[];

    const changes: any = {};
    for (const key of keys) {
      changes[key] = {
        newValue: values[key],
        oldValue: this.data[key],
      };
    }
    this.data = { ...this.data, ...values };

    for (const callback of this.callbacks) {
      callback(changes);
    }
  }

  onChange(callback: StorageChangesCallback<State>) {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }
}
