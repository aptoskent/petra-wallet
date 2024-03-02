// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ExploreFilledIcon from './explore_filled_icon.svg';
import ExploreOutlinedIcon from './explore_outlined_icon.svg';
import makeIcon, { IconProps } from './makeIcon';

export default makeIcon<IconProps & { filled?: boolean }>(
  'ExploreIcon',
  ({ color, filled = false, size = 24, ...props }) =>
    filled ? (
      <ExploreFilledIcon width={size} height={size} color={color} {...props} />
    ) : (
      <ExploreOutlinedIcon
        width={size}
        height={size}
        color={color}
        {...props}
      />
    ),
);
