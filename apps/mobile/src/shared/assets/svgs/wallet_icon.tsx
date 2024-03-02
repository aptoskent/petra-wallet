// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import WalletFilledIcon from './wallet_filled_icon.svg';
import WalletOutlinedIcon from './wallet_outlined_icon.svg';
import makeIcon, { IconProps } from './makeIcon';

export default makeIcon<IconProps & { filled?: boolean }>(
  'WalletIcon',
  ({ color, filled = false, size = 24, ...props }) =>
    filled ? (
      <WalletFilledIcon width={size} height={size} color={color} {...props} />
    ) : (
      <WalletOutlinedIcon width={size} height={size} color={color} {...props} />
    ),
);
