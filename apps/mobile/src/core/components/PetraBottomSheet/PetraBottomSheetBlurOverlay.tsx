// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { BlurView } from '@react-native-community/blur';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { i18nmock } from 'strings';
import Typography from '../Typography';

export default function PetraBottomSheetBlurOverlay() {
  return (
    <BlurView
      style={styles.blurView}
      blurType="xlight"
      blurAmount={1}
      reducedTransparencyFallbackColor={customColors.red['100']}
    >
      <View style={styles.loadingView}>
        <ActivityIndicator size="large" />
        <Typography variant="body" weight="600" style={styles.loadingText}>
          {i18nmock('settings:directTransferToken.fullModal.oneMoment')}
        </Typography>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurView: {
    alignItems: 'center',
    borderRadius: 16,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 3,
  },
  loadingText: { marginTop: 20 },
  loadingView: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
