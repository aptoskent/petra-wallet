// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ActivityFilledIcon from './activity_filled_icon.svg';
import ActivityOutlinedIcon from './activity_outlined_icon.svg';
import makeIcon, { IconProps } from './makeIcon';

export default makeIcon<IconProps & { filled?: boolean }>(
  'ActivityIcon',
  ({ color, filled = false, size = 24, ...props }) =>
    filled ? (
      <ActivityFilledIcon width={size} height={size} color={color} {...props} />
    ) : (
      <ActivityOutlinedIcon
        width={size}
        height={size}
        color={color}
        {...props}
      />
    ),
);
