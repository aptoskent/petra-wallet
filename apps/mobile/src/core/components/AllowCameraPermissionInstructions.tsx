// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { i18nmock } from 'strings';
import Typography from 'core/components/Typography';
import { HEADER_HEIGHT, PADDING } from 'shared/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import PetraPillButton from './PetraPillButton';

export default function AllowCameraPermissionInstructions() {
  return (
    <SafeAreaView>
      <View style={[styles.containerOuter, styles.padding]}>
        <View style={styles.container}>
          <Typography variant="heading" style={styles.verticalPadding}>
            {i18nmock('settings:cameraInstructions.title')}
          </Typography>
          <Typography variant="bodyLarge" style={styles.verticalPadding}>
            {i18nmock('settings:cameraInstructions.subTitle')}
          </Typography>
          <Typography style={styles.verticalPadding}>
            {i18nmock('settings:cameraInstructions.direct1')}
            <Typography variant="bodyLarge">
              {i18nmock('settings:cameraInstructions.step1')}
            </Typography>
            {i18nmock('settings:cameraInstructions.button')}
          </Typography>
          <Typography style={styles.verticalPadding}>
            {i18nmock('settings:cameraInstructions.direct2')}
            <Typography variant="bodyLarge">
              {i18nmock('settings:cameraInstructions.step2')}
            </Typography>
          </Typography>
          <Typography style={styles.verticalPadding}>
            {i18nmock('settings:cameraInstructions.direct3')}
            <Typography variant="bodyLarge">
              {i18nmock('settings:cameraInstructions.step3')}
            </Typography>
          </Typography>
          <Typography style={styles.verticalPadding}>
            {i18nmock('settings:cameraInstructions.direct4')}
            <Typography variant="bodyLarge">
              {i18nmock('settings:cameraInstructions.step4')}
            </Typography>
          </Typography>
          <Typography style={styles.verticalPadding}>
            {i18nmock('settings:cameraInstructions.step5')}
          </Typography>
        </View>
        <PetraPillButton
          text={i18nmock('settings:cameraInstructions.step1')}
          onPress={Linking.openSettings}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerOuter: { height: '100%', paddingTop: HEADER_HEIGHT },
  padding: {
    padding: PADDING.container,
  },
  verticalPadding: {
    marginVertical: PADDING.topography,
  },
});
