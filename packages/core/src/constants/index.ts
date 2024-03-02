// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// Coin
export const coinStoreResource = 'CoinStore';
export const coinInfoResource = 'CoinInfo';
export const aptosAccountNamespace = '0x1::aptos_account';
export const aptosAccountCreateAccountViaTransferFunctionName = 'transfer';
export const aptosAccountCoinTransferFunctionName = 'transfer_coins';
export const aptosAccountCoinTransferFunction =
  `${aptosAccountNamespace}::${aptosAccountCoinTransferFunctionName}` as const;
export const coinNamespace = '0x1::coin';
export const makeCoinInfoStructTag = (coinType: string) =>
  `0x1::coin::CoinInfo<${coinType}>` as const;
export const aptosCoinStructTag = '0x1::aptos_coin::AptosCoin';
export const coinStoreStructTag =
  `${coinNamespace}::${coinStoreResource}` as const;
export const aptosCoinStoreStructTag =
  `${coinStoreStructTag}<${aptosCoinStructTag}>` as const;
// Token
export const tokenNamespace = '0x3::token';
export const tokenStoreStructTag = `${tokenNamespace}::TokenStore` as const;
export const tokenDepositStructTag = `${tokenNamespace}::DepositEvent` as const;
export const tokenWithdrawStructTag =
  `${tokenNamespace}::WithdrawEvent` as const;
// Stake
export const stakeNamespace = '0x1::stake';
export const aptosStakePoolStructTag = `${stakeNamespace}::StakePool` as const;
export const aptosValidatorSetStructTag =
  `${stakeNamespace}::ValidatorSet` as const;
// Delegation
export const aptosDelegationPoolStructTag =
  '0x1::delegation_pool::DelegationPool' as const;

// faucet
export const defaultFundAmount = 10e8;

// simulation
export const simulationRefetchInterval = 10000;

export const latestVersion = 1;

export const passwordStrength = 2;

export const validStorageUris = ['amazonaws.com', 'ipfs.io', 'arweave.net'];

export const settingsItemLabel = {
  EXPLORER: 'View on explorer',
  HELP_SUPPORT: 'Help & Support',
  LOCK_WALLET: 'Lock wallet',
  MANAGE_ACCOUNT: 'Manage account',
  NETWORK: 'Network',
  REMOVE_ACCOUNT: 'Remove account',
  SHOW_CREDENTIALS: 'Show credentials',
  SWITCH_ACCOUNT: 'Switch account',
};

/**
 * Mempool buckets
 * @see https://github.com/aptos-labs/aptos-core/blob/main/config/src/config/mempool_config.rs#L7
 */
export const mempoolBuckets = [
  100,
  150,
  300,
  500,
  1000, // 1,000,
  3000, // 3,000,
  5000, // 5,000,
  10000, // 10,000,
  100000, // 100,000,
  1000000, // 1,000,000,
];

export enum MNEMONIC {
  A = 'mnemonic-a',
  B = 'mnemonic-b',
  C = 'mnemonic-c',
  D = 'mnemonic-d',
  E = 'mnemonic-e',
  F = 'mnemonic-f',
  G = 'mnemonic-g',
  H = 'mnemonic-h',
  I = 'mnemonic-i',
  J = 'mnemonic-j',
  K = 'mnemonic-k',
  L = 'mnemonic-l',
}

export const mnemonicValues = [
  MNEMONIC.A,
  MNEMONIC.B,
  MNEMONIC.C,
  MNEMONIC.D,
  MNEMONIC.E,
  MNEMONIC.F,
  MNEMONIC.G,
  MNEMONIC.H,
  MNEMONIC.I,
  MNEMONIC.J,
  MNEMONIC.K,
  MNEMONIC.L,
];

// You must stake at least 11 apt
export const MINIMUM_APT_FOR_STAKE = 11;
// You must unstake at least 10 apt
export const MINIMUM_APT_FOR_UNSTAKE = 10;
// There must be at least 10 apt in the stake pool at any time
// You can't unstake less than 10 apt at a time
export const MINIMUM_APT_IN_STAKE_POOL = 10;
export const OCTA = 100000000;
export const MINIMUM_APT_FOR_UNSTAKE_OCTA = 10 * OCTA;
export const STAKING_QUERY_KEY_PREFIX = 'staking query';
