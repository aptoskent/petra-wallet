// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import Typography from 'core/components/Typography';
import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface InstructionListItemProps extends React.PropsWithChildren {
  description: string;
  icon: () => JSX.Element;
  style?: ViewStyle;
  title: string;
}

export default function InstructionListItem({
  description,
  icon: Icon,
  style,
  title,
}: InstructionListItemProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.image}>{Icon && <Icon />}</View>
      <View style={styles.innerContainer}>
        <Typography variant="bodyLarge">{title}</Typography>
        <Typography variant="body" color={customColors.navy['600']}>
          {description}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  image: {
    height: 50,
    marginHorizontal: 12,
    width: 50,
  },
  innerContainer: {
    flex: 1,
  },
});
