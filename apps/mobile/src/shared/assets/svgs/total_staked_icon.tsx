// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Circle, G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
import makeIcon from './makeIcon';

export default makeIcon('TotalStakedIcon', ({ color }: { color: string }) => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill={color} />
    <G clipPath="url(#clip0_7063_209436)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 29.3426H32V31.2284H16V29.3426ZM16 33.1142H32V35H16V33.1142ZM31 24.753L24 28.7131L17 24.753V16.9602L24 13L31 16.9602V24.753ZM24 26.5139L29 23.6853V18.0279L24 15.1992L19 18.0279V23.6853L24 26.5139Z"
        fill="white"
      />
      <Path
        d="M22 20.971L24.1213 18.9708L26.2426 20.971L24.1213 22.9712L22 20.971Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_7063_209436">
        <Rect
          width="24"
          height="24"
          fill="white"
          transform="translate(12 12)"
        />
      </ClipPath>
    </Defs>
  </Svg>
));
