// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { UseQueryOptions, useQuery } from 'react-query';
import { useNetworks } from '../../hooks/useNetworks';
import { PetraStakingInfo } from './types';
import { useGetPartialPetraStakingInfo } from './helpers/useGetPartialPetraStakingInfo';
import { getDelegationPoolMetadata } from './helpers/getDelegationPoolMetadata';
import { useFetchAccountResource } from '../useAccountResources';
import { useFetchView } from '../useView';
import { normalizeAddress } from '../../utils/account';
import { STAKING_QUERY_KEY_PREFIX } from '../../constants';

export const useDelegationPools = ({
  includeInactive,
  options,
}: {
  includeInactive?: boolean;
  options?: UseQueryOptions<PetraStakingInfo[]>;
} = {}) => {
  const fetchResource = useFetchAccountResource();
  const fetchView = useFetchView();

  const { activeNetworkName, indexerClient } = useNetworks();
  const { data: stakingInfoList = [] } = useGetPartialPetraStakingInfo();

  return useQuery<PetraStakingInfo[]>(
    [
      STAKING_QUERY_KEY_PREFIX,
      'useDelegationPools',
      activeNetworkName,
      stakingInfoList.length,
    ],
    async () => {
      try {
        const result = await indexerClient?.getDelegationPools();
        const delegatedStakingPools = result?.delegated_staking_pools || [];

        const fullStakingInfoList = await Promise.all(
          delegatedStakingPools.map<Promise<PetraStakingInfo | null>>(
            async (pool) => {
              const ownerAddress = normalizeAddress(pool.staking_pool_address);
              const stakingPoolAddress = normalizeAddress(
                pool.staking_pool_address,
              );

              // If no staking info is found, it means this
              // delegation pool was never active.
              const stakingInfo = stakingInfoList.find(
                ({ validator }) =>
                  validator.owner_address === stakingPoolAddress,
              ) || {
                totalVotingPower: '0',
                validator: {
                  apt_rewards_distributed: 0,
                  governance_voting_record: '',
                  last_epoch: 0,
                  last_epoch_performance: '',
                  liveness: 0,
                  operator_address: '',
                  owner_address: ownerAddress,
                  rewards_growth: 0,
                },
              };

              const delegationMetadata = await getDelegationPoolMetadata(
                ownerAddress,
                stakingInfo?.totalVotingPower || '0',
                fetchResource,
                fetchView,
                indexerClient!,
                includeInactive,
              );

              if (!delegationMetadata) return null;

              return {
                delegationPool: delegationMetadata,
                totalVotingPower: stakingInfo.totalVotingPower,
                validator: stakingInfo.validator,
              };
            },
          ),
        );

        return fullStakingInfoList.filter(Boolean) as PetraStakingInfo[];
      } catch (e) {
        throw Error(`Error fetching active validators: ${e}`);
      }
    },
    {
      ...options,
      enabled:
        indexerClient !== undefined &&
        options?.enabled &&
        stakingInfoList.length > 0,
    },
  );
};

export default useDelegationPools;
