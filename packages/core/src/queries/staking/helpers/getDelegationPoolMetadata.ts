// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Sdk } from '@petra/indexer-client/src/generated/sdk';
import { DelegationPoolMetadata, ValidatorStatus } from '../types';
import getLockedUntil from './getLockUntil';
import { getValidatorDelegatedStakeAndNetworkPercentage } from './getValidatorDelegatedStakeAndNetworkPercentage';
import getValidatorCommission from './validatorCommission';
import validatorNumberOfDelegators from './validatorNumberOfDelegators';
import getValidatorStatus from './validatorStatus';
import { FetchAccountResource } from '../../useAccountResources';
import { FetchView } from '../../useView';
import { getStakePool } from './getStakePool';

/**
 * We initially fetch the list of validators from the indexer and
 * a flat json file. This function takes a validator and fetches
 * all relevant information to make it a "delegation pool"
 */
export async function getDelegationPoolMetadata(
  ownerAddress: string,
  totalVotingPower: string,
  fetchResource: FetchAccountResource,
  fetchView: FetchView,
  indexerClient: Sdk,
  includeInactive?: boolean,
): Promise<DelegationPoolMetadata | null> {
  try {
    const validatorStatus = await getValidatorStatus(fetchView, ownerAddress);

    if (
      !includeInactive &&
      (validatorStatus === ValidatorStatus.inactive ||
        validatorStatus === ValidatorStatus.unknown)
    ) {
      return null;
    }

    const [
      { delegatedStakeAmount, networkPercentage },
      commission,
      numberOfDelegators,
      stakePool,
    ] = await Promise.all([
      getValidatorDelegatedStakeAndNetworkPercentage(
        fetchResource,
        ownerAddress,
        totalVotingPower,
      ),
      getValidatorCommission(fetchView, ownerAddress),
      validatorNumberOfDelegators(indexerClient, ownerAddress),
      getStakePool(fetchResource, ownerAddress),
    ]);

    const meta: DelegationPoolMetadata = {
      commission,
      delegatedStakeAmount,
      lockedUntilTimestamp: getLockedUntil(stakePool),
      networkPercentage,
      numberOfDelegators,
      rewardsRate: 0.07,
      validatorStatus,
    };

    return meta;
  } catch (e) {
    return null;
  }
}

export default getDelegationPoolMetadata;
