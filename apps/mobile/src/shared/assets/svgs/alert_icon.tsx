// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import makeIcon from './makeIcon';

export default makeIcon('AlertIcon', ({ color, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M7.66667 10.6667V7.99999M7.66667 5.33333H7.66M1 7.99999C1 4.3181 3.98477 1.33333 7.66667 1.33333C11.3486 1.33333 14.3333 4.3181 14.3333 7.99999C14.3333 11.6819 11.3486 14.6667 7.66667 14.6667C3.98477 14.6667 1 11.6819 1 7.99999Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));
