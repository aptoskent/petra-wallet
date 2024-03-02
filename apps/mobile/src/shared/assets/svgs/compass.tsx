// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { ClipPath, Defs, Path, G, Rect } from 'react-native-svg';

export default function CompassSVG() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_3696_3626)">
        <Path
          d="M16.24 7.76001L14.12 14.12L7.76001 16.24L9.88001 9.88001L16.24 7.76001Z"
          stroke="#4D5C6D"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M22 17.4286L12 22.9048L2 17.4286V6.47619L12 1L22 6.47619V17.4286Z"
          stroke="#4D5C6D"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3696_3626">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
