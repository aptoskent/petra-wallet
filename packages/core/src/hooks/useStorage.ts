// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from 'react';
import { PersistentState, SessionState } from '../types';
import { Storage } from '../storage';

export interface AppStorage {
  persistentStorage: Storage<PersistentState>;
  sessionStorage: Storage<SessionState>;
}

export const AppStorageContext = createContext<AppStorage | undefined>(
  undefined,
);
AppStorageContext.displayName = 'AppStorageContext';

export function useAppStorage() {
  const appStorage = useContext(AppStorageContext);
  if (appStorage === undefined) {
    throw new Error('No AppStorageContext was provided');
  }
  return appStorage;
}
