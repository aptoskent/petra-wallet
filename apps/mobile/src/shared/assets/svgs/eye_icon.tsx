// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function EyeIcon16SVG({ color }: { color: string }) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M0.666504 7.99984C0.666504 7.99984 3.33317 2.6665 7.99984 2.6665C12.6665 2.6665 15.3332 7.99984 15.3332 7.99984C15.3332 7.99984 12.6665 13.3332 7.99984 13.3332C3.33317 13.3332 0.666504 7.99984 0.666504 7.99984Z"
        stroke={color}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
        stroke={color}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
