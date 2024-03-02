// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import Typography from 'core/components/Typography';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import InfoIcon from 'shared/assets/svgs/info_icon';
import AlertOctagonFillIcon from 'shared/assets/svgs/alert_octagon_fill_icon';
import AlertTriangleFillIcon from 'shared/assets/svgs/alert_triangle_fill_icon';

type InfoCardType = 'info' | 'warning' | 'error';

const backgroundColorMap = {
  error: customColors.red['100'],
  info: customColors.navy['50'],
  warning: customColors.orange['100'],
};

const iconMap = {
  error: <AlertOctagonFillIcon color="red.500" size={24} />,
  info: <InfoIcon color="navy.900" size={20} />,
  warning: <AlertTriangleFillIcon color="orange.600" size={24} />,
};

interface InfoCardProps {
  content: string;
  style?: ViewStyle;
  title: string;
  type?: InfoCardType;
}

export default function InfoCard({
  content,
  style,
  title,
  type = 'info',
}: InfoCardProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColorMap[type] },
        style,
      ]}
    >
      <View style={styles.titleContainer}>
        {iconMap[type]}
        <Typography weight="600" style={{ marginLeft: 8 }}>
          {title}
        </Typography>
      </View>
      <Typography variant="small">{content}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 2,
  },
});
