// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Keyboard } from 'react-native';

export enum KeyboardState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
}

export default function useKeyboard() {
  const [keyboardStatus, setKeyboardStatus] = useState<
    KeyboardState | undefined
  >(KeyboardState.CLOSED);
  const [openKeyboardHeight, setOpenKeyboardHeight] = useState<number>(0);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setOpenKeyboardHeight(e.endCoordinates.height);
      setKeyboardStatus(KeyboardState.OPEN);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(KeyboardState.CLOSED);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {
    keyboardStatus,
    openKeyboardHeight,
  };
}
