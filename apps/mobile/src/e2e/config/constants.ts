// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
// copied from https://github.com/webdriverio/appium-boilerplate

import { Platform, Dimensions } from 'react-native';

export const IS_IOS = Platform.OS === 'ios';
export const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } =
  Dimensions.get('window');
