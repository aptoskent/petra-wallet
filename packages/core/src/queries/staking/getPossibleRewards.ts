// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { PetraStakingInfo, ValidatorStatus } from './types';

/**
 * numMonths: We care about rewards per month, so we use 12 months
 * validatorPerformance: Rewards depend on how active validators are
 * rewardRate: The reward rate is 7% per year
 * validatorCommission: The validator takes a % of rewards earned
 */
export function getPossibleRewards(
  stakeAmount: string,
  info: PetraStakingInfo,
): string {
  if (info.delegationPool.validatorStatus !== ValidatorStatus.active) {
    return '0';
  }

  const amount = Number(stakeAmount);
  const validatorPerformance = info.validator.rewards_growth / 100;
  const numMonths = 12;
  const rewardRate = info.delegationPool.rewardsRate;
  const validatorCommission = info.delegationPool.commission / 100;

  const rewards =
    (amount * rewardRate * validatorPerformance * (1 - validatorCommission)) /
    numMonths;

  return rewards.toFixed(0);
}

export default getPossibleRewards;
