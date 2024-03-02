// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Typography from 'core/components/Typography';
import InfoIcon from 'shared/assets/svgs/info_icon';

export interface InfoCardProps {
  children: ReactNode;
}

export default function InfoCard({ children }: InfoCardProps) {
  return (
    <View style={styles.container}>
      <InfoIcon size={22} color="navy.900" />
      <Typography
        variant="small"
        color="navy.900"
        style={{
          marginLeft: 10,
          marginRight: 32,
        }}
      >
        {children}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: customColors.navy[50],
    borderRadius: 8,
    flexDirection: 'row',
    marginTop: 24,
    padding: 16,
  },
  text: {
    fontWeight: '400',
    marginLeft: 10,
    marginRight: 32,
  },
});
