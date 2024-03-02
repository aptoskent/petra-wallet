// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Circle } from 'react-native-svg';

export default function DotIconSVG({ color }: { color: string }) {
  return (
    <Svg width="8" height="9" viewBox="0 0 8 9" fill="none">
      <Circle cx="4" cy="4.5" r="4" fill={color} />
    </Svg>
  );
}
