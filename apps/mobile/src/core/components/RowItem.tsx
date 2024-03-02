// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Typography from 'core/components/Typography';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const iconDimensions = 48;

interface RowItemProps {
  icon?: JSX.Element;
  onPress: () => void;
  subtext?: string;
  text: string;
}

export default function RowItem({
  icon,
  onPress,
  subtext,
  text,
}: RowItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon}
      <View style={styles.textContainer}>
        <Typography color="navy.900" weight="600">
          {text}
        </Typography>
        {subtext !== undefined ? (
          <Typography color="navy.500">{subtext}</Typography>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    padding: 16,
  },
  image: {
    height: iconDimensions,
    width: iconDimensions,
  },
  textContainer: {
    marginLeft: 12,
  },
});
