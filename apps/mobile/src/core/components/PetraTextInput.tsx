// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { testProps } from 'e2e/config/testProps';
import React, { RefObject, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

const defaultBackgroundColor = {
  dark: customColors.navy['800'],
  light: customColors.white,
};

const defaultBorderColor = {
  dark: customColors.navy['800'],
  light: customColors.navy['100'],
};

const defaultColor = {
  dark: customColors.navy['200'],
  light: customColors.navy['900'],
};

export interface PetraTextInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  focusedBorderColor?: string;
  inputRef?: RefObject<TextInput>;
  inputTheme?: 'light' | 'dark';
  nextInputRef?: RefObject<TextInput>;
  rightIcon?: JSX.Element;
  testId?: string;
}

export default function PetraTextInput({
  containerStyle,
  focusedBorderColor,
  inputRef,
  inputTheme = 'light',
  nextInputRef,
  onBlur,
  onFocus,
  onSubmitEditing,
  placeholderTextColor = customColors.navy['500'],
  rightIcon,
  style,
  testId,
  ...textInputProps
}: PetraTextInputProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Combine and flatten styles, so we can extract the final color
  // to be used as default for `focusedBorderColor`
  const flattenedStyle = StyleSheet.flatten<TextStyle>([
    styles.input,
    rightIcon && styles.inputWithRightIcon,
    {
      backgroundColor: defaultBackgroundColor[inputTheme],
      borderColor: defaultBorderColor[inputTheme],
      color: defaultColor[inputTheme],
    },
    style,
  ]);
  const { color } = flattenedStyle;

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        ref={inputRef}
        style={[
          flattenedStyle,
          isFocused ? { borderColor: focusedBorderColor ?? color } : undefined,
        ]}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onSubmitEditing={(e) => {
          if (nextInputRef) {
            nextInputRef.current?.focus();
          }
          onSubmitEditing?.(e);
        }}
        blurOnSubmit={nextInputRef ? false : undefined}
        placeholderTextColor={placeholderTextColor}
        {...textInputProps}
        {...testProps(`input-${testId}`)}
      />
      {rightIcon !== undefined ? (
        <View style={styles.rightIcon}>{rightIcon}</View>
      ) : null}
    </View>
  );
}

const inputHeight = 48;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    borderColor: customColors.navy['100'],
    borderRadius: Math.round(inputHeight / 2),
    borderWidth: 1,
    flex: 1,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    height: inputHeight,
    paddingHorizontal: 16,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
  },
});
