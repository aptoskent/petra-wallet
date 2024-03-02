// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function SettingsGearIcon({ color }: { color: string }) {
  return (
    <Svg width="24" height="22" viewBox="0 0 24 22" fill="none">
      <Path
        d="M13.2136 9L14.5455 10.3318V12.2136L13.2136 13.5455H11.3318L10 12.2136V10.3318L11.3318 9H13.2136Z"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M14.6747 6.35829V1H9.32394V6.35829M17.3662 11.0348L22 8.35568L19.3246 3.7154L14.6908 6.39454M9.31121 6.31774L4.67745 3.63861L2.00206 8.27889L6.63582 10.958M9.32394 15.6417V21H14.6747V15.6417M14.6902 15.6844L19.3239 18.3636L21.9993 13.7234L17.3655 11.0443M6.63376 10.9693L2 13.6484L4.67534 18.2886L9.3091 15.6095"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
