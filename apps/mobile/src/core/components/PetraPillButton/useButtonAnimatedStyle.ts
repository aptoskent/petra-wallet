// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  PillButtonDesign,
  variantStylesMap,
} from 'core/components/PetraPillButton/variants';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface UseButtonStateStyleProps {
  disabled: boolean;
  isPressed: Animated.SharedValue<boolean>;
  variant: PillButtonDesign;
}

const defaultTransitionConfig = {
  duration: 150,
};

/**
 * Return animated styles and props for `PetraPillButton`
 * based on the variant and the current state.
 */
export default function useButtonStateAnimatedStyle({
  disabled,
  isPressed,
  variant,
}: UseButtonStateStyleProps) {
  const variantStyles = variantStylesMap[variant];

  const backgroundColor = useSharedValue(variantStyles.default.backgroundColor);
  const borderColor = useSharedValue(variantStyles.default.borderColor);
  const textColor = useSharedValue(variantStyles.default.textColor);

  useAnimatedReaction(
    () => {
      if (disabled && variantStyles.disabled) {
        return variantStyles.disabled;
      }
      if (isPressed.value && variantStyles.pressed) {
        return variantStyles.pressed;
      }
      return variantStyles.default;
    },
    (stateStyle) => {
      backgroundColor.value = withTiming(
        stateStyle.backgroundColor,
        defaultTransitionConfig,
      );
      borderColor.value = withTiming(
        stateStyle.borderColor,
        defaultTransitionConfig,
      );
      textColor.value = withTiming(
        stateStyle.textColor,
        defaultTransitionConfig,
      );
    },
    [disabled, variantStyles],
  );

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
    borderColor: borderColor.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  const spinnerColor =
    disabled && variantStyles.disabled
      ? variantStyles.disabled.textColor
      : variantStyles.default.textColor;

  return { buttonAnimatedStyle, spinnerColor, textAnimatedStyle };
}
