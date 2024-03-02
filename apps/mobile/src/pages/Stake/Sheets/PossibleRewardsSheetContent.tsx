// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View } from 'react-native';
import Typography from 'core/components/Typography';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';
import { PetraStakingInfo } from '@petra/core/queries/staking/types';
import getPossibleRewards from '@petra/core/queries/staking/getPossibleRewards';
import { StakingRow } from '../Components/StakingRow';
import { StakingFacet } from '../Components/StakingFacet';
import { StakingLabel } from '../Components/StakingLabel';
import { StakingCoin } from '../Components/StakingCoin';

interface PossibleRewardsSheetContentProps {
  amount: string;
  info?: PetraStakingInfo;
}

export default function PossibleRewardsSheetContent({
  amount,
  info,
}: PossibleRewardsSheetContentProps): JSX.Element {
  const possibleRewards = info ? getPossibleRewards(amount, info) : null;
  const rewards = ((info?.delegationPool.rewardsRate ?? 0) * 100).toFixed(2);

  return (
    <View
      style={{
        paddingHorizontal: PADDING.container,
        paddingTop: PADDING.container,
      }}
    >
      <Typography weight="600" variant="subheading" align="center">
        {i18nmock('stake:possibleRewardsSheet.title')}
      </Typography>

      <Typography marginTop={32}>
        {i18nmock('stake:possibleRewardsSheet.description')}
      </Typography>

      {info ? (
        <>
          <StakingRow marginTop={32}>
            <StakingFacet
              title={i18nmock('stake:possibleRewardsSheet.possibleRewards')}
            />
            <StakingCoin
              align="right"
              bold
              color="primary"
              amount={possibleRewards || '0'}
              titleColor={possibleRewards === '0' ? 'error' : 'primary'}
              titleType="coin"
            />
          </StakingRow>

          <StakingRow marginTop={24}>
            <StakingLabel title="stake:possibleRewardsSheet.rewardRate" />
            <StakingFacet
              align="right"
              bold
              color="primary"
              title={`${rewards}%`}
            />
          </StakingRow>

          <StakingRow marginTop={24}>
            <StakingLabel
              flexPriority
              title="stake:possibleRewardsSheet.performanceRate"
            />
            <StakingFacet
              align="right"
              bold
              color="primary"
              title={`${info.validator.rewards_growth}%`}
            />
          </StakingRow>

          <StakingRow marginTop={24}>
            <StakingLabel
              flexPriority
              title="stake:possibleRewardsSheet.commissionRate"
            />
            <StakingFacet
              align="right"
              bold
              color="primary"
              title={`${info.delegationPool.commission}%`}
            />
          </StakingRow>
        </>
      ) : null}
    </View>
  );
}
