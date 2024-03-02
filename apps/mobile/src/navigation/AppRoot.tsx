// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useAppState } from '@petra/core/hooks/useAppState';
import { customColors } from '@petra/core/colors';
import ForceUpdate from 'core/components/ForceUpdate';
import { View } from 'react-native';
import Guards from './Guards';
import AppAuthenticated from './AppAuthenticated';
import AppLaunchNavScreen from './AppLaunchNavScreen';
import LoginStackScreen from './LoginStackScreen';

function AppRoot() {
  const { isAppStateReady } = useAppState();
  if (!isAppStateReady) {
    return (
      <View style={{ backgroundColor: customColors.navy[900], flex: 1 }} />
    );
  }
  return (
    <>
      <Guards
        appLaunchScreen={<AppLaunchNavScreen />}
        appTabsAuthenticated={<AppAuthenticated />}
        appSignIn={<LoginStackScreen />}
      />
      <ForceUpdate />
    </>
  );
}

export default AppRoot;
