// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Storage } from 'webextension-polyfill';
import {
  Storage as StorageInterface,
  StorageChanges,
} from '@petra/core/storage';
import { PersistentState, SessionState } from '@petra/core/types';

type ExtendedAreaName = chrome.storage.AreaName | 'session';
type ChromeStorageChanges = { [key: string]: chrome.storage.StorageChange };
type ChromeStorageChangeCallback = (
  changes: ChromeStorageChanges,
  areaName: ExtendedAreaName,
) => void;

function getStorageAreaName(storage: Storage.StorageArea): ExtendedAreaName {
  return storage === chrome.storage.local ? 'local' : 'session';
}

// TODO: don't serialize any field as it's not required for chrome storage (requires migration)
const serializationExceptions = ['aptosWalletPermissions'];

function serialize(key: string, value: any) {
  return serializationExceptions.includes(key) ? value : JSON.stringify(value);
}

function deserialize(key: string, serialized: any) {
  return serializationExceptions.includes(key)
    ? serialized
    : JSON.parse(serialized);
}

export default class BrowserStorage<TState>
  implements StorageInterface<TState>
{
  constructor(private storage: Storage.StorageArea) {}

  async get<TKey extends keyof TState>(keys: TKey[]) {
    const serializedState = await this.storage.get(keys);

    const entries = Object.entries(serializedState);
    const mappedEntries = entries.map(([key, serialized]) => [
      key,
      serialized ? deserialize(key, serialized) : undefined,
    ]);

    return Object.fromEntries(mappedEntries) as Pick<TState, TKey>;
  }

  async set(values: Partial<TState>) {
    const serializedValues: Record<string, string> = {};
    const keysToRemove: string[] = [];

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        serializedValues[key] = serialize(key, value);
      } else {
        keysToRemove.push(key);
      }
    });

    await Promise.all([
      await this.storage.set(serializedValues),
      await this.storage.remove(keysToRemove),
    ]);
  }

  onChange(callback: (changes: StorageChanges<TState>) => void) {
    const onStorageChange: ChromeStorageChangeCallback = (
      changes,
      areaName,
    ) => {
      if (getStorageAreaName(this.storage) !== areaName) {
        return;
      }

      const mappedChanges: any = {};
      Object.keys(changes).forEach((key) => {
        const change = changes[key] as any;
        const newValue =
          change?.newValue !== undefined
            ? deserialize(key, change.newValue)
            : undefined;
        const oldValue =
          change?.oldValue !== undefined
            ? deserialize(key, change.oldValue)
            : undefined;

        mappedChanges[key] = { newValue, oldValue };
      });

      callback(mappedChanges as StorageChanges<TState>);
    };

    chrome.storage.onChanged.addListener(onStorageChange);
    return () => chrome.storage.onChanged.removeListener(onStorageChange);
  }
}

export function makeBrowserPersistentStorage() {
  return new BrowserStorage<PersistentState>(chrome.storage.local);
}

export function makeBrowserSessionStorage() {
  return new BrowserStorage<SessionState>((chrome.storage as any).session);
}
