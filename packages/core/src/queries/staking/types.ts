// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export enum ValidatorStatus {
  active,
  inactive,
  pendingActivity,
  pendingInactive,
  unknown,
}

export enum StakeOperation {
  REACTIVATE = 'reactivate_stake',
  STAKE = 'add_stake',
  UNLOCK = 'unlock',
  WITHDRAW = 'withdraw',
}

export interface ValidatorFromJSONFile {
  apt_rewards_distributed: number;
  governance_voting_record: string;
  last_epoch: number;
  last_epoch_performance: string;
  liveness: number;
  location_stats?: GeoData;
  operator_address: string;
  owner_address: string;
  rewards_growth: number;
}

export interface GeoData {
  city: string;
  country: string;
  epoch: number;
  latitude: number;
  longitude: number;
  peer_id: string;
  region: string;
}

export interface PetraStakingInfo {
  delegationPool: DelegationPoolMetadata;
  totalVotingPower: string;
  validator: ValidatorFromJSONFile;
}

export interface DelegationPoolMetadata {
  commission: number;
  delegatedStakeAmount: string;
  lockedUntilTimestamp: number | null;
  networkPercentage: number;
  numberOfDelegators: number;
  rewardsRate: number;
  validatorStatus: ValidatorStatus;
}
