// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useSharedValue } from 'react-native-reanimated';

/**
 * A small pluggable hook for `Pressable` to keep track of the press state for animation purposes.
 */
export default function usePressState() {
  const isPressed = useSharedValue(false);
  const onPressIn = () => {
    isPressed.value = true;
  };
  const onPressOut = () => {
    isPressed.value = false;
  };
  return { isPressed, onPressIn, onPressOut };
}
