// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { PersistentStorage, SessionStorage } from '.';

describe('PersistentStorage', () => {
  test('basic functionality', async () => {
    await PersistentStorage.set({ activeAccountAddress: 'bar' });
    expect(await PersistentStorage.get(['activeAccountAddress'])).toEqual({
      activeAccountAddress: 'bar',
    });
  });
});

describe('SessionStorage', () => {
  test('basic functionality', async () => {
    await SessionStorage.set({ encryptionKey: 'c0ffee' });
    expect(await SessionStorage.get(['encryptionKey'])).toEqual({
      encryptionKey: 'c0ffee',
    });
  });
});
