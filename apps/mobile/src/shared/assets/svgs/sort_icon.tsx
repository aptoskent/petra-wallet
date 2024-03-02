// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export default function SortIcon({
  color = customColors.navy[600],
}: {
  color?: string;
}) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <G id="Sort/16">
        <Path
          id="Vector"
          d="M14 11.25L11.2308 14L8.46154 11.25M11.2308 3V12.1667M2 3H5.69231V6.66667H2V3ZM3.84615 14C2.82655 14 2 13.1792 2 12.1667C2 11.1541 2.82655 10.3333 3.84615 10.3333C4.86576 10.3333 5.69231 11.1541 5.69231 12.1667C5.69231 13.1792 4.86576 14 3.84615 14Z"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="square"
        />
      </G>
    </Svg>
  );
}
