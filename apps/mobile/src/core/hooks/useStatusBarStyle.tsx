// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'react-native';

/*
https://reactnative.dev/docs/statusbar#statusbarstyle
'default': Default status bar style (dark for iOS, light for Android)
'light-content': Dark background, white texts and icons
'dark-content': Light background, dark texts and icons
*/
type BarStyle = 'default' | 'light-content' | 'dark-content';

export const useStatusBarStyle = (
  barStyle?: BarStyle,
  isModalVisible?: Boolean,
) => {
  useFocusEffect(
    useCallback(() => {
      // only set status bar style when modal is visible
      if (barStyle && isModalVisible) {
        StatusBar.setBarStyle(barStyle);
      }
    }, [barStyle, isModalVisible]),
  );
};

export default useStatusBarStyle;
