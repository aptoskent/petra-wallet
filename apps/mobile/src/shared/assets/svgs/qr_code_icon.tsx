// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function QRCodeIconSVG({
  color = customColors.black,
}: {
  color?: string;
}) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
        fill={color}
      />
      <Path d="M18 17V20.5H21.5V17H18Z" fill={color} />
      <Path d="M3 3V6.5H6.5V3H3Z" fill={color} />
      <Path d="M21.5 5.5H19V3C20.3819 3 21.5 4.11806 21.5 5.5Z" fill={color} />
      <Path d="M10 3V5.5H19V3H10Z" fill={color} />
      <Path d="M19 5V12H21.5V5H19Z" fill={color} />
      <Path d="M5.5 18.1667V15.1667H3V18.1667H5.5Z" fill={color} />
      <Path
        d="M3 18.1667H5.5V20.6667C4.11806 20.6667 3 19.5486 3 18.1667Z"
        fill={color}
      />
      <Path d="M3 11V15.1667H5.5V11H3Z" fill={color} />
      <Path d="M5 18.1667V20.6667H15V18.1667H5Z" fill={color} />
    </Svg>
  );
}
