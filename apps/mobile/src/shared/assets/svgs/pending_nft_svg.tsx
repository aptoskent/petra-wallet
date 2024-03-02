// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Rect, Circle } from 'react-native-svg';

export default function PendingNftsSVG() {
  return (
    <Svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <Rect width="44" height="44" rx="4" fill="#1C2B43" />
      <Circle cx="21.5" cy="22" r="11.5" stroke="white" strokeWidth="2" />
    </Svg>
  );
}
