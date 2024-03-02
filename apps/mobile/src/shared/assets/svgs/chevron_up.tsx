// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import makeIcon from './makeIcon';

export default makeIcon('ChevronUpIcon', ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 15L12 9L6 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="square"
    />
  </Svg>
));
