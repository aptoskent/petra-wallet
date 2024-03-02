// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// Accounts
export interface EncryptedAccounts {
  ciphertext: string;
  nonce: string;
}

export interface PublicAccount {
  address: string;
  publicKey: string;
}

export type Account = PublicAccount & {
  mnemonic?: string;
  name?: string;
  privateKey: string;
};

export type Accounts = Record<string, Account>;

// network
export interface Network {
  buyEnabled?: boolean;
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
    faucetUrl: 'http://localhost:80',
    indexerUrl: undefined,
    name: DefaultNetworks.Localhost,
    nodeUrl: 'http://localhost:8080',
  },
};

export const defaultNetworks: Networks = Object.freeze({
  [DefaultNetworks.Mainnet]: {
    buyEnabled: true,
    faucetUrl: undefined,
    indexerUrl: 'https://indexer.mainnet.aptoslabs.com/v1/graphql',
    name: DefaultNetworks.Mainnet,
    nodeUrl: 'https://fullnode.mainnet.aptoslabs.com',
  },
  [DefaultNetworks.Testnet]: {
    faucetUrl: 'https://faucet.testnet.aptoslabs.com',
    indexerUrl: 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql',
    name: DefaultNetworks.Testnet,
    nodeUrl: 'https://fullnode.testnet.aptoslabs.com',
  },
  [DefaultNetworks.Devnet]: {
    faucetUrl: 'https://faucet.devnet.aptoslabs.com',
    indexerUrl: 'https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql',
    name: DefaultNetworks.Devnet,
    nodeUrl: 'https://fullnode.devnet.aptoslabs.com',
  },
} as const);

export const defaultNetworkName = DefaultNetworks.Mainnet;
