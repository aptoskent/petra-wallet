// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { FetchAccountResource } from '../../useAccountResources';

export async function getValidatorDelegatedStakeAndNetworkPercentage(
  fetchResource: FetchAccountResource,
  ownerAddress: string,
  totalVotingPower: string,
) {
  const resDelegationPool = await fetchResource(
    ownerAddress,
    '0x1::delegation_pool::DelegationPool',
  );

  const delegatedStakeAmount =
    resDelegationPool?.data.active_shares?.total_coins ?? '0';

  const networkPercentage =
    parseInt(delegatedStakeAmount, 10) / parseInt(totalVotingPower, 10);

  return {
    delegatedStakeAmount,
    networkPercentage,
  };
}

export default getValidatorDelegatedStakeAndNetworkPercentage;
