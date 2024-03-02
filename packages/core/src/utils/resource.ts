// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { CoinStoreResourceData, Resource } from '../types';
import { coinStoreStructTag } from '../constants';

const coinStoreTypePattern = new RegExp(`^${coinStoreStructTag}<(.+)>$`);

/**
 * Get coin store resources from a set of resources, grouped by coin type
 */
export function getCoinStoresByCoinType(resources: Resource[]) {
  const coinStores: Record<string, CoinStoreResourceData> = {};
  for (const resource of resources) {
    const match = resource.type.match(coinStoreTypePattern);
    if (match !== null) {
      const coinType = match[1];
      coinStores[coinType] = resource.data as CoinStoreResourceData;
    }
  }
  return coinStores;
}

export default getCoinStoresByCoinType;
