// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { HIT_SLOPS } from 'shared';
import { i18nmock } from 'strings';
import Typography from './Typography';

interface PetraSkipButtonProps {
  onPress?: () => void;
}

function PetraSkipButton({ onPress }: PetraSkipButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={HIT_SLOPS.smallSlop}
      style={styles.container}
    >
      <Typography style={styles.text}>{i18nmock('general:skip')}</Typography>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
    padding: 4,
  },
  text: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
  },
});

export default PetraSkipButton;
