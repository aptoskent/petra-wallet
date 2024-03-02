// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { MINIMUM_APT_IN_STAKE_POOL, OCTA } from '../../constants';

// Rules:
// - The minimum you can unstake is 10 APT
// - The active stake in a pool is 10 APT
export default function sanitizeUnstakeAmount(
  rawAmount: bigint,
  total: bigint,
) {
  let amount = Number(rawAmount);

  if (amount < MINIMUM_APT_IN_STAKE_POOL * OCTA) {
    amount = MINIMUM_APT_IN_STAKE_POOL * OCTA;
  }

  if (Number(total) - amount < MINIMUM_APT_IN_STAKE_POOL * OCTA) {
    amount = Number(total);
  }

  return amount;
}
