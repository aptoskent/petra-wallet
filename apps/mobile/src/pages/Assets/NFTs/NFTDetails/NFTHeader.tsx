// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import Typography from 'core/components/Typography';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

interface NFTHeaderProps {
  name: string;
}

export default function NFTHeader({ name }: NFTHeaderProps): JSX.Element {
  const [lines, setLines] = useState<number>(0);

  return (
    <View style={styles.headerContainer}>
      <Typography
        variant="display"
        weight="700"
        color={customColors.navy[900]}
        style={[lines < 3 ? styles.headerTextLarge : styles.headerText]}
        onTextLayout={(e) => {
          if (lines === 0) {
            setLines(e.nativeEvent.lines.length);
          }
        }}
      >
        {name}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    width: '100%',
  },
  defaultBackgroundColor: {
    backgroundColor: customColors.navy['100'],
  },
  headerContainer: {
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 24,
    lineHeight: 28,
  },
  headerTextLarge: {
    fontSize: 30,
    lineHeight: 36,
  },
  spacingTop: {
    marginTop: 16,
  },
});
