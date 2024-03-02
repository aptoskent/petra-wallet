// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path, Defs, ClipPath, Rect, G } from 'react-native-svg';
import makeIcon from 'shared/assets/svgs/makeIcon';

export default makeIcon('AlertTriangle', ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G clipPath="url(#clip0_4548_35814)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.1247 20.75L12.0003 2L-0.124023 20.75H24.1247ZM13.0003 9V8H11.0003V9V13V14H13.0003V13V9ZM12.0003 16H11.0003V18H12.0003H12.0103H13.0103V16H12.0103H12.0003Z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_4548_35814">
        <Rect width="24" height="24" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
));
