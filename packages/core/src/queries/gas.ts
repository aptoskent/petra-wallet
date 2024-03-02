// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Types } from 'aptos';
import { useQuery, UseQueryOptions } from 'react-query';
import { useNetworks } from '../hooks/useNetworks';

/**
 * QUERY KEYS
 */
export const gasQueryKeys = Object.freeze({
  getGas: 'getGas',
} as const);

/**
 * Query gas info
 * @param options query options
 * @returns {StakeInfo}
 */
export function useGas(
  options?: UseQueryOptions<Types.GasEstimation | undefined>,
) {
  const { aptosClient } = useNetworks();

  return useQuery<Types.GasEstimation | undefined>(
    [gasQueryKeys.getGas],
    async () => aptosClient.estimateGasPrice(),
    {
      retry: 0,
      ...options,
    },
  );
}
