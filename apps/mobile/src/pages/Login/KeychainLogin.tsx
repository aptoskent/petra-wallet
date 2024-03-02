// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { customColors } from '@petra/core/colors';
import { useInitializedAccounts } from '@petra/core/hooks/useAccounts';
import { petraLogo } from 'shared/assets/images';
import { i18nmock } from 'strings';
import { useKeychain } from 'core/hooks/useKeychain';
import KeychainError from 'core/components/KeychainError';

export default function KeychainLogin() {
  const { unlockAccounts } = useInitializedAccounts();
  const { getPassword, keychainEnabled } = useKeychain();
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onUnlock = async (password: string) => {
    try {
      await unlockAccounts(password);
    } catch (e: any) {
      Alert.alert(i18nmock('onboarding:passwordEntry.loginError'));
    }
  };

  const checkCredentials = async () => {
    setIsLoading(true);
    const isKeychainEnabled = await keychainEnabled();
    if (isKeychainEnabled) {
      const password = await getPassword(true);
      if (password) {
        await onUnlock(password);
      } else {
        setError(true);
      }
    } else {
      setError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRetry = () => {
    setError(false);
    checkCredentials();
  };

  if (error) {
    return <KeychainError isLoading={isLoading} onRetry={onRetry} />;
  }
  return (
    <View style={styles.container}>
      <Image source={petraLogo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: customColors.navy['900'],
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
});
