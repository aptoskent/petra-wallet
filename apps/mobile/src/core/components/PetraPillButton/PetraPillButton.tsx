// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import useButtonStateAnimatedStyle from 'core/components/PetraPillButton/useButtonAnimatedStyle';
import usePressState from 'core/components/PetraPillButton/usePressState';
import { testProps } from 'e2e/config/testProps';
import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { PillButtonDesign } from './variants';

export interface PillButtonProps {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  buttonDesign?: PillButtonDesign;
  buttonStyleOverride?: ViewStyle;
  buttonTextStyleOverride?: TextStyle;
  containerStyleOverride?: ViewStyle;
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: () => JSX.Element;
  onPress:
    | (() => void)
    | ((e: GestureResponderEvent) => void)
    | (() => Promise<void>);
  rightIcon?: () => JSX.Element;
  testId?: string;
  text?: string;
}

export default function PetraPillButton({
  accessibilityHint,
  accessibilityLabel,
  buttonDesign = PillButtonDesign.default,
  buttonStyleOverride,
  buttonTextStyleOverride,
  containerStyleOverride,
  disabled = false,
  isLoading,
  leftIcon: LeftIcon,
  onPress,
  rightIcon: RightIcon,
  testId,
  text,
}: PillButtonProps) {
  // Note: `isPressed` is a shared value as its only purpose is for styling
  // and doesn't require a rerender on change.
  const { isPressed, ...pressStateHandlers } = usePressState();
  const { buttonAnimatedStyle, spinnerColor, textAnimatedStyle } =
    useButtonStateAnimatedStyle({
      disabled,
      isPressed,
      variant: buttonDesign,
    });

  return (
    <View style={[containerStyleOverride]}>
      <Pressable
        onPress={onPress}
        {...pressStateHandlers}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        {...testProps(`button-${testId || text}`, false)}
      >
        <Animated.View
          style={[styles.button, buttonStyleOverride, buttonAnimatedStyle]}
        >
          {isLoading ? (
            <ActivityIndicator color={spinnerColor} />
          ) : (
            <View style={styles.buttonContent}>
              {LeftIcon ? (
                <View style={styles.iconContainer}>
                  <LeftIcon />
                </View>
              ) : null}
              {text ? (
                <Animated.Text
                  style={[
                    styles.buttonText,
                    textAnimatedStyle,
                    buttonTextStyleOverride,
                  ]}
                >
                  {text}
                </Animated.Text>
              ) : null}
              {RightIcon ? (
                <View style={styles.iconContainer}>
                  <RightIcon />
                </View>
              ) : null}
            </View>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const buttonHeightDefault = 48;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: buttonHeightDefault / 2,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: buttonHeightDefault,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
