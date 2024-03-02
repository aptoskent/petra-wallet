// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useWebRestApi } from '@petra/core/hooks/useWebRestApi';

export default function useCachedRestApi(): any {
  const restApi = useWebRestApi();

  /**
   * Get info for the specified coin type.
   * If not available in cache, the value is fetched using the active AptosClient
   * and added to the cache.
   * @param coinType
   */
  const getCoinInfo = async (coinType: string) => {
    const coinInfo = await restApi.getCoinInfo(coinType);
    return coinInfo;
  };

  return {
    getCoinInfo,
  };
}
