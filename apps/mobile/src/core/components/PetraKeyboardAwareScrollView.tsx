// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// TODO: need to test this on an android device with bottom inset

/**
 * When a bottom insets is present, we want the scroll view to extend below it by default.
 * When the keyboard is shown, the keyboard height calculation ignores the bottom inset
 * causing the scroll view to extend below the keyboard.
 * This wrapper component ensures the bottom inset padding is applied only
 * when the keyboard is open.
 */
export default function PetraKeyboardAwareScrollView({
  contentContainerStyle,
  ...other
}: ScrollViewProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const [paddingBottom, setPaddingBottom] = useState<number>(
    safeAreaInsets.bottom,
  );

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setPaddingBottom(0);
      },
    );

    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setPaddingBottom(safeAreaInsets.bottom);
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [safeAreaInsets.bottom]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={[{ paddingBottom }, contentContainerStyle]}
      {...other}
    />
  );
}
