// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import makeIcon from './makeIcon';

export default makeIcon('InfoCircleEmptyIcon', ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G id="info">
      <Path
        id="Vector"
        d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
      />
    </G>
  </Svg>
));
