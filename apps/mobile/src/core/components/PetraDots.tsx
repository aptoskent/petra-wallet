// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

interface DotProps {
  active: boolean;
  size: number;
}

function Dot({ active, size }: DotProps) {
  const halfSize = Math.floor(size / 2);
  return (
    <View
      style={{
        backgroundColor: active ? customColors.white : customColors.navy['400'],
        borderRadius: halfSize,
        height: size,
        marginHorizontal: halfSize,
        width: size,
      }}
    />
  );
}
interface PetraProgressBarProps {
  activeIndex: number;
  length: number;
  size?: number;
}

export default function PetraDots({
  activeIndex,
  length,
  size = 8,
}: PetraProgressBarProps) {
  const dots = useMemo(() => [...Array(length).keys()], [length]);

  return (
    <View style={[styles.stepContainer]}>
      {dots.map((v: number, index: number) => (
        <Dot active={index === activeIndex} key={v} size={size} />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  stepContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
