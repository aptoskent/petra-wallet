// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';

interface PetraPopoverProps {
  children: React.ReactElement;
  hidePopover: () => void;
  isVisible: boolean;
  left?: string | number;
  top?: string | number;
}

export default function PetraPopover({
  children,
  hidePopover,
  isVisible,
  left,
  top,
}: PetraPopoverProps): JSX.Element | null {
  if (!isVisible || !left || !top) return null;

  return (
    <Pressable onPress={hidePopover} style={styles.pressable}>
      <View style={[styles.popover, { left, top }]}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  popover: {
    backgroundColor: customColors.white,
    borderRadius: 8,
    position: 'absolute',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
  },
  pressable: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
