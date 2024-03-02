// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { AppLaunchStackScreenProps } from 'navigation/types';
import { useKeychain } from 'core/hooks/useKeychain';
import KeychainError from 'core/components/KeychainError';
import useStatusBarStyle from 'core/hooks/useStatusBarStyle';
import makeStyles from 'core/utils/makeStyles';

function AppLaunch({ navigation }: AppLaunchStackScreenProps<'AppLaunch'>) {
  const styles = useStyles();
  const {
    createPassword,
    getPassword,
    hasPassword,
    keychainEnabled,
    unlockedPassword,
  } = useKeychain();
  useStatusBarStyle('light-content', true);
  const [needsKeychain, setNeedsKeychain] = useState(
    !hasPassword || !unlockedPassword,
  );

  const screenHasBeenBlurred = React.useRef(false);
  const [error, setError] = useState<boolean>(false);

  const navigateToWelcomeOneTime = () => {
    if (!screenHasBeenBlurred.current) {
      navigation.navigate('Welcome');
    }
  };

  useEffect(
    () =>
      navigation.addListener('blur', () => {
        screenHasBeenBlurred.current = true;
      }),
    [navigation],
  );

  const checkCredentials = useCallback(async () => {
    setError(false);
    const isKeychainEnabled = await keychainEnabled();

    if (isKeychainEnabled) {
      if (hasPassword) {
        // If there already is a password, unlock device
        if (unlockedPassword === undefined) {
          const password = await getPassword();
          if (password) {
            setNeedsKeychain(false);
            navigateToWelcomeOneTime();
          } else {
            setError(true);
          }
        }
      } else {
        // If there is no password, create one
        const isSuccessful = await createPassword();
        if (isSuccessful) {
          setNeedsKeychain(false);
          navigateToWelcomeOneTime();
        } else {
          // We aren't handling this differently currently but we may in the future.
          setNeedsKeychain(false);
          navigateToWelcomeOneTime();
        }
      }
    } else {
      setNeedsKeychain(false);
      navigateToWelcomeOneTime();
    }
  }, [
    createPassword,
    getPassword,
    hasPassword,
    keychainEnabled,
    navigation,
    unlockedPassword,
  ]);
  const handleAfterAnimation = () => {
    if (needsKeychain) {
      checkCredentials();
    } else {
      navigateToWelcomeOneTime();
    }
  };

  useEffect(() => {
    handleAfterAnimation();
  }, []);

  if (error) {
    return <KeychainError isLoading={false} onRetry={checkCredentials} />;
  }

  return (
    <View style={styles.background}>
      <View style={styles.container} />
    </View>
  );
}

export default AppLaunch;

const useStyles = makeStyles((theme) => ({
  animatedLogo: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  background: {
    backgroundColor: theme.background.primary,
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    flex: 3,
    justifyContent: 'center',
  },
  headingText: {
    color: theme.typography.secondary,
    fontSize: 34,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  subText: {
    color: theme.typography.secondary,
    fontSize: 20,
  },
}));
