// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Circle, G, Path, Defs, ClipPath } from 'react-native-svg';
import makeIcon from './makeIcon';

export default makeIcon('TotalRewardsIcon', ({ color }: { color: string }) => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill={color} />
    <G clipPath="url(#clip0_7063_209448)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.8889 13L33.7778 18.5625V29.7322L23.8889 35.2947L14 29.7322V18.5625L23.8889 13ZM16 19.7322V28.5625L23.8889 33L31.7778 28.5625V19.7322L23.8889 15.2947L16 19.7322Z"
        fill="white"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 28.5625V19.7322L23.8889 15.2947L31.7778 19.7322V28.5625L23.8889 33L16 28.5625ZM29.3333 23.1473V25.1473H24.8889V29.5918H22.8889V25.1473H18.4445V23.1473H22.8889V18.7029H24.8889V23.1473H29.3333Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_7063_209448">
        <rect
          width="24"
          height="24"
          fill="white"
          transform="translate(12 12)"
        />
      </ClipPath>
    </Defs>
  </Svg>
));
