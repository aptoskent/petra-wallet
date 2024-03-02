// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/**
 * Storage change format, based off of Chrome Storage API
 */
export type StorageChange<T> = {
  newValue?: T;
  oldValue?: T;
};

/**
 * Dictionary of changes for a specific state type
 */
export type StorageChanges<TState> = {
  [key in keyof TState]?: StorageChange<TState[key]>;
};

export type StorageChangesCallback<TState> = (
  changes: StorageChanges<TState>,
) => void;

export type StorageChangesCallbackCleanup = () => void;

export interface Storage<TState> {
  /**
   * Asynchronously get a subset of the state by specifying a list of desired keys
   * @param keys the keys to fetch
   */
  get<TKey extends keyof TState>(keys: TKey[]): Promise<Pick<TState, TKey>>;

  /**
   * Listen to changes in storage
   * @param callback callback to trigger when a change occurred
   */
  onChange(
    callback: StorageChangesCallback<TState>,
  ): StorageChangesCallbackCleanup;

  /**
   * Asynchronously set a subset of the state py specifying a partial state object
   * @param values partial state object with new values
   */
  set(values: Partial<TState>): Promise<void>;
}
