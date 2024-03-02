// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import PetraProgressBar from 'core/components/PetraProgressBar';
import { useKeychain } from 'core/hooks/useKeychain';
import { useTheme } from 'core/providers/ThemeProvider';
import ChooseAccountName from 'pages/Onboarding/Shared/ChooseAccountName';
import CongratsFinishSignUp from 'pages/Onboarding/Shared/CongratsFinishSignUp';
import SignUpMnemonicDisplay from 'pages/Onboarding/Signup/SignUpMnemonicDisplay';
import SignUpMnemonicEntry from 'pages/Onboarding/Signup/SignUpMnemonicEntry';
import SignUpPasswordEntry from 'pages/Onboarding/Signup/SignUpPasswordEntry';
import {
  SignupStack,
  defaultBackButton,
  defaultSkipButton,
  handleAndroidCentering,
} from './Root';

function SignupStackScreen() {
  const { unlockedPassword } = useKeychain();
  const numSteps = !unlockedPassword ? 4 : 3;

  const { theme } = useTheme();
  const headerStyle = {
    backgroundColor: theme.background.secondary,
  };

  return (
    <SignupStack.Navigator
      screenOptions={{
        headerBackTitle: '',
        headerMode: 'screen',
      }}
    >
      {unlockedPassword === undefined ? (
        <SignupStack.Screen
          options={({ navigation }) => ({
            headerLeft: (props) => defaultBackButton(navigation, props),
            headerRight: handleAndroidCentering,
            headerStyle,
            headerTitle: () => (
              <PetraProgressBar active={1} length={numSteps} />
            ),
            headerTitleAlign: 'center',
            title: '',
          })}
          name="Signup"
          component={SignUpPasswordEntry}
        />
      ) : null}
      <SignupStack.Screen
        options={({ navigation }) => ({
          headerLeft: (props) => defaultBackButton(navigation, props),
          headerRight: handleAndroidCentering,
          headerStyle,
          headerTitle: () => (
            <PetraProgressBar
              active={unlockedPassword ? 1 : 2}
              length={numSteps}
            />
          ),
          headerTitleAlign: 'center',
          title: '',
        })}
        name="SignUpMnemonicDisplay"
        component={SignUpMnemonicDisplay}
      />
      <SignupStack.Screen
        options={({ navigation }) => ({
          headerLeft: (props) => defaultBackButton(navigation, props),
          headerRight: handleAndroidCentering,
          headerStyle,
          headerTitle: () => (
            <PetraProgressBar
              active={unlockedPassword ? 2 : 3}
              length={numSteps}
            />
          ),
          headerTitleAlign: 'center',
          title: '',
        })}
        name="SignUpMnemonicEntry"
        component={SignUpMnemonicEntry}
      />
      <SignupStack.Screen
        options={({ navigation, route }) => ({
          headerLeft: (props) => defaultBackButton(navigation, props),
          headerRight: (props) =>
            defaultSkipButton(navigation, {
              ...props,
              onPress: () =>
                navigation.navigate('SignUpCongratsFinish', {
                  ...route.params,
                }),
            }),
          headerStyle,
          headerTitle: () => (
            <PetraProgressBar active={numSteps} length={numSteps} />
          ),
          headerTitleAlign: 'center',
          title: '',
        })}
        name="SignUpChooseAccountName"
        component={ChooseAccountName}
      />
      <SignupStack.Screen
        options={() => ({
          gestureEnabled: false,
          header: () => null,
          headerStyle,
        })}
        name="SignUpCongratsFinish"
        component={CongratsFinishSignUp}
      />
    </SignupStack.Navigator>
  );
}

export default SignupStackScreen;
