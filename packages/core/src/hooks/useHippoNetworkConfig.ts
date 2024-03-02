// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { CONFIGS, NetworkConfiguration } from '@manahippo/hippo-sdk';
import { DefaultNetworks } from '../types';
import { useNetworks } from './useNetworks';

const NETWORK_CONFIG: Record<DefaultNetworks, NetworkConfiguration | null> =
  Object.freeze({
    [DefaultNetworks.Mainnet]: CONFIGS.mainnet,
    [DefaultNetworks.Testnet]: CONFIGS.testnet,
    [DefaultNetworks.Devnet]: null,
    [DefaultNetworks.Localhost]: CONFIGS.localhost,
  });

const useHippoNetworkConfig = () => {
  const { activeNetworkName } = useNetworks();
  const networkConfig = NETWORK_CONFIG[activeNetworkName as DefaultNetworks];

  return networkConfig;
};

export default useHippoNetworkConfig;
