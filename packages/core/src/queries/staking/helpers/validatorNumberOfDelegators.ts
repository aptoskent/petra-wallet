// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Sdk } from '@petra/indexer-client/src/generated/sdk';

export default async function validatorNumberOfDelegators(
  indexerClient: Sdk,
  poolAddress: string,
): Promise<number> {
  const res = await indexerClient.getNumberOfDelegators({
    poolAddress,
  });

  return res?.num_active_delegator_per_pool?.length > 0
    ? res.num_active_delegator_per_pool[0].num_active_delegator ?? 0
    : 0;
}
