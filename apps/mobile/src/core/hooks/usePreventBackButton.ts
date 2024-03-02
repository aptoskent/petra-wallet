// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

/**
 * Prevent back button for the current navigation screen.
 * Note that this won't prevent back gestures, which will have to be disabled separately.
 */
export default function usePreventBackButton() {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );
}
