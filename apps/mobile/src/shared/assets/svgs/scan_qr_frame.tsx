// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function ScanQRCodeFrameSVG() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 310 310" fill="none">
      <Path
        d="M55 0H32C14.3269 0 0 14.3269 0 32V55H16V32C16 23.1634 23.1634 16 32 16H55V0Z"
        fill="white"
      />
      <Path
        d="M255 16V0H278C295.673 0 310 14.3269 310 32V55H294V32C294 23.1634 286.837 16 278 16H255Z"
        fill="white"
      />
      <Path
        d="M255 294H278C286.837 294 294 286.837 294 278V255H310V278C310 295.673 295.673 310 278 310H255V294Z"
        fill="white"
      />
      <Path
        d="M0 255V278C0 295.673 14.3269 310 32 310H55V294H32C23.1634 294 16 286.837 16 278V255H0Z"
        fill="#FF5F5F"
      />
    </Svg>
  );
}
