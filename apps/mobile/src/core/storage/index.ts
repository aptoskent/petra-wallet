// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type { PersistentState, SessionState } from '@petra/core/types';
import EncryptedNativeStorage from './encrypted';
import SessionNativeStorage from './session';

export const PersistentStorage = new EncryptedNativeStorage<PersistentState>();
export const SessionStorage = new SessionNativeStorage<SessionState>();
