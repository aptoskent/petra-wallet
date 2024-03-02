// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AppStorageContext } from '@petra/core/hooks/useStorage';
import React, { PropsWithChildren } from 'react';
import { PersistentStorage, SessionStorage } from 'core/storage';

const storageContext = {
  persistentStorage: PersistentStorage,
  sessionStorage: SessionStorage,
};

export default function MobileStorageProvider({ children }: PropsWithChildren) {
  return (
    <AppStorageContext.Provider value={storageContext}>
      {children}
    </AppStorageContext.Provider>
  );
}
