// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import Typography from 'core/components/Typography';
import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface InfoPillProps extends React.PropsWithChildren {
  style?: ViewStyle;
  title?: string;
  value?: string;
}

export default function InfoPill({
  children,
  style,
  title,
  value,
}: InfoPillProps) {
  return (
    <View style={[style, styles.container]}>
      {children ?? (
        <>
          <Typography variant="small" color={customColors.navy['600']}>
            {title?.toLocaleUpperCase()}
          </Typography>
          <Typography weight="500">{value}</Typography>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: customColors.navy['100'],
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
});
