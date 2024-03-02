// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Platform } from 'react-native';

class Device {
  static isIos() {
    return Platform.OS === 'ios';
  }

  static isAndroid() {
    return Platform.OS === 'android';
  }
}

export default Device;
