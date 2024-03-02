// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import makeIcon from 'shared/assets/svgs/makeIcon';

export default makeIcon('AlertOctagonFill', ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.14 2H7.86L2 7.86V16.14L7.86 22H16.14L22 16.14V7.86L16.14 2ZM13 8V7H11V8V12V13H13V12V8ZM12 15H11V17H12H12.01H13.01V15H12.01H12Z"
      fill={color}
    />
  </Svg>
));
