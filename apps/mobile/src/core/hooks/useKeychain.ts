// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useAppState } from '@petra/core/hooks/useAppState';
import constate from 'constate';
import Keychain from 'react-native-keychain';
import { v4 as randomUUID } from 'uuid';
import DeviceInfo from 'react-native-device-info';
import { i18nmock } from 'strings';
import { useState } from 'react';
import { useAnalytics } from '@segment/analytics-react-native';
import filterAnalyticsEvent from '@petra/core/utils/analytics';

const keychainId = 'PETRA_KEYCHAIN_ID';
const keychainService = 'PETRA_KEYCHAIN_SERVICE';
// The keychain config could change in the future and we will want to update this
const currentKeychainVersion = 1;

/**
 * Hook for accessing the active account.
 * Requires the accounts state to be unlocked and have at least an account
 */
export const [KeychainProvider, useKeychain] = constate(() => {
  const { hasBiometricPassword, keychainVersion, updatePersistentState } =
    useAppState();
  const { track } = useAnalytics();
  const [unlockedPassword, setUnlockedPassword] = useState<string | undefined>(
    undefined,
  );
  const hasPassword = hasBiometricPassword || unlockedPassword;

  const keychainOptions = (version: number | undefined) => {
    const baseOptions = {
      accessControl:
        Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      authenticationPrompt: { title: i18nmock('onboarding:biometrics.prompt') },
      authenticationType:
        Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    };
    switch (version) {
      case undefined:
      case 0:
        return baseOptions;
      default:
        return { ...baseOptions, ...{ service: keychainService } };
    }
  };

  const migrateVersionIfNeeded = async (password: string) => {
    if (keychainVersion && keychainVersion >= currentKeychainVersion) {
      return;
    }
    try {
      await Keychain.setGenericPassword(
        keychainId,
        password,
        keychainOptions(currentKeychainVersion),
      );
    } catch (e) {
      void track('KeychainSetGenericPassword-migrateVersionIfNeeded-Failure');
    }

    await updatePersistentState({ keychainVersion: currentKeychainVersion });
  };

  const keychainEnabled = async () => {
    try {
      const [isEmulator, hasPin] = await Promise.all([
        DeviceInfo.isEmulator(),
        DeviceInfo.isPinOrFingerprintSet(),
      ]);
      return !isEmulator && hasPin;
    } catch {
      void track('KeychainEnabledFailure');
      return false;
    }
  };

  const getPassword = async (forceAuthenticate: boolean = false) => {
    if (!forceAuthenticate && unlockedPassword) {
      return unlockedPassword;
    }
    try {
      const credentials = await Keychain.getGenericPassword(
        keychainOptions(keychainVersion),
      );
      if (credentials) {
        setUnlockedPassword(credentials.password);
        await migrateVersionIfNeeded(credentials.password);
        return credentials.password;
      }
      void track(
        'KeychainGetGenericPassword-getPassword-Success-NoCredentials',
      );
      return null;
    } catch (error) {
      const errorLabel = 'KeychainGetGenericPassword-getPassword-Failure';
      if (error instanceof Error) {
        const string = filterAnalyticsEvent(error.toString());
        void track(errorLabel, { error: string });
      } else {
        void track(errorLabel, { error: 'Unknown' });
      }
      return null;
    }
  };

  // There are times where we need to force authentication from the user
  const authenticate = async () => {
    try {
      const result = await Keychain.getGenericPassword(
        keychainOptions(keychainVersion ?? currentKeychainVersion),
      );
      return result !== false;
    } catch (error) {
      void track('KeychainGetGenericPassword-authenticate-Failure');
      return false;
    }
  };

  const createPassword = async () => {
    // if creating a new password, update to the latest version
    await updatePersistentState({ keychainVersion: currentKeychainVersion });

    const newPassword = randomUUID();
    let result;
    try {
      result = await Keychain.setGenericPassword(
        keychainId,
        newPassword,
        keychainOptions(currentKeychainVersion),
      );
    } catch {
      void track('KeychainSetGenericPassword-createPassword-Failure');
    }

    if (!result || !(await authenticate())) {
      return false;
    }
    setUnlockedPassword(newPassword);
    await updatePersistentState({ hasBiometricPassword: true });
    return true;
  };

  const resetPassword = async () => {
    try {
      await Promise.all([
        updatePersistentState({ hasBiometricPassword: false }),
        Keychain.resetGenericPassword(),
      ]);
      setUnlockedPassword(undefined);
    } catch {
      void track('KeychainResetGenericPassword-resetPassword-Failure');
    }
  };

  return {
    authenticate,
    createPassword,
    getPassword,
    hasPassword,
    keychainEnabled,
    resetPassword,
    unlockedPassword,
  };
});
