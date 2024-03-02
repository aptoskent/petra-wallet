// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';

export default function NFTIconSVG() {
  return (
    <Svg width="45" height="44" viewBox="0 0 45 44" fill="none">
      <Rect
        x="0.5"
        width="44"
        height="44"
        rx="4"
        fill="url(#paint0_angular_1864_141296)"
      />
      <Defs>
        <RadialGradient
          id="paint0_angular_1864_141296"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(22.5 22) rotate(90) scale(22)"
        >
          <Stop stopColor="#FF6262" />
          <Stop offset="1" stopColor="#2E1DE9" />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}
