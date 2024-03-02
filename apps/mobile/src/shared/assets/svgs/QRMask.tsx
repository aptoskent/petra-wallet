// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Mask, Defs, Rect } from 'react-native-svg';
import { customColors } from '@petra/core/colors';

export default function QRMask() {
  return (
    <Svg height="100%" width="100%" viewBox="0 0 100 100">
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Rect
            x="25%"
            y="25%"
            rx={5}
            width="50px"
            height="50px"
            fill="#ff0000"
          />
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill={customColors.blackOpacity.fiftyPercent}
        mask="url(#mask)"
        fill-opacity="0"
      />
    </Svg>
  );
}
