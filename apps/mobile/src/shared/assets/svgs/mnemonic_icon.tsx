// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export default function MnemonicIconSVG({ color }: { color: string }) {
  return (
    <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
      <Rect x="1" y="11.8442" width="6.54098" height="1.86885" fill={color} />
      <Path d="M1 4.04053L7.16221 7.89191" stroke={color} strokeWidth="2" />
      <Path d="M4.25635 2.5L4.29085 9.76668" stroke={color} strokeWidth="2" />
      <Path
        d="M7.16211 4.04053L0.999904 7.89191"
        stroke={color}
        strokeWidth="2"
      />
      <Rect
        x="8.47559"
        y="11.8442"
        width="6.54098"
        height="1.86885"
        fill={color}
      />
      <Path
        d="M8.70312 4.04053L14.8653 7.89191"
        stroke={color}
        strokeWidth="2"
      />
      <Path d="M11.9595 2.5L11.994 9.76668" stroke={color} strokeWidth="2" />
      <Path
        d="M14.8652 4.04053L8.70303 7.89191"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );
}
