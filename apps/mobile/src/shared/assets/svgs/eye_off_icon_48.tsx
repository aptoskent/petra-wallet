// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

export default function EyeOffIcon48SVG({ color }: { color: string }) {
  return (
    <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <G clipPath="url(#clip0_2073_141684)">
        <Path
          d="M35.88 35.8801C32.4612 38.4861 28.2982 39.9298 24 40C10 40 2 24 2 24C4.48778 19.3638 7.93827 15.3133 12.12 12.1201M19.8 8.48005C21.1767 8.15781 22.5861 7.99673 24 8.00005C38 8.00005 46 24 46 24C44.786 26.2713 43.3381 28.4095 41.68 30.38M28.24 28.24C27.6907 28.8295 27.0283 29.3024 26.2923 29.6303C25.5563 29.9582 24.7618 30.1346 23.9562 30.1488C23.1506 30.163 22.3503 30.0148 21.6032 29.713C20.8561 29.4113 20.1774 28.9621 19.6077 28.3924C19.0379 27.8226 18.5888 27.1439 18.287 26.3968C17.9852 25.6497 17.8371 24.8495 17.8513 24.0439C17.8655 23.2382 18.0418 22.4437 18.3698 21.7077C18.6977 20.9718 19.1705 20.3093 19.76 19.7601"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M2 2L46 46"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2073_141684">
          <Rect width="48" height="48" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
