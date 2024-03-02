// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys-fix/sort-keys-fix,sort-keys */
// from @manahippo/coin-list
import { RawCoinInfo } from '@manahippo/coin-list';

export const rawInfoTestNet: RawCoinInfo[] = [
  {
    coingecko_id: '',
    decimals: 8,
    extensions: {
      data: [],
    },
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/XBTC.svg',
    name: 'XBTC',
    official_symbol: 'XBTC',
    project_url: 'https://github.com/OmniBTC/OmniBridge',
    symbol: 'XBTC',
    token_type: {
      account_address:
        '0x3b0a7c06837e8fbcce41af0e629fdc1f087b06c06ff9e86f81910995288fd7fb',
      module_name: 'xbtc',
      struct_name: 'XBTC',
      type: '0x3b0a7c06837e8fbcce41af0e629fdc1f087b06c06ff9e86f81910995288fd7fb::xbtc::XBTC',
    },
    unique_index: 1,
  },
  {
    coingecko_id: '',
    decimals: 6,
    extensions: {
      data: [],
    },
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDA.svg',
    name: 'Argo USD',
    official_symbol: 'USDA',
    project_url: 'https://argo.fi/',
    symbol: 'USDA',
    token_type: {
      account_address:
        '0x1000000f373eb95323f8f73af0e324427ca579541e3b70c0df15c493c72171aa',
      module_name: 'usda',
      struct_name: 'USDA',
      type: '0x1000000f373eb95323f8f73af0e324427ca579541e3b70c0df15c493c72171aa::usda::USDA',
    },
    unique_index: 2,
  },
  {
    coingecko_id: 'aptos',
    decimals: 8,
    extensions: {
      data: [],
    },
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/APT.webp',
    name: 'Aptos Coin',
    official_symbol: 'APT',
    project_url: 'https://aptoslabs.com/',
    symbol: 'APT',
    token_type: {
      account_address: '0x1',
      module_name: 'aptos_coin',
      struct_name: 'AptosCoin',
      type: '0x1::aptos_coin::AptosCoin',
    },
    unique_index: 3,
  },
  {
    coingecko_id: 'bitcoin',
    decimals: 8,
    extensions: {
      data: [],
    },
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/BTC.webp',
    name: 'Bitcoin',
    official_symbol: 'devBTC',
    project_url: 'project_url',
    symbol: 'devBTC',
    token_type: {
      account_address:
        '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68',
      module_name: 'devnet_coins',
      struct_name: 'DevnetBTC',
      type: '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetBTC',
    },
    unique_index: 4,
  },
  {
    coingecko_id: 'usd-coin',
    decimals: 8,
    extensions: {
      data: [],
    },
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDC.webp',
    name: 'USD Coin',
    official_symbol: 'devUSDC',
    project_url: 'project_url',
    symbol: 'devUSDC',
    token_type: {
      account_address:
        '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68',
      module_name: 'devnet_coins',
      struct_name: 'DevnetUSDC',
      type: '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetUSDC',
    },
    unique_index: 5,
  },
  {
    coingecko_id: 'tether',
    decimals: 8,
    extensions: {
      data: [],
    },
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.webp',
    name: 'Tether',
    official_symbol: 'devUSDT',
    project_url: 'project_url',
    symbol: 'devUSDT',
    token_type: {
      account_address:
        '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68',
      module_name: 'devnet_coins',
      struct_name: 'DevnetUSDT',
      type: '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetUSDT',
    },
    unique_index: 6,
  },
  {
    coingecko_id: 'dai',
    decimals: 8,
    extensions: {
      data: [],
    },
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/DAI.webp',
    name: 'DAI',
    official_symbol: 'devDAI',
    project_url: 'project_url',
    symbol: 'devDAI',
    token_type: {
      account_address:
        '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68',
      module_name: 'devnet_coins',
      struct_name: 'DevnetDAI',
      type: '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetDAI',
    },
    unique_index: 7,
  },
];

export default rawInfoTestNet;
