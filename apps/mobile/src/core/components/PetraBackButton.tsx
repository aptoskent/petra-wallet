// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { HIT_SLOPS } from 'shared';
import { ChevronLeftIconSVG } from 'shared/assets/svgs';
import { customColors } from '@petra/core/colors';
import { testProps } from 'e2e/config/testProps';

export interface PetraBackButtonProps {
  color?: string;
  navigation: any;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

function PetraBackButton({
  navigation,
  onPress,
  color = customColors.navy['700'],
  style,
}: PetraBackButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => (onPress ? onPress() : navigation.goBack())}
      hitSlop={HIT_SLOPS.smallSlop}
      style={[style, { marginLeft: 16 }]}
      {...testProps('button-back')}
    >
      <ChevronLeftIconSVG color={color} />
    </TouchableOpacity>
  );
}

export default PetraBackButton;
