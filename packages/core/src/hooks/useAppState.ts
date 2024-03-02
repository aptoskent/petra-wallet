// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import constate from 'constate';
import { useEffect, useState } from 'react';
import { PersistentState, SessionState } from '../types';
import {
  featureConfigNeedsUpdate,
  fetchFeatureConfig,
} from '../utils/featureConfig';
import { useAppStorage } from './useStorage';

/**
 * Hook/provider for the app global state.
 * The state is split into persistent and session state, which are mapped respectively to
 * PersistentStorage and SessionStorage (cleared when the browser session ends).
 * The underlying storage is async in nature, thus the consumer needs to wait for
 * the `isAppStateReady` flag to be set before using the state.
 */
export const [AppStateProvider, useAppState] = constate(() => {
  const { persistentStorage, sessionStorage } = useAppStorage();
  const [persistentState, setPersistentState] = useState<PersistentState>();
  const [sessionState, setSessionState] = useState<SessionState>();
  const [isAppStateReady, setIsAppStateReady] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      persistentStorage.get([
        'activeAccountAddress',
        'activeAccountPublicKey',
        'activeNetworkChainId',
        'activeNetworkName',
        'activeNetworkRpcUrl',
        'autolockTimer',
        'customNetworks',
        'encryptedAccounts',
        'salt',
        'encryptedStateVersion',
        'featureConfig',
        'hiddenTokens',
        'approvalRequest',
        'aptosWalletPermissions',
        'hasBiometricPassword',
        'keychainVersion',
        'keyDerivationAlgorithm',
        'aptDisplayByAccount',
      ]),
      sessionStorage.get(['accounts', 'encryptionKey']),
    ]).then(([initialPersistentState, initialSessionState]) => {
      if (featureConfigNeedsUpdate(initialPersistentState.featureConfig)) {
        fetchFeatureConfig()
          .catch(() => initialPersistentState.featureConfig)
          .then((featureConfig) => persistentStorage.set({ featureConfig }));
      }
      setPersistentState(initialPersistentState);
      setSessionState(initialSessionState);
      setIsAppStateReady(true);
    });
  }, [persistentStorage, sessionStorage]);

  const updatePersistentState = async (newValues: Partial<PersistentState>) => {
    await persistentStorage.set(newValues);
    const newPersistentState = {
      ...persistentState,
      ...newValues,
    } as PersistentState;
    setPersistentState(newPersistentState);
  };

  const updateSessionState = async (newValues: Partial<SessionState>) => {
    await sessionStorage.set(newValues);
    const newSessionState = { ...sessionState, ...newValues } as SessionState;
    setSessionState(newSessionState);
  };

  return {
    ...persistentState,
    ...sessionState,
    isAppStateReady,
    updatePersistentState,
    updateSessionState,
  };
});
