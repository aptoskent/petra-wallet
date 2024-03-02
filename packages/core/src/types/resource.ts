// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Types } from 'aptos';
import {
  aptosCoinStoreStructTag,
  aptosDelegationPoolStructTag,
  aptosStakePoolStructTag,
  aptosValidatorSetStructTag,
  coinStoreStructTag,
  tokenStoreStructTag,
} from '../constants';

export interface Guid {
  id: {
    addr: Types.Address;
    creation_num: Types.U64;
  };
}

export interface EventHandle {
  counter: Types.U64;
  guid: Guid;
}

export interface CoinRaw {
  value: Types.U64;
}

export interface CoinStoreResourceData {
  coin: CoinRaw;
  deposit_events: EventHandle;
  frozen: boolean;
  withdraw_events: EventHandle;
}

export interface CoinStoreResource {
  data: CoinStoreResourceData;
  type: typeof aptosCoinStoreStructTag | string;
}

export interface CoinInfoData {
  decimals: number;
  name: string;
  symbol: string;
  type: string;
}

export type CoinInfoResourceData = CoinInfoData & {
  supply: any;
};

export interface CoinInfoResource {
  data: CoinInfoResourceData;
  type: string;
}

export interface StakePoolResource {
  data: StakePoolResourceData;
  type: typeof aptosStakePoolStructTag;
}

export interface StakePoolResourceData {
  active: CoinRaw;
  add_stake_events: EventHandle;
  /**
   * Track the current vote delegator of the staking pool.
   * Only the account holding OwnerCapability of the staking pool can update this.
   */
  delegated_voter: Types.Address;
  distribute_rewards_events: EventHandle;
  // inactive stake, can be withdrawn
  inactive: CoinRaw;
  increase_lockup_events: EventHandle;
  initialize_validator_events: EventHandle;

  join_validator_set_events: EventHandle;
  leave_validator_set_events: EventHandle;
  locked_until_secs: Types.U64;
  /**
   * Track the current operator of the validator node. This allows the operator to be
   * different from the original account and allow for separation of the validator
   * operations and ownership. Only the account holding OwnerCapability of the
   * staking pool can update this.
   */
  operator_address: Types.Address;
  /** pending activation for next epoch */
  pending_active: CoinRaw;
  /** pending deactivation for next epoch */
  pending_inactive: CoinRaw;
  reactivate_stake_events: EventHandle;
  rotate_consensus_key_events: EventHandle;
  set_operator_events: EventHandle;
  unlock_stake_events: EventHandle;
  update_network_and_fullnode_addresses_events: EventHandle;
  withdraw_stake_events: EventHandle;
}

export interface TokenStoreResourceData {
  burn_events: EventHandle;
  deposit_events: EventHandle;
  direct_transfer: boolean;
  mutate_token_property_events: EventHandle;
  withdraw_events: EventHandle;
}

export interface TokenStoreResource {
  data: TokenStoreResourceData;
  type: typeof tokenStoreStructTag;
}

export interface ValidatorSetResource {
  data: ValidatorSetResourceData;
  type: typeof aptosValidatorSetStructTag;
}

export interface ValidatorSetResourceData {
  /** Active validators for the current epoch. */
  active_validators: ValidatorInfo[];
  /** Pending validators to join in next epoch. */
  pending_active: ValidatorInfo[];
  /** Pending validators to leave in next epoch (still active). */
  pending_inactive: ValidatorInfo[];
  /** Total voting power waiting to join in the next epoch. */
  total_joining_power: Types.U128;
  /** Current total voting power. */
  total_voting_power: Types.U128;
}

/** Consensus information per validator, stored in ValidatorSet. */
export interface ValidatorInfo {
  addr: Types.Address;
  config: {
    consensus_pubkey: string;
    /** to make it compatible with previous definition, remove later */
    fullnode_addresses: string;
    network_addresses: string;
    /** Index in the active set if the validator corresponding to this stake pool is active. */
    validator_index: Types.U64;
    /** Index in the active set if the validator corresponding to this stake pool is active. */
  };
  voting_power: Types.U64;
}

export interface PoolResourceData {
  /**
   * Default to 1. This can be used to minimize rounding errors when computing
   * shares and coins amount. However, users need to make sure the coins amount
   * don't overflow when multiplied by the scaling factor.
   */
  scaling_factor: Types.U64;
  shares: any; // Table<Types.Address, Types.U128>,
  total_coins: Types.U64;
  total_shares: Types.U128;
}

interface PoolResource {
  /**
   * Default to 1. This can be used to minimize rounding errors when computing
   * shares and coins amount. However, users need to make sure the coins amount
   * don't overflow when multiplied by the scaling factor.
   */
  scaling_factor: Types.U64;
  shareholders: Types.Address[];
  shareholders_limit: Types.U64;
  shares: Record<Types.Address, Types.U64>;
  total_coins: Types.U64;
  total_shares: Types.U64;
}

interface ObservedLockupCycle {
  index: Types.U64;
}

export interface DelegationPoolResource {
  data: DelegationPoolResourceData;
  type: typeof aptosDelegationPoolStructTag;
}

export interface DelegationPoolResourceData {
  /** Shares pool of `active` + `pending_active` stake */
  active_shares: PoolResource;
  /** The events emitted by stake-management operations on the delegation pool */
  add_stake_events: EventHandle;
  distribute_commission_events: EventHandle;
  /**
   * Shares pools of `inactive` stake on each ended OLC and `pending_inactive`
   * stake on the current one. Tracks shares of delegators who requested
   * withdrawals in each OLC
   */
  inactive_shares: any; // Table<ObservedLockupCycle, PoolResource>;
  /** Index of current observed lockup cycle on the delegation pool since its creation */
  observed_lockup_cycle: ObservedLockupCycle;
  /** Commission fee paid to the node operator out of pool rewards */
  operator_commission_percentage: Types.U64;
  /** Mapping from delegator address to the OLC of its pending withdrawal if having one */
  pending_withdrawals: any; // Table<Types.Address, ObservedLockupCycle>;
  reactivate_stake_events: EventHandle;
  /** Signer capability of the resource account owning the stake pool */
  stake_pool_signer_cap: {
    account: Types.Address;
  };
  /** Total (inactive) coins on the shares pools over all ended OLCs */
  total_coins_inactive: Types.U64;
  unlock_stake_events: EventHandle;
  withdraw_stake_events: EventHandle;
}

interface ResourceMap {
  [aptosCoinStoreStructTag]: CoinStoreResource;
  [aptosDelegationPoolStructTag]: DelegationPoolResource;
  [aptosStakePoolStructTag]: StakePoolResource;
  [aptosValidatorSetStructTag]: ValidatorSetResource;
  [coinStoreStructTag]: CoinStoreResource;
  [tokenStoreStructTag]: TokenStoreResource;
}

export type ResourceType = keyof ResourceMap;
export type ResourceTypeValue<T extends ResourceType> = ResourceMap[T];
export type Resource = ResourceMap[ResourceType];
