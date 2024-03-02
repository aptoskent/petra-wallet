// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import makeIcon from 'shared/assets/svgs/makeIcon';

export default makeIcon('AlertTriangleFill', ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G clipPath="url(#clip0_716_4806)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.1243 20.75L12 2L-0.12439 20.75H24.1243ZM13 9V8H11V9V13V14H13V13V9ZM12 16H11V18H12H12.01H13.01V16H12.01H12Z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_716_4806">
        <Rect width="24" height="24" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
));
