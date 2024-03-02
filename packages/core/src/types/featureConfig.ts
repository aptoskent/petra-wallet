// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export interface NetworkFeatureConfig {}

export interface CoinFeatureConfig {
  coinStore: string;
}

export interface FeatureConfig {
  // key is the network
  coins?: Record<string, CoinFeatureConfig[]>;
  lastUpdate: number;
  networks?: Record<string, NetworkFeatureConfig>;
}
