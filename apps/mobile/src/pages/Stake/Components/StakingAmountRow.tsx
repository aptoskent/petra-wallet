// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Cluster from 'core/components/Layouts/Cluster';
import Typography from 'core/components/Typography';
import { StyleProp, View, ViewStyle } from 'react-native';
import { StakingCoin } from './StakingCoin';

interface StakingAmountRowProps {
  Icon?: () => JSX.Element;
  aptAmount: number | string;
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function StakingAmountRow({
  Icon,
  aptAmount,
  label,
  style,
}: StakingAmountRowProps) {
  return (
    <Cluster
      noWrap
      justify="space-between"
      align="center"
      space={12}
      padding={4}
      style={[style]}
    >
      {Icon ? <Icon /> : null}
      <View style={{ flex: 2 }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
          }}
        >
          <Typography variant="body" weight="600" style={{ flex: 1 }}>
            {label}
          </Typography>
        </View>
        <StakingCoin
          align="left"
          flexPriority
          decimals={6}
          color="primary"
          amount={`${aptAmount}`}
          titleColor="muted"
          titleType="coin"
        />
      </View>
      <StakingCoin
        align="right"
        flexPriority
        bold
        color="primary"
        amount={`${aptAmount}`}
        titleColor="primary"
        titleType="usd"
      />
    </Cluster>
  );
}
export default StakingAmountRow;
