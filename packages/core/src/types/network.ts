// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export interface Network {
  buyEnabled?: boolean;
  chainId?: string;
  faucetUrl?: string;
  indexerUrl?: string;
  name: string;
  nodeUrl: string;
}

export type Networks = Record<string, Network>;

export enum DefaultNetworks {
  Devnet = 'Devnet',
  Localhost = 'Localhost',
  Mainnet = 'Mainnet',
  Testnet = 'Testnet',
}

export const defaultCustomNetworks: Networks = {
  [DefaultNetworks.Localhost]: {
    faucetUrl: 'http://localhost:8081',
    indexerUrl: undefined,
    name: DefaultNetworks.Localhost,
    nodeUrl: 'http://localhost:8080',
  },
};

export const defaultNetworks: Networks = Object.freeze({
  [DefaultNetworks.Mainnet]: {
    buyEnabled: true,
    chainId: '1',
    faucetUrl: undefined,
    indexerUrl: 'https://indexer.mainnet.aptoslabs.com/v1/graphql',
    name: DefaultNetworks.Mainnet,
    nodeUrl: 'https://fullnode.mainnet.aptoslabs.com',
  },
  [DefaultNetworks.Testnet]: {
    chainId: '2',
    faucetUrl: 'https://faucet.testnet.aptoslabs.com',
    indexerUrl: 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql',
    name: DefaultNetworks.Testnet,
    nodeUrl: 'https://fullnode.testnet.aptoslabs.com',
  },
  [DefaultNetworks.Devnet]: {
    chainId: '65',
    faucetUrl: 'https://faucet.devnet.aptoslabs.com',
    indexerUrl: 'https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql',
    name: DefaultNetworks.Devnet,
    nodeUrl: 'https://fullnode.devnet.aptoslabs.com',
  },
} as const);

export const defaultNetworkName = DefaultNetworks.Mainnet;
