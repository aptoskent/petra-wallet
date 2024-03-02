// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Typography from 'core/components/Typography';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { emptyStateIcon } from 'shared/assets/images';

interface EmptyStateProps {
  subtext: string;
  text: string;
}

export default function EmptyState({ subtext, text }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image source={emptyStateIcon} style={styles.image} />
      <Typography
        variant="heading"
        color="navy.900"
        weight="700"
        style={styles.text}
      >
        {text}
      </Typography>
      <Typography color="navy.500" style={styles.subtext}>
        {subtext}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  image: {
    height: 130,
    width: 140,
  },
  subtext: {
    marginBottom: 24,
    marginTop: 4,
    textAlign: 'center',
  },
  text: {
    marginTop: 24,
    textAlign: 'center',
  },
});
