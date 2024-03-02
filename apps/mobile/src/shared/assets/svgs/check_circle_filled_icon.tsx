// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import makeIcon from './makeIcon';

export default makeIcon('CheckCircleFilled', ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 22 22" fill={color}>
    <Path d="M11 0C4.9225 0 0 4.9225 0 11C0 17.0775 4.9225 22 11 22C17.0775 22 22 17.0775 22 11C22 4.9225 17.0775 0 11 0ZM9.24917 15.8583L5.13333 11.7425L6.42583 10.45L9.24917 13.2733L15.73 6.7925L17.0225 8.085L9.24917 15.8583Z" />
  </Svg>
));
