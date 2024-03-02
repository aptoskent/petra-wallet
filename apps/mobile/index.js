// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { synchronizeTime } from '@petra/core/utils/server-time';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'text-encoding';
import 'buffer';
import './shim';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...', 'Non-serializable values were found in the navigation state',]);
LogBox.ignoreAllLogs();

// Synchronize client clock with server time.
synchronizeTime().then();

console.disableYellowBox = true;

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import Root from './src/App';

// used to jsonify bigint
BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

AppRegistry.registerComponent(appName, () => Root);
