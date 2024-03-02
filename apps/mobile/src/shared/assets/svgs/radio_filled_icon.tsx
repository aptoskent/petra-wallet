// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React from 'react';
import Svg, { G, Circle } from 'react-native-svg';

export default function RadioFilledIcon({
  color = customColors.navy[200],
}: {
  color?: string;
}) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <G id="Radiobutton">
        <Circle
          id="Ellipse 17"
          cx="10"
          cy="10"
          r="9"
          stroke={color}
          strokeWidth="2"
        />
        <Circle id="Ellipse" cx="10" cy="10" r="5" fill="#FF5F5F" />
      </G>
    </Svg>
  );
}
