// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import makeIcon from './makeIcon';

export default makeIcon('InfoCircleIcon', ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <Path
      d="M11 22C17.0775 22 22 17.0775 22 11C22 4.9225 17.0775 0 11 0C4.9225 0 0 4.9225 0 11C0 17.0775 4.9225 22 11 22ZM9.625 4.8125H12.375V7.5625H9.625V4.8125ZM9.625 9.625H12.375V17.1875H9.625V9.625Z"
      fill={color}
    />
  </Svg>
));
