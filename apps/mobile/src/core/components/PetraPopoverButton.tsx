// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface PetraPopoverButtonProps {
  icon: () => React.ReactElement;
  label: string;
  onPress: () => void;
}

export default function PetraPopoverButton({
  icon,
  label,
  onPress,
}: PetraPopoverButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.popoverListItem}>
        <View style={styles.icon}>{icon()}</View>
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 12,
  },
  popoverListItem: {
    flexDirection: 'row',
    padding: 10,
  },
  text: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
  },
});
