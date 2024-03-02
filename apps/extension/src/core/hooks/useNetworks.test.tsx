// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AppStateProvider } from '@petra/core/hooks/useAppState';
import { NetworksProvider, useNetworks } from '@petra/core/hooks/useNetworks';
import { renderHook, waitFor } from '@testing-library/react';
import { AptosClient, TokenClient } from 'aptos';
import * as React from 'react';

import WebStorageProvider from 'shared/providers/WebStorageProvider';

function TestApp({ children }: { children: React.ReactNode }) {
  return (
    <WebStorageProvider>
      <AppStateProvider>
        <NetworksProvider>{children}</NetworksProvider>
      </AppStateProvider>
    </WebStorageProvider>
  );
}

test('default values', () => {
  const { result } = renderHook(() => useNetworks(), { wrapper: TestApp });

  expect(result.current.activeNetwork).toEqual({
    buyEnabled: true,
    chainId: '1',
    faucetUrl: undefined,
    indexerUrl: 'https://indexer.mainnet.aptoslabs.com/v1/graphql',
    name: 'Mainnet',
    nodeUrl: 'https://fullnode.mainnet.aptoslabs.com',
  });
  expect(result.current.activeNetworkName).toEqual('Mainnet');
  expect(result.current.aptosClient).toBeInstanceOf(AptosClient);
  expect(result.current.customNetworks).toEqual({
    Localhost: {
      faucetUrl: 'http://localhost:8081',
      indexerUrl: undefined,
      name: 'Localhost',
      nodeUrl: 'http://localhost:8080',
    },
  });
  expect(result.current.hasFaucet).toBe(false);
  expect(result.current.indexerClient).toBeDefined();
  expect(result.current.networks).toEqual({
    Devnet: {
      chainId: '65',
      faucetUrl: 'https://faucet.devnet.aptoslabs.com',
      indexerUrl: 'https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql',
      name: 'Devnet',
      nodeUrl: 'https://fullnode.devnet.aptoslabs.com',
    },
    Localhost: {
      faucetUrl: 'http://localhost:8081',
      indexerUrl: undefined,
      name: 'Localhost',
      nodeUrl: 'http://localhost:8080',
    },
    Mainnet: {
      buyEnabled: true,
      chainId: '1',
      faucetUrl: undefined,
      indexerUrl: 'https://indexer.mainnet.aptoslabs.com/v1/graphql',
      name: 'Mainnet',
      nodeUrl: 'https://fullnode.mainnet.aptoslabs.com',
    },
    Testnet: {
      chainId: '2',
      faucetUrl: 'https://faucet.testnet.aptoslabs.com',
      indexerUrl: 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql',
      name: 'Testnet',
      nodeUrl: 'https://fullnode.testnet.aptoslabs.com',
    },
  });
  expect(result.current.tokenClient).toBeInstanceOf(TokenClient);
});

test('switching network to devnet', async () => {
  const { result } = renderHook(() => useNetworks(), { wrapper: TestApp });

  result.current.switchNetwork('Devnet');
  await waitFor(() =>
    expect(result.current.activeNetworkName).toEqual('Devnet'),
  );

  expect(result.current.activeNetwork).toEqual(result.current.networks.Devnet);
});

test('switching network to testnet', async () => {
  const { result } = renderHook(() => useNetworks(), { wrapper: TestApp });

  result.current.switchNetwork('Testnet');
  await waitFor(() =>
    expect(result.current.activeNetworkName).toEqual('Testnet'),
  );

  expect(result.current.activeNetwork).toEqual(result.current.networks.Testnet);
});

test('adding a custom network', async () => {
  const { result } = renderHook(() => useNetworks(), { wrapper: TestApp });
  const network = {
    name: 'Insanenet',
    nodeUrl: 'https://example.com/',
  };

  result.current.addNetwork(network);
  await waitFor(() =>
    expect(result.current.activeNetworkName).toEqual(network.name),
  );

  expect(result.current.activeNetwork).toEqual(network);
});

test('editing a custom network', async () => {
  const { result } = renderHook(() => useNetworks(), { wrapper: TestApp });
  const network = {
    name: 'Insanenet',
    nodeUrl: 'https://example.com/',
  };

  result.current.addNetwork(network);
  await waitFor(() =>
    expect(result.current.activeNetworkName).toEqual(network.name),
  );

  const newUrl = 'https://example.com:1337';
  result.current.editNetwork({
    ...network,
    nodeUrl: newUrl,
  });

  await waitFor(() =>
    expect(result.current.activeNetwork.nodeUrl).toEqual(newUrl),
  );
});

test('removing a custom network', async () => {
  const { result } = renderHook(() => useNetworks(), { wrapper: TestApp });
  const network = {
    name: 'Insanenet',
    nodeUrl: 'https://example.com/',
  };

  result.current.addNetwork(network);
  await waitFor(() =>
    expect(result.current.activeNetworkName).toEqual(network.name),
  );

  result.current.removeNetwork(network.name);

  await waitFor(() =>
    expect(result.current.networks[network.name]).toBeUndefined(),
  );
  expect(result.current.activeNetworkName).toEqual('Mainnet');
});
