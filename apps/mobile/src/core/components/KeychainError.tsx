// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { i18nmock } from 'strings';
import { customColors } from '@petra/core/colors';
import { StyleSheet, View } from 'react-native';
import { PADDING } from 'shared/constants';
import Typography from './Typography';

interface KeychainErrorProps {
  isLoading: boolean;
  onRetry: () => void;
}

export default function KeychainError({
  isLoading,
  onRetry,
}: KeychainErrorProps) {
  return (
    <View style={styles.container}>
      <Typography variant="display" weight="700" color={customColors.white}>
        {i18nmock('onboarding:biometrics.error')}
      </Typography>
      <Typography
        variant="body"
        color={customColors.white}
        align="center"
        marginTop={8}
      >
        {i18nmock('onboarding:biometrics.errorDescription')}
      </Typography>
      <PetraPillButton
        isLoading={isLoading}
        text={i18nmock('onboarding:biometrics.retry')}
        onPress={onRetry}
        buttonDesign={PillButtonDesign.clearWithWhiteText}
        buttonStyleOverride={{
          marginTop: 32,
          paddingHorizontal: PADDING.container,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: customColors.navy['900'],
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
});
