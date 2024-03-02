// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import makeIcon from 'shared/assets/svgs/makeIcon';
import Svg, { Circle, G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

export default makeIcon('SwapIconSVG', ({ color }) => (
  <Svg width="64" height="40" viewBox="0 0 64 40" fill="none">
    <Circle cx="28" cy="20" r="20" />
    <G clipPath="url(#clip0_7075_19085)">
      <Path
        d="M18.8333 15.8333L22.1666 12.4999L25.4999 15.8333"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M27.1667 27.5H25.5001C24.616 27.5 23.7682 27.1488 23.1431 26.5237C22.5179 25.8986 22.1667 25.0507 22.1667 24.1667V12.5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M37.1667 24.1667L33.8333 27.5L30.5 24.1667"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M28.8333 12.5H30.4999C31.384 12.5 32.2318 12.8512 32.8569 13.4763C33.4821 14.1014 33.8333 14.9493 33.8333 15.8333V27.5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_7075_19085">
        <Rect
          width="20"
          height="20"
          fill="white"
          transform="matrix(0 -1 1 0 18 30)"
        />
      </ClipPath>
    </Defs>
  </Svg>
));
