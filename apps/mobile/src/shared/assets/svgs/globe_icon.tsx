// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { customColors } from '@petra/core/colors';
import makeIcon from './makeIcon';

export default makeIcon(
  'GlobeIcon',
  ({ color = customColors.navy['400'], size = 16 }) => (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <G clipPath="url(#clip0_5162_68184)">
        <Path
          d="M8.00016 14.6666C11.6821 14.6666 14.6668 11.6819 14.6668 7.99998C14.6668 4.31808 11.6821 1.33331 8.00016 1.33331C4.31826 1.33331 1.3335 4.31808 1.3335 7.99998C1.3335 11.6819 4.31826 14.6666 8.00016 14.6666Z"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M1.3335 8H14.6668"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.00016 1.33331C9.66768 3.15888 10.6153 5.528 10.6668 7.99998C10.6153 10.472 9.66768 12.8411 8.00016 14.6666C6.33264 12.8411 5.38499 10.472 5.3335 7.99998C5.38499 5.528 6.33264 3.15888 8.00016 1.33331V1.33331Z"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  ),
);
