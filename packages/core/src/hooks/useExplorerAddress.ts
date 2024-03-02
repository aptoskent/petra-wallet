// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';

import { DefaultNetworks } from '../types';
import { useNetworks } from './useNetworks';

const explorerBasePath = 'https://explorer.aptoslabs.com';

const explorerNetworkNamesMap: Record<string, string> = {
  [DefaultNetworks.Mainnet]: 'mainnet',
  [DefaultNetworks.Devnet]: 'devnet',
  [DefaultNetworks.Testnet]: 'testnet',
  [DefaultNetworks.Localhost]: 'local',
};

export default function useExplorerAddress() {
  const {
    activeNetwork: { name: networkName },
  } = useNetworks();

  const explorerNetworkName = explorerNetworkNamesMap[networkName];
  const networkSuffix =
    explorerNetworkName !== undefined ? `?network=${explorerNetworkName}` : '';

  return useCallback(
    (path?: string) =>
      path !== undefined
        ? `${explorerBasePath}/${path}${networkSuffix}`
        : `${explorerBasePath}${networkSuffix}`,
    [networkSuffix],
  );
}
