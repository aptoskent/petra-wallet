// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as KeystoneAPI from '../api';
import type { AptosURType, SerializedUR } from '../types';
import { KeystoneSignatureError, KeystoneSignatureErrorType } from '../errors';

export interface KeystoneRequestContextProps {
  // For some reason this rule is giving a false positive here
  // eslint-disable-next-line react/no-unused-prop-types
  urType: AptosURType;
}

export function useKeystoneRequestContextValue({
  urType,
}: KeystoneRequestContextProps) {
  const [keystoneRequestUR, setKeystoneRequestUR] = useState<SerializedUR>();
  const [keystoneStep, setKeystoneStep] = useState<'generate' | 'scan'>();

  useEffect(
    () =>
      KeystoneAPI.onKeystoneRequest((ur) => {
        setKeystoneRequestUR(ur);
        setKeystoneStep('generate');
      }),
    [setKeystoneRequestUR],
  );

  const cancelKeystoneRequest = useCallback(() => {
    KeystoneAPI.sendKeystoneResponse(
      new KeystoneSignatureError(KeystoneSignatureErrorType.Cancelled),
    );
    setKeystoneRequestUR(undefined);
    setKeystoneStep(undefined);
  }, []);

  const sendKeystoneResponse = useCallback((ur: SerializedUR) => {
    KeystoneAPI.sendKeystoneResponse(ur);
    setKeystoneRequestUR(undefined);
    setKeystoneStep(undefined);
  }, []);

  return {
    cancelKeystoneRequest,
    keystoneRequestUR,
    keystoneStep,
    sendKeystoneResponse,
    setKeystoneStep,
    urType,
  };
}

export type KeystoneRequestContextValue = ReturnType<
  typeof useKeystoneRequestContextValue
>;

export const KeystoneRequestContext = createContext<
  KeystoneRequestContextValue | undefined
>(undefined);
KeystoneRequestContext.displayName = 'KeystoneRequestContext';

export function useKeystoneRequestContext() {
  const context = useContext(KeystoneRequestContext);
  if (context === undefined) {
    throw new Error(`No provider for ${KeystoneRequestContext.displayName}`);
  }
  return context;
}
