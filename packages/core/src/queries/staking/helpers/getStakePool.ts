// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { FetchAccountResource } from '../../useAccountResources';

function ensureMillisecondTimestamp(timestamp: string): string {
  let sanitizedTimestamp = timestamp;
  if (sanitizedTimestamp.length > 13) {
    sanitizedTimestamp = sanitizedTimestamp.slice(0, 13);
  }
  if (sanitizedTimestamp.length === 10) {
    sanitizedTimestamp += '000';
  }
  return sanitizedTimestamp;
}

export async function getStakePool(
  fetchResource: FetchAccountResource,
  address: string,
) {
  const res = await fetchResource(address, '0x1::stake::StakePool');
  if (!res) return null;

  const stakePool = res.data;
  stakePool.locked_until_secs = ensureMillisecondTimestamp(
    stakePool.locked_until_secs,
  );
  return stakePool;
}

export default getStakePool;
