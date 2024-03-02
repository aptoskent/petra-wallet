// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useHeaderHeight } from '@react-navigation/elements';
import React from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from 'react-native';
import { useIsNetworkBannerVisible } from 'navigation/NetworkBannerWrapper';
import { BANNER_HEIGHT } from './NetworkBanner';

// On Android, setting the `windowSoftInputMode` field to `adjustResize` in the manifest
// ensures the keyboard works as expected without any additional work.
// On iOS, we have to manually add some padding to match the behavior.
const platformDefaultBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

/**
 * On iOS the keyboard is shown on top of the view stack, potentially hiding what's below.
 * This wrapper view ensures that the view is resized to account for the keyboard, which is almost
 * always the behavior we want.
 * This component extends the built-in KeyboardAvoidingView with proper defaults.
 */
export default function PetraKeyboardAvoidingView({
  behavior = platformDefaultBehavior,
  keyboardVerticalOffset,
  style,
  ...other
}: KeyboardAvoidingViewProps) {
  // On iOS, the navigation header will offset the keyboard Y position
  // and mess up the height calculation. By adding it as a vertical offset,
  // the keyboard will be positioned correctly.
  const headerHeight = useHeaderHeight();

  const isNetworkBannerVisible = useIsNetworkBannerVisible();
  const padding = (isNetworkBannerVisible ? BANNER_HEIGHT : 0) + headerHeight;

  return (
    <KeyboardAvoidingView
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset ?? padding}
      style={[{ flexGrow: 1 }, style]}
      {...other}
    />
  );
}
