// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import PetraProgressBar from 'core/components/PetraProgressBar';
import { useKeychain } from 'core/hooks/useKeychain';
import { useTheme } from 'core/providers/ThemeProvider';
import ImportMnemonic from 'pages/Onboarding/ImportWallet/ImportMnemonic';
import ImportPrivateKey from 'pages/Onboarding/ImportWallet/ImportPrivateKey';
import ImportWalletOptions from 'pages/Onboarding/ImportWallet/ImportWalletOptions';
import ChooseAccountName from 'pages/Onboarding/Shared/ChooseAccountName';
import CongratsFinishSignUp from 'pages/Onboarding/Shared/CongratsFinishSignUp';
import ImportWalletPasswordCreation from 'pages/Onboarding/Shared/ImportWalletPasswordCreation';
import React from 'react';
import {
  HeaderBackButtonProps,
  HeaderTitleProps,
} from '@react-navigation/elements';
import { i18nmock } from 'strings';
import {
  ImportStack,
  defaultBackButton,
  defaultSkipButton,
  handleAndroidCentering,
} from './Root';
import {
  AppLaunchStackScreenProps,
  ChooseAccountNameProps,
  ImportStackParamList,
  ImportStackScreenProps,
} from './types';

function ImportStackScreen({
  route,
}: AppLaunchStackScreenProps<'ImportStack'>) {
  const { unlockedPassword } = useKeychain();
  const { theme } = useTheme();
  const headerStyle = {
    backgroundColor: theme.background.secondary,
  };
  const privateKey = route.params?.privateKey;
  let numSteps: number;
  let initialAccountNameParams: ChooseAccountNameProps;
  let initialRouteName: keyof ImportStackParamList;
  if (privateKey) {
    numSteps = !unlockedPassword ? 2 : 1;
    initialAccountNameParams = {
      confirmedPassword: unlockedPassword,
      fromRoute: 'ImportWalletPasswordCreation',
      privateKey,
    };
    initialRouteName = unlockedPassword
      ? 'ImportWalletChooseAccountName'
      : 'ImportWalletPasswordCreation';
  } else {
    numSteps = !unlockedPassword ? 4 : 3;
    initialAccountNameParams = {};
    initialRouteName = 'ImportOptions';
  }

  return (
    <ImportStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerBackTitle: '', headerMode: 'screen' }}
    >
      <ImportStack.Screen
        options={({ navigation }: ImportStackScreenProps<'ImportOptions'>) => ({
          headerLeft: (props: HeaderBackButtonProps) =>
            defaultBackButton(navigation, props),
          headerRight: handleAndroidCentering,
          headerStyle,
          headerTitle: (props: HeaderTitleProps) => (
            <PetraProgressBar active={1} length={numSteps} {...props} />
          ),
          headerTitleAlign: 'center',
        })}
        name="ImportOptions"
        component={ImportWalletOptions}
      />
      <ImportStack.Screen
        options={({
          navigation,
        }: ImportStackScreenProps<'ImportPrivateKey'>) => ({
          headerLeft: (props: HeaderBackButtonProps) =>
            defaultBackButton(navigation, props),
          headerRight: handleAndroidCentering,
          headerStyle,
          headerTitle: (props: HeaderTitleProps) => (
            <PetraProgressBar active={2} length={numSteps} {...props} />
          ),
          headerTitleAlign: 'center',
        })}
        name="ImportPrivateKey"
        component={ImportPrivateKey}
      />
      <ImportStack.Screen
        options={({
          navigation,
        }: ImportStackScreenProps<'ImportMnemonic'>) => ({
          headerLeft: (props: HeaderBackButtonProps) =>
            defaultBackButton(navigation, props),
          headerRight: handleAndroidCentering,
          headerStyle,
          headerTitle: (props: HeaderTitleProps) => (
            <PetraProgressBar active={2} length={numSteps} {...props} />
          ),
          headerTitleAlign: 'center',
          title: i18nmock('onboarding:importWallet.importMnemonic.title'),
        })}
        name="ImportMnemonic"
        component={ImportMnemonic}
      />
      <ImportStack.Screen
        options={({
          navigation,
        }: ImportStackScreenProps<'ImportWalletPasswordCreation'>) => ({
          headerLeft: (props: HeaderBackButtonProps) =>
            defaultBackButton(navigation, props),
          headerStyle,
          headerTitle: (props: HeaderTitleProps) => (
            <PetraProgressBar
              active={3 - numSteps}
              length={numSteps}
              {...props}
            />
          ),
          headerTitleAlign: 'center',
        })}
        initialParams={initialAccountNameParams}
        name="ImportWalletPasswordCreation"
        component={ImportWalletPasswordCreation}
      />
      <ImportStack.Screen
        options={({
          navigation,
          route: chooseAccountRoute,
        }: ImportStackScreenProps<'ImportWalletChooseAccountName'>) => ({
          headerLeft: (props: HeaderBackButtonProps) =>
            defaultBackButton(navigation, props),
          headerRight: (props) =>
            defaultSkipButton(navigation, {
              ...props,
              onPress: () =>
                navigation.navigate('ImportWalletCongratsFinish', {
                  ...(chooseAccountRoute.params ?? initialAccountNameParams),
                }),
            }),
          headerStyle,
          headerTitle: (props: HeaderTitleProps) => (
            <PetraProgressBar active={numSteps} length={numSteps} {...props} />
          ),
          headerTitleAlign: 'center',
          initialParams: { initialAccountNameParams },
          title: '',
        })}
        initialParams={initialAccountNameParams}
        name="ImportWalletChooseAccountName"
        component={ChooseAccountName}
      />
      <ImportStack.Screen
        options={() => ({
          gestureEnabled: false,
          header: () => null,
          headerStyle,
        })}
        name="ImportWalletCongratsFinish"
        component={CongratsFinishSignUp}
      />
    </ImportStack.Navigator>
  );
}

export default ImportStackScreen;
