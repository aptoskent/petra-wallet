// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

export default function EyeOffIcon16SVG({ color }: { color: string }) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <G clipPath="url(#clip0_2079_146722)">
        <Path
          d="M11.9598 11.9599C10.8202 12.8285 9.43258 13.3098 7.99984 13.3332C3.33317 13.3332 0.666504 7.99985 0.666504 7.99985C1.49576 6.45445 2.64593 5.10426 4.03984 4.03985M6.59984 2.82652C7.05873 2.71911 7.52855 2.66541 7.99984 2.66652C12.6665 2.66652 15.3332 7.99985 15.3332 7.99985C14.9285 8.75693 14.4459 9.46968 13.8932 10.1265M9.41317 9.41319C9.23007 9.60969 9.00927 9.76729 8.76394 9.8766C8.51861 9.98591 8.25377 10.0447 7.98523 10.0494C7.71669 10.0542 7.44995 10.0048 7.20091 9.90418C6.95188 9.80359 6.72565 9.65387 6.53573 9.46396C6.34582 9.27404 6.1961 9.04782 6.09551 8.79878C5.99492 8.54975 5.94552 8.283 5.95026 8.01446C5.955 7.74592 6.01378 7.48108 6.12309 7.23575C6.2324 6.99042 6.39001 6.76962 6.5865 6.58652"
          stroke={color}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M0.666504 0.666504L15.3332 15.3332"
          stroke={color}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2079_146722">
          <Rect width="16" height="16" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
