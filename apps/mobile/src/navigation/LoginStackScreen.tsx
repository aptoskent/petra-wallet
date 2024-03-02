// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useKeychain } from 'core/hooks/useKeychain';
import { useTheme } from 'core/providers/ThemeProvider';
import { KeychainLogin, PasswordLogin } from 'pages/Login';
import { useFocusEffect } from '@react-navigation/native';
import { LoginStack } from './Root';

function LoginStackScreen() {
  const { theme } = useTheme();
  const { hasPassword } = useKeychain();
  useFocusEffect(
    useCallback(() => {
      // set to light-content: dark background, white texts and icons
      // because the login screen always has dark navy.900 background color
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(theme.background.primary);
      }

      // revert back to dark-content: light background, dark texts and icons
      // when unmounted because the authenticated flow will have white background
      return () => {
        StatusBar.setBarStyle('dark-content');
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor(theme.background.secondary);
        }
      };
    }, [theme]),
  );
  return (
    <LoginStack.Navigator screenOptions={{ headerShown: false }}>
      {hasPassword ? (
        <LoginStack.Screen name="Login" component={KeychainLogin} />
      ) : (
        <LoginStack.Screen name="Login" component={PasswordLogin} />
      )}
    </LoginStack.Navigator>
  );
}

export default LoginStackScreen;
