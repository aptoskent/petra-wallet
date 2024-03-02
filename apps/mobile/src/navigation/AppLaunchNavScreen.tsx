// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useKeychain } from 'core/hooks/useKeychain';
import AppLaunch from 'pages/Onboarding/AppLaunch';
import Welcome from 'pages/Onboarding/Welcome';
import React from 'react';
import ImportStackScreen from './ImportStackScreen';
import { AppLaunchNavStack } from './Root';
import SignupStackScreen from './SignupStackScreen';

function AppLaunchNavScreen() {
  const { unlockedPassword } = useKeychain();
  return (
    <AppLaunchNavStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {unlockedPassword === undefined ? (
        <AppLaunchNavStack.Screen name="AppLaunch" component={AppLaunch} />
      ) : null}
      <AppLaunchNavStack.Screen
        name="Welcome"
        component={Welcome}
        options={() => ({
          gestureEnabled: false,
        })}
      />
      <AppLaunchNavStack.Screen
        name="ImportStack"
        component={ImportStackScreen}
        options={() => ({
          gestureEnabled: false,
        })}
      />
      <AppLaunchNavStack.Screen
        name="SignupStack"
        component={SignupStackScreen}
      />
    </AppLaunchNavStack.Navigator>
  );
}

export default AppLaunchNavScreen;
