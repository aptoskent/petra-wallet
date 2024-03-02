// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function PlusIconSVG({
  color,
  encircled = true,
}: {
  color: string;
  encircled?: boolean;
}) {
  if (!encircled) {
    return (
      <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <Path
          d="M7.5 2V14M1.5 8H13.5"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="square"
        />
      </Svg>
    );
  }
  return (
    <Svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <Path
        d="M22 43C33.598 43 43 33.598 43 22C43 10.402 33.598 1 22 1C10.402 1 1 10.402 1 22C1 33.598 10.402 43 22 43Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 13.6006V30.4006"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.5999 22H30.3999"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
