// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface SuccessCircleSVGProps {
  color: string;
}

export default function SuccessCircleSVG({ color }: SuccessCircleSVGProps) {
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="11" r="11" fill="none" />
      <Path
        d="M11 0C4.9225 0 0 4.9225 0 11C0 17.0775 4.9225 22 11 22C17.0775 22 22 17.0775 22 11C22 4.9225 17.0775 0 11 0ZM9.17125 16.0187L4.9775 11.825L6.435 10.3675L9.17125 13.1037L15.5787 6.69625L17.0363 8.15375L9.17125 16.0187Z"
        fill={color}
      />
    </Svg>
  );
}
