// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-console */

import AsyncStorage from '@react-native-async-storage/async-storage';

/*
 * This class is used to store and retrieve data from the device's local storage.
 * This will be used for non-sensitive data that isn't consequential.
 */
class MobilePreferences {
  static storeData = async (key: string, value: string) => {
    try {
      return await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  static getData = async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn(e);
      return null;
    }
  };
}

export default MobilePreferences;
