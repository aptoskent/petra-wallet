// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Cluster from 'core/components/Layouts/Cluster';

interface StakingRowProps extends React.PropsWithChildren {
  marginTop?: true | number;
}

const SPACING = 8;

export function StakingRow({ children, marginTop }: StakingRowProps) {
  let space = 0;
  if (marginTop === true) space = SPACING;
  if (typeof marginTop === 'number') space = marginTop;

  return (
    <Cluster
      noWrap
      justify="space-between"
      align="flex-start"
      space={SPACING}
      style={{ marginTop: space }}
    >
      {children}
    </Cluster>
  );
}

export default StakingRow;
