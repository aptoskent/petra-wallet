// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
export * from './build';
export * from './submit';
export * from './utils';

// TODO: make this parameter configurable by the user
const defaultGasMultiplier = 2;

export function maxGasFeeFromEstimated(
  estimatedGasFee: number,
  multiplier = defaultGasMultiplier,
) {
  return estimatedGasFee * multiplier;
}
