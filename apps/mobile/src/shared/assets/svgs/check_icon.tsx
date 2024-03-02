// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function CheckIconSVG({ color }: { color: string }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM15.6961 7.7179C16.0926 7.33343 16.1024 6.70034 15.7179 6.30385C15.3334 5.90737 14.7003 5.89763 14.3039 6.2821L8.8125 11.607L6.69615 9.55483C6.29966 9.17036 5.66657 9.1801 5.2821 9.57658C4.89763 9.97307 4.90737 10.6062 5.30385 10.9906L8.11635 13.7179C8.50424 14.094 9.12076 14.094 9.50865 13.7179L15.6961 7.7179Z"
        fill={color}
      />
    </Svg>
  );
}
