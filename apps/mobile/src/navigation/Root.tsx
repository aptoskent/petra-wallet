// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { setEncryptedStateMigrationConfig } from '@petra/core/encryptedState';
import bip44MnemonicMigration from '@petra/core/encryptedState/migrations/bip44Mnemonic';
import { setKeyDerivationImplementation } from '@petra/core/utils/keyDerivation';
import pbkdf2DeriveKey from '@petra/core/utils/pbkdf2DeriveKey';
import argon2KeyDerivationMigration from 'core/migrations/argon2KeyDerivation';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { PetraBackButton } from 'core/components';
import { View, Platform } from 'react-native';
import {
  AppLaunchStackParamList,
  ImportStackParamList,
  LoginStackParamList,
  RootAuthenticatedStackParamList,
  SignupStackParamList,
  TabParamList,
} from 'navigation/types';
import PetraSkipButton from 'core/components/PetraSkipButton';
import argon2DeriveKey from 'core/utils/argon2DeriveKey';

// Set derivation function implementations
setKeyDerivationImplementation('pbkdf2', pbkdf2DeriveKey);
setKeyDerivationImplementation('argon2', argon2DeriveKey);

setEncryptedStateMigrationConfig({
  migrations: [bip44MnemonicMigration, argon2KeyDerivationMigration],
});

export const RootAuthenticatedStack =
  createStackNavigator<RootAuthenticatedStackParamList>();
export const AppLaunchNavStack =
  createStackNavigator<AppLaunchStackParamList>();
export const HomeTabs = createBottomTabNavigator<TabParamList>();
export const ImportStack = createStackNavigator<ImportStackParamList>();
export const PendingNftsTab = createMaterialTopTabNavigator();
export const LoginStack = createStackNavigator<LoginStackParamList>();
export const SignupStack = createStackNavigator<SignupStackParamList>();

export const defaultBackButton = (navigation: any, props: any) => (
  <PetraBackButton {...props} navigation={navigation} />
);
export const defaultSkipButton = (navigation: any, props: any) => (
  <PetraSkipButton {...props} navigation={navigation} />
);

// iOS heading title is centered by default.
// to achieve the same on android, we needed
// to add a headerRight with the same width
// as headerLeft.
// PetraBackButton has a marginLeft: 16
// and an svg with width: 24 => 16 + 24 = 40
export const handleAndroidCentering = () =>
  Platform.OS === 'ios' ? null : <View style={{ width: 40 }} />;
