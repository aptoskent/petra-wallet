// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { StakePoolResourceData } from '../../../types';

// TODO: Should we format this for the view
export default function getLockedUntil(
  stakePool?: StakePoolResourceData | null,
): number | null {
  return stakePool ? parseInt(stakePool.locked_until_secs, 10) : null;
}
