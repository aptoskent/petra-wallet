// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { BlurView } from '@react-native-community/blur';
import Typography from 'core/components/Typography';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { TOP_Z_INDEX } from 'shared/constants';
import { i18nmock } from 'strings';

export default function BlurOverlay() {
  return (
    <BlurView blurType="xlight" blurAmount={1} style={styles.blurOverlay}>
      <View style={styles.blurInnerContainer}>
        <ActivityIndicator size="large" style={{ marginBottom: 24 }} />
        <Typography weight="600">{i18nmock('general:oneMoment')}</Typography>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurInnerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  blurOverlay: {
    alignItems: 'center',
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: TOP_Z_INDEX,
  },
});
