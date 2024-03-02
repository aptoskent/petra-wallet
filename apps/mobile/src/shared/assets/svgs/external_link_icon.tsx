// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import makeIcon, { IconProps } from './makeIcon';

interface ExternalLinkProps extends IconProps {
  strokeWidth?: string;
}

export default makeIcon<ExternalLinkProps>(
  'ExternalLinkIconSVG',
  ({ color, size = 24, strokeWidth = '3' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 6H3V16C3 18.7614 5.23858 21 8 21H18V12"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M15 3H21M21 3V9M21 3L10 14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    </Svg>
  ),
);
