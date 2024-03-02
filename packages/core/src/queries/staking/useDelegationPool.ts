// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { UseQueryOptions } from 'react-query';
import { PetraStakingInfo } from './types';
import { useDelegationPools } from './useDelegationPools';

export const useDelegationPool = (
  address: string,
  options?: UseQueryOptions<PetraStakingInfo[]>,
) => {
  const { data, ...rest } = useDelegationPools({
    includeInactive: true,
    options,
  });

  return {
    ...rest,
    data: data?.find((pool) => pool.validator.owner_address === address),
  };
};

export default useDelegationPool;
