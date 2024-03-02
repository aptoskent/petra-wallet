// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { UseQueryOptions, useQuery } from 'react-query';
import { AptosClient, Types } from 'aptos';
import { useNetworks } from '../hooks/useNetworks';
import sum from '../utils/sum';
import PromiseHelpers from '../utils/promiseHelpers';
import { useFetchAccountResource } from './useAccountResources';
import { getStakePool } from './staking/helpers/getStakePool';
import getValidatorStatus from './staking/helpers/validatorStatus';
import { useFetchView } from './useView';
import { normalizeAddress } from '../utils/account';
import { ValidatorStatus } from './staking/types';
import { STAKING_QUERY_KEY_PREFIX } from '../constants';
import { getStakePrincipals } from './staking/helpers/getStakePrincipals';
import { useActiveAccount } from '../hooks/useAccounts';

export type StakeStates = 'active' | 'withdrawPending' | 'withdrawReady';
type StakeTotals = Record<StakeStates, number>;

export interface Stake extends StakeTotals {
  lockedUntil?: string;
  operatorAddress: string;
  operatorAptosName?: string;
  poolAddress: string;
  principals: { active: number; pendingWithdraw: number };
  totalRewards: { active: number; pendingWithdraw: number };
  validatorStatus: ValidatorStatus;
}

export interface UseStakingReturnType {
  stakes: Stake[];
  total: number;
  totals: StakeTotals;
}

/**
 * Return whether `pending_inactive` stake can be directly withdrawn from the delegation pool,
 * for the edge case when the validator had gone inactive before its lockup expired.
 *
 * Relevant explorer links:
 * https://github.com/aptos-labs/explorer/blob/bec407a4ac150c02514466e30b2fac280c73ca96/src/pages/DelegatoryValidator/MyDepositsSection.tsx#L132
 * https://github.com/aptos-labs/explorer/blob/bec407a4ac150c02514466e30b2fac280c73ca96/src/pages/DelegatoryValidator/MyDepositsSection.tsx#L291
 * https://github.com/aptos-labs/explorer/blob/main/src/api/index.ts#L260
 *
 */
async function getCanWithdrawPendingInactive(
  client: AptosClient,
  validatorAddress: Types.Address,
): Promise<boolean> {
  const payload: Types.ViewRequest = {
    arguments: [validatorAddress],
    function: '0x1::delegation_pool::can_withdraw_pending_inactive',
    type_arguments: [],
  };
  const res = await client.view(payload);
  return Boolean(res[0]);
}

/**
 * Get the stakes for a delegator in a delegation
 * pool, via the node client.
 */
async function getStake(
  client: AptosClient,
  delegatorAddress: Types.Address,
  validatorAddress: Types.Address,
): Promise<StakeTotals> {
  const payload: Types.ViewRequest = {
    arguments: [validatorAddress, delegatorAddress],
    function: '0x1::delegation_pool::get_stake',
    type_arguments: [],
  };

  /**
   * Taken from the explorer:
   * https://github.com/aptos-labs/explorer/blob/bec407a4ac150c02514466e30b2fac280c73ca96/src/pages/DelegatoryValidator/MyDepositsSection.tsx#L273
   *
   * The view function returns [active, withdraw_ready, withdraw_pending]
   */
  const result = await client.view(payload);
  const stakes: StakeTotals = {
    // TODO: begin
    //       We shouldn't be converting to number here
    //       as it could overflow
    active: Number(result[0]),
    withdrawPending: Number(result[2]),
    withdrawReady: Number(result[1]),
    // TODO: end
  };

  /**
   * TODO: Ensure we want to handle this logic this way...
   *       In the explorer they make this call at the row level.
   */
  const canWithdrawPendingInactive = await getCanWithdrawPendingInactive(
    client,
    validatorAddress,
  );
  if (stakes.withdrawPending && canWithdrawPendingInactive) {
    stakes.withdrawReady += stakes.withdrawPending;
    stakes.withdrawPending = 0;
  }

  return stakes;
}

export const useStaking = ({
  address,
  options,
}: {
  address: string;
  options?: UseQueryOptions<UseStakingReturnType>;
}) => {
  const { activeNetworkName, indexerClient } = useNetworks();
  const { aptosClient } = useNetworks();
  const { activeAccountAddress } = useActiveAccount();
  const fetchResource = useFetchAccountResource();
  const fetchView = useFetchView();

  return useQuery<UseStakingReturnType>(
    [STAKING_QUERY_KEY_PREFIX, 'useStaking', activeNetworkName, address],
    async () => {
      try {
        const result = await indexerClient?.getDelegatedStaking({ address });
        const pools = result?.delegator_distinct_pool ?? [];
        const allStakes: Stake[] = await PromiseHelpers.sequentialMap(
          pools,
          async (pool): Promise<Stake> => {
            const validatorAddress = normalizeAddress(pool.pool_address ?? '');

            const [stake, stakePool, validatorStatus, principals] =
              await Promise.all([
                getStake(aptosClient, address, validatorAddress ?? ''),
                getStakePool(fetchResource, validatorAddress ?? ''),
                getValidatorStatus(fetchView, validatorAddress),
                getStakePrincipals({
                  delegatorAddress: activeAccountAddress,
                  indexerClient: indexerClient!,
                  validatorOwnerAddress: validatorAddress,
                }),
              ]);

            const totalRewards: Stake['totalRewards'] = {
              active:
                principals.active && stake.active > principals.active
                  ? stake.active - principals.active
                  : 0,
              pendingWithdraw:
                principals.pendingWithdraw &&
                stake.withdrawPending > principals.pendingWithdraw
                  ? stake.withdrawPending - principals.pendingWithdraw
                  : 0,
            };

            return {
              active: stake.active,
              lockedUntil: stakePool?.locked_until_secs,
              operatorAddress:
                pool.staking_pool_metadata?.operator_address ?? '',
              operatorAptosName:
                pool.staking_pool_metadata?.operator_aptos_name[0]?.domain,
              poolAddress: pool.pool_address ?? '',
              principals,
              totalRewards,
              validatorStatus,
              withdrawPending: stake.withdrawPending,
              withdrawReady: stake.withdrawReady,
            };
          },
        );

        return {
          stakes: allStakes,
          total: sum(
            allStakes,
            (stake) =>
              stake.active + stake.withdrawPending + stake.withdrawReady,
          ),
          totals: {
            active: sum(allStakes, (stake) => stake.active),
            withdrawPending: sum(allStakes, (stake) => stake.withdrawPending),
            withdrawReady: sum(allStakes, (stake) => stake.withdrawReady),
          },
        };
      } catch (e) {
        throw Error(`error querying delegated staking for address ${address}`);
      }
    },
    {
      ...options,
      enabled: indexerClient !== undefined && options?.enabled,
      // TODO: Consider how often we should be refetching this
      // TODO: Consider if we should be doing retries here
    },
  );
};
