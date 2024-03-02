// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import makeClient from '@petra/indexer-client';
import { AptosClient, FaucetClient, TokenClient } from 'aptos';
import constate from 'constate';
import { useMemo } from 'react';
import { useAppState } from './useAppState';
import {
  defaultCustomNetworks,
  defaultNetworkName,
  defaultNetworks,
  Network,
} from '../types';
/**
 * Return object without the specified keys
 * @param src source object
 * @param keys keys to filter out
 */
function filterKeys<T>(src: { [key: string]: T }, keys: string[]) {
  const dst: { [key: string]: T } = {};
  for (const [key, value] of Object.entries(src)) {
    if (!keys.includes(key)) {
      dst[key] = value;
    }
  }
  return dst;
}

/**
 * Hook/provider for accessing and updating the networks state.
 * The set of available networks is the union between `defaultNetworks` (which is constant)
 * and `customNetworks` which is editable by the user
 */
export const [NetworksProvider, useNetworks] = constate(() => {
  const { activeAccountAddress, updatePersistentState, ...appState } =
    useAppState();

  const activeNetworkName = appState.activeNetworkName ?? defaultNetworkName;

  // Filtering out custom networks that share names with default networks
  const customNetworks = filterKeys(
    appState.customNetworks ?? defaultCustomNetworks,
    Object.keys(defaultNetworks),
  );

  const networks = { ...defaultNetworks, ...customNetworks };
  const activeNetwork =
    networks[activeNetworkName] ?? networks[defaultNetworkName];

  const addNetwork = async (network: Network, shouldSwitch: boolean = true) => {
    const newCustomNetworks = { ...customNetworks, [network.name]: network };

    if (shouldSwitch) {
      await updatePersistentState({
        activeNetworkChainId: network.chainId,
        activeNetworkName: network.name,
        activeNetworkRpcUrl: network.nodeUrl,
        customNetworks: newCustomNetworks,
      });
    } else {
      await updatePersistentState({ customNetworks: newCustomNetworks });
    }
  };

  const editNetwork = async (network: Network) => {
    if (network.name in networks) {
      const newCustomNetworks = { ...customNetworks, [network.name]: network };
      await updatePersistentState({ customNetworks: newCustomNetworks });
    }
  };

  const removeNetwork = async (networkName: string) => {
    const newCustomNetworks = { ...customNetworks };
    delete newCustomNetworks[networkName];

    if (networkName === activeNetworkName) {
      const firstAvailableNetwork = Object.values(networks)[0];
      await updatePersistentState({
        activeNetworkChainId: firstAvailableNetwork.chainId,
        activeNetworkName: firstAvailableNetwork.name,
        activeNetworkRpcUrl: firstAvailableNetwork.nodeUrl,
        customNetworks: newCustomNetworks,
      });
    } else {
      await updatePersistentState({ customNetworks: newCustomNetworks });
    }
  };

  const switchNetwork = async (networkName: string) => {
    const network = networks[networkName];
    await updatePersistentState({
      activeNetworkChainId: network.chainId,
      activeNetworkName: networkName,
      activeNetworkRpcUrl: network.nodeUrl,
    });
  };

  const aptosClient = useMemo(
    () => new AptosClient(activeNetwork.nodeUrl),
    [activeNetwork],
  );

  const faucetClient = useMemo(
    () =>
      activeNetwork.faucetUrl
        ? new FaucetClient(activeNetwork.nodeUrl, activeNetwork.faucetUrl)
        : undefined,
    [activeNetwork],
  );

  const tokenClient = useMemo(
    () => new TokenClient(aptosClient),
    [aptosClient],
  );

  const indexerClient = useMemo(
    () =>
      activeNetwork.indexerUrl
        ? makeClient(activeNetwork.indexerUrl)
        : undefined,
    [activeNetwork.indexerUrl],
  );

  return {
    activeNetwork,
    activeNetworkName,
    addNetwork,
    aptosClient,
    customNetworks,
    editNetwork,
    faucetClient,
    hasFaucet: faucetClient !== undefined,
    indexerClient,
    networks,
    removeNetwork,
    switchNetwork,
    tokenClient,
  };
});
