// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

interface PetraProgressBarProps {
  active: number;
  length: number;
}

// the progress bar took about 50% of the width of the screen
const WIDTH = Math.floor(Dimensions.get('window').width * 0.5);
const stepHeight = 4;

export default function PetraProgressBar({
  active,
  length,
}: PetraProgressBarProps) {
  const bars = useMemo(() => [...Array(length).keys()], [length]);

  return (
    <View style={styles.stepContainer}>
      {bars.map((v: number, index: number) => (
        <View
          key={v}
          style={[
            styles.step,
            {
              backgroundColor:
                index + 1 <= active
                  ? customColors.navy['900']
                  : customColors.navy['400'],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    borderRadius: Math.floor(stepHeight / 2),
    flex: 1,
    height: stepHeight,
    marginHorizontal: 4,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    width: WIDTH,
  },
});
