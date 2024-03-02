// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  makeBrowserPersistentStorage,
  makeBrowserSessionStorage,
} from './browser';
import {
  makeWindowPersistentStorage,
  makeWindowSessionStorage,
} from './window';

// TODO: remove constants below once we have different entrypoints for build and development
const hasBrowserStorage = Boolean(typeof chrome === 'object' && chrome.storage);

export const PersistentStorage = hasBrowserStorage
  ? makeBrowserPersistentStorage()
  : makeWindowPersistentStorage();

export const SessionStorage = hasBrowserStorage
  ? makeBrowserSessionStorage()
  : makeWindowSessionStorage();
