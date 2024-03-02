// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys-fix/sort-keys-fix,sort-keys */
// from @manahippo/coin-list
import { RawCoinInfo } from '@manahippo/coin-list';

const rawInfoMainnet: RawCoinInfo[] = [
  {
    coingecko_id: 'aptos',
    decimals: 8,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'APT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/APT.webp',
    name: 'Aptos Coin',
    official_symbol: 'APT',
    pancake_symbol: 'APT',
    permissioned_listing: true,
    project_url: 'https://aptoslabs.com/',
    symbol: 'APT',
    source: 'native',
    token_type: {
      account_address: '0x1',
      module_name: 'aptos_coin',
      struct_name: 'AptosCoin',
      type: '0x1::aptos_coin::AptosCoin',
    },
    unique_index: 1,
  },
  {
    coingecko_id: '',
    decimals: 6,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'MEE',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/MEE.svg',
    name: 'Meeiro',
    official_symbol: 'MEE',
    pancake_symbol: 'MEE',
    permissioned_listing: true,
    project_url: 'https://meeiro.xyz',
    symbol: 'MEE',
    source: 'native',
    token_type: {
      account_address:
        '0xe9c192ff55cffab3963c695cff6dbf9dad6aff2bb5ac19a6415cad26a81860d9',
      module_name: 'mee_coin',
      struct_name: 'MeeCoin',
      type: '0xe9c192ff55cffab3963c695cff6dbf9dad6aff2bb5ac19a6415cad26a81860d9::mee_coin::MeeCoin',
    },
    unique_index: 101,
  },
  {
    coingecko_id: 'move-dollar',
    decimals: 8,
    extensions: {
      data: [],
    },
    hippo_symbol: 'MOD',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/MOD.svg',
    name: 'Move Dollar',
    official_symbol: 'MOD',
    pancake_symbol: 'MOD',
    permissioned_listing: true,
    project_url: 'https://www.thala.fi/',
    symbol: 'MOD',
    source: 'native',
    token_type: {
      account_address:
        '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01',
      module_name: 'mod_coin',
      struct_name: 'MOD',
      type: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD',
    },
    unique_index: 128,
  },
  {
    coingecko_id: 'thala',
    decimals: 8,
    extensions: {
      data: [],
    },
    hippo_symbol: 'THL',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/THL.svg',
    name: 'Thala Token',
    official_symbol: 'THL',
    pancake_symbol: 'THL',
    permissioned_listing: true,
    project_url: 'https://www.thala.fi/',
    symbol: 'THL',
    source: 'native',
    token_type: {
      account_address:
        '0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615',
      module_name: 'thl_coin',
      struct_name: 'THL',
      type: '0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL',
    },
    unique_index: 129,
  },
  {
    coingecko_id: 'mover-xyz',
    decimals: 8,
    extensions: {
      data: [],
    },
    hippo_symbol: 'MOVER',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/MOVER.svg',
    name: 'Mover',
    official_symbol: 'MOVER',
    pancake_symbol: 'MOVER',
    permissioned_listing: true,
    project_url: 'https://mov3r.xyz/',
    symbol: 'MOVER',
    source: 'native',
    token_type: {
      account_address:
        '0x14b0ef0ec69f346bea3dfa0c5a8c3942fb05c08760059948f9f24c02cd0d4fd8',
      module_name: 'mover_token',
      struct_name: 'Mover',
      type: '0x14b0ef0ec69f346bea3dfa0c5a8c3942fb05c08760059948f9f24c02cd0d4fd8::mover_token::Mover',
    },
    unique_index: 131,
  },
  {
    coingecko_id: 'wtbt',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wwTBT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/WTBT.svg',
    name: 'wTBT Pool',
    official_symbol: 'wTBT',
    pancake_symbol: 'whwTBT',
    permissioned_listing: true,
    project_url: 'https://www.tprotocol.io/',
    symbol: 'wTBT',
    source: 'wormhole',
    token_type: {
      account_address:
        '0xd916a950d4c1279df4aa0d6f32011842dc5c633a45c11ac5019232c159d115bb',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xd916a950d4c1279df4aa0d6f32011842dc5c633a45c11ac5019232c159d115bb::coin::T',
    },
    unique_index: 132,
  },
  {
    coingecko_id: 'ditto-staked-aptos',
    decimals: 8,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'stAPT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/DittoStakedAptos.svg',
    name: 'Ditto Staked Aptos',
    official_symbol: 'stAPT',
    pancake_symbol: 'stAPT',
    permissioned_listing: true,
    project_url: 'https://www.dittofinance.io/',
    symbol: 'stAPT',
    source: 'native',
    token_type: {
      account_address:
        '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5',
      module_name: 'staked_coin',
      struct_name: 'StakedAptos',
      type: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos',
    },
    unique_index: 156,
  },
  {
    coingecko_id: 'ditto-discount-token',
    decimals: 8,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'DTO',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/DTO.svg',
    name: 'Ditto Discount Token',
    official_symbol: 'DTO',
    pancake_symbol: 'DTO',
    permissioned_listing: true,
    project_url: 'https://www.dittofinance.io/',
    symbol: 'DTO',
    source: 'native',
    token_type: {
      account_address:
        '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5',
      module_name: 'ditto_discount_coin',
      struct_name: 'DittoDiscountCoin',
      type: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::ditto_discount_coin::DittoDiscountCoin',
    },
    unique_index: 191,
  },
  {
    coingecko_id: '',
    decimals: 6,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'APTOGE',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/APTOGE.svg',
    name: 'Aptoge',
    official_symbol: 'APTOGE',
    pancake_symbol: 'APTOGE',
    permissioned_listing: true,
    project_url: 'https://aptoge.com',
    symbol: 'APTOGE',
    source: 'native',
    token_type: {
      account_address:
        '0x5c738a5dfa343bee927c39ebe85b0ceb95fdb5ee5b323c95559614f5a77c47cf',
      module_name: 'Aptoge',
      struct_name: 'Aptoge',
      type: '0x5c738a5dfa343bee927c39ebe85b0ceb95fdb5ee5b323c95559614f5a77c47cf::Aptoge::Aptoge',
    },
    unique_index: 231,
  },
  {
    coingecko_id: '',
    decimals: 8,
    extensions: {
      data: [],
    },
    hippo_symbol: 'ETERN',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/ETERN.svg',
    name: 'Eternal Token',
    official_symbol: 'ETERN',
    pancake_symbol: 'ETERN',
    permissioned_listing: true,
    project_url: 'https://eternalfinance.io',
    symbol: 'ETERN',
    source: 'native',
    token_type: {
      account_address:
        '0x25a64579760a4c64be0d692327786a6375ec80740152851490cfd0b53604cf95',
      module_name: 'coin',
      struct_name: 'ETERN',
      type: '0x25a64579760a4c64be0d692327786a6375ec80740152851490cfd0b53604cf95::coin::ETERN',
    },
    unique_index: 256,
  },
  {
    coingecko_id: '',
    decimals: 6,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'USDA',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDA.svg',
    name: 'Argo USD',
    official_symbol: 'USDA',
    pancake_symbol: 'USDA',
    permissioned_listing: true,
    project_url: 'https://argo.fi/',
    symbol: 'USDA',
    source: 'native',
    token_type: {
      account_address:
        '0x1000000fa32d122c18a6a31c009ce5e71674f22d06a581bb0a15575e6addadcc',
      module_name: 'usda',
      struct_name: 'USDA',
      type: '0x1000000fa32d122c18a6a31c009ce5e71674f22d06a581bb0a15575e6addadcc::usda::USDA',
    },
    unique_index: 351,
  },
  {
    coingecko_id: 'pancakeswap-token',
    decimals: 8,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'CAKE',
    logo_url:
      'https://raw.githubusercontent.com/pancakeswap/pancake-frontend/develop/apps/aptos/public/images/cake.svg',
    name: 'PancakeSwap Token',
    official_symbol: 'CAKE',
    pancake_symbol: 'CAKE',
    permissioned_listing: true,
    project_url: 'https://pancakeswap.finance/',
    symbol: 'CAKE',
    source: 'native',
    token_type: {
      account_address:
        '0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6',
      module_name: 'oft',
      struct_name: 'CakeOFT',
      type: '0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT',
    },
    unique_index: 397,
  },
  {
    coingecko_id: 'doglaikacoin',
    decimals: 8,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'DLC',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/DLC.svg',
    name: 'Doglaika Coin',
    official_symbol: 'DLC',
    pancake_symbol: 'DLC',
    permissioned_listing: true,
    project_url: 'http://linktr.ee/doglaikacoin',
    symbol: 'DLC',
    source: 'native',
    token_type: {
      account_address:
        '0x84edd115c901709ef28f3cb66a82264ba91bfd24789500b6fd34ab9e8888e272',
      module_name: 'coin',
      struct_name: 'DLC',
      type: '0x84edd115c901709ef28f3cb66a82264ba91bfd24789500b6fd34ab9e8888e272::coin::DLC',
    },
    unique_index: 591,
  },
  {
    coingecko_id: '',
    decimals: 8,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'ANI',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/ANI.png',
    name: 'AnimeSwap Coin',
    official_symbol: 'ANI',
    pancake_symbol: 'ANI',
    permissioned_listing: true,
    project_url: 'http://animeswap.org/',
    symbol: 'ANI',
    source: 'native',
    token_type: {
      account_address:
        '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c',
      module_name: 'AnimeCoin',
      struct_name: 'ANI',
      type: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::AnimeCoin::ANI',
    },
    unique_index: 712,
  },
  {
    coingecko_id: '',
    decimals: 8,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'ABEL',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/ABEL.svg',
    name: 'Abel Coin',
    official_symbol: 'ABEL',
    pancake_symbol: 'ABEL',
    permissioned_listing: true,
    project_url: 'https://www.abelfinance.xyz/',
    symbol: 'ABEL',
    source: 'native',
    token_type: {
      account_address:
        '0x7c0322595a73b3fc53bb166f5783470afeb1ed9f46d1176db62139991505dc61',
      module_name: 'abel_coin',
      struct_name: 'AbelCoin',
      type: '0x7c0322595a73b3fc53bb166f5783470afeb1ed9f46d1176db62139991505dc61::abel_coin::AbelCoin',
    },
    unique_index: 790,
  },
  {
    coingecko_id: 'gari-network',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wGARI',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/GARI.svg',
    name: 'Gari',
    official_symbol: 'GARI',
    pancake_symbol: 'whGARI',
    permissioned_listing: true,
    project_url: 'https://gari.network',
    symbol: 'GARI',
    source: 'wormhole',
    token_type: {
      account_address:
        '0x4def3d3dee27308886f0a3611dd161ce34f977a9a5de4e80b237225923492a2a',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x4def3d3dee27308886f0a3611dd161ce34f977a9a5de4e80b237225923492a2a::coin::T',
    },
    unique_index: 800,
  },
  {
    coingecko_id: 'bluemove',
    decimals: 8,
    extensions: {
      data: [],
    },
    hippo_symbol: 'MOVE',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/MOVE.svg',
    name: 'BlueMove',
    official_symbol: 'MOVE',
    pancake_symbol: 'MOVE',
    permissioned_listing: true,
    project_url: 'https://bluemove.net/',
    symbol: 'MOVE',
    source: 'native',
    token_type: {
      account_address:
        '0x27fafcc4e39daac97556af8a803dbb52bcb03f0821898dc845ac54225b9793eb',
      module_name: 'move_coin',
      struct_name: 'MoveCoin',
      type: '0x27fafcc4e39daac97556af8a803dbb52bcb03f0821898dc845ac54225b9793eb::move_coin::MoveCoin',
    },
    unique_index: 912,
  },
  {
    coingecko_id: 'aptos-launch-token',
    decimals: 8,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'ALT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/Aptoslaunchlogob.svg',
    name: 'AptosLaunch Token',
    official_symbol: 'ALT',
    pancake_symbol: 'ALT',
    permissioned_listing: true,
    project_url: 'https://aptoslaunch.io',
    symbol: 'ALT',
    source: 'native',
    token_type: {
      account_address:
        '0xd0b4efb4be7c3508d9a26a9b5405cf9f860d0b9e5fe2f498b90e68b8d2cedd3e',
      module_name: 'aptos_launch_token',
      struct_name: 'AptosLaunchToken',
      type: '0xd0b4efb4be7c3508d9a26a9b5405cf9f860d0b9e5fe2f498b90e68b8d2cedd3e::aptos_launch_token::AptosLaunchToken',
    },
    unique_index: 928,
  },
  {
    coingecko_id: 'tortuga-staked-aptos',
    decimals: 8,
    extensions: {
      data: [['bridge', 'native']],
    },
    hippo_symbol: 'tAPT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/TortugaStakedAptos.png',
    name: 'Tortuga Staked Aptos',
    official_symbol: 'tAPT',
    pancake_symbol: 'tAPT',
    permissioned_listing: true,
    project_url: 'https://tortuga.finance/',
    symbol: 'tAPT',
    source: 'native',
    token_type: {
      account_address:
        '0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114',
      module_name: 'staked_aptos_coin',
      struct_name: 'StakedAptosCoin',
      type: '0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin',
    },
    unique_index: 952,
  },
  {
    coingecko_id: 'usd-coin',
    decimals: 6,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wUSDC',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDC.svg',
    name: 'USD Coin (Wormhole)',
    official_symbol: 'USDC',
    pancake_symbol: 'whUSDC',
    permissioned_listing: true,
    project_url: '',
    symbol: 'USDC',
    source: 'wormhole',
    token_type: {
      account_address:
        '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T',
    },
    unique_index: 2001,
  },
  {
    coingecko_id: 'tether',
    decimals: 6,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wUSDT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg',
    name: 'Tether USD (Wormhole)',
    official_symbol: 'USDT',
    pancake_symbol: 'whUSDT',
    permissioned_listing: true,
    project_url: '',
    symbol: 'USDT',
    source: 'wormhole',
    token_type: {
      account_address:
        '0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T',
    },
    unique_index: 2002,
  },
  {
    coingecko_id: 'wrapped-bitcoin',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wWBTC',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/BTC.webp',
    name: 'Wrapped BTC (Wormhole)',
    official_symbol: 'WBTC',
    pancake_symbol: 'whWBTC',
    permissioned_listing: true,
    project_url: '',
    symbol: 'WBTC',
    source: 'wormhole',
    token_type: {
      account_address:
        '0xae478ff7d83ed072dbc5e264250e67ef58f57c99d89b447efd8a0a2e8b2be76e',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xae478ff7d83ed072dbc5e264250e67ef58f57c99d89b447efd8a0a2e8b2be76e::coin::T',
    },
    unique_index: 2003,
  },
  {
    coingecko_id: 'weth',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wWETH',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/WETH.svg',
    name: 'Wrapped Ether (Wormhole)',
    official_symbol: 'WETH',
    pancake_symbol: 'whWETH',
    permissioned_listing: true,
    project_url: '',
    symbol: 'WETH',
    source: 'wormhole',
    token_type: {
      account_address:
        '0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T',
    },
    unique_index: 2004,
  },
  {
    coingecko_id: 'dai',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wDAI',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/DAI.webp',
    name: 'Dai Stablecoin (Wormhole)',
    official_symbol: 'DAI',
    pancake_symbol: 'whDAI',
    permissioned_listing: true,
    project_url: '',
    symbol: 'DAI',
    source: 'wormhole',
    token_type: {
      account_address:
        '0x407a220699982ebb514568d007938d2447d33667e4418372ffec1ddb24491b6c',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x407a220699982ebb514568d007938d2447d33667e4418372ffec1ddb24491b6c::coin::T',
    },
    unique_index: 2005,
  },
  {
    coingecko_id: 'binance-usd',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wBUSD',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/BUSD.webp',
    name: 'BUSD Token (Wormhole)',
    official_symbol: 'BUSD',
    pancake_symbol: 'whBUSD',
    permissioned_listing: true,
    project_url: '',
    symbol: 'BUSD',
    source: 'wormhole',
    token_type: {
      account_address:
        '0xccc9620d38c4f3991fa68a03ad98ef3735f18d04717cb75d7a1300dd8a7eed75',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xccc9620d38c4f3991fa68a03ad98ef3735f18d04717cb75d7a1300dd8a7eed75::coin::T',
    },
    unique_index: 2006,
  },
  {
    coingecko_id: 'binancecoin',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wWBNB',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/BNB.webp',
    name: 'Wrapped BNB (Wormhole)',
    official_symbol: 'WBNB',
    pancake_symbol: 'whWBNB',
    permissioned_listing: true,
    project_url: '',
    symbol: 'WBNB',
    source: 'wormhole',
    token_type: {
      account_address:
        '0x6312bc0a484bc4e37013befc9949df2d7c8a78e01c6fe14a34018449d136ba86',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x6312bc0a484bc4e37013befc9949df2d7c8a78e01c6fe14a34018449d136ba86::coin::T',
    },
    unique_index: 2009,
  },
  {
    coingecko_id: 'solana',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole-solana']],
    },
    hippo_symbol: 'wSOL',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/SOL.webp',
    name: 'SOL (Wormhole)',
    official_symbol: 'SOL',
    pancake_symbol: 'whSOL',
    permissioned_listing: true,
    project_url: '',
    symbol: 'SOL',
    source: 'wormhole',
    token_type: {
      account_address:
        '0xdd89c0e695df0692205912fb69fc290418bed0dbe6e4573d744a6d5e6bab6c13',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xdd89c0e695df0692205912fb69fc290418bed0dbe6e4573d744a6d5e6bab6c13::coin::T',
    },
    unique_index: 2011,
  },
  {
    coingecko_id: 'tether',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole-bsc']],
    },
    hippo_symbol: 'USDTbs',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg',
    name: 'Tether USD',
    official_symbol: 'USDT',
    pancake_symbol: 'USDTbs',
    permissioned_listing: true,
    project_url: '',
    symbol: 'USDTbs',
    source: 'wormhole-bsc',
    token_type: {
      account_address:
        '0xacd014e8bdf395fa8497b6d585b164547a9d45269377bdf67c96c541b7fec9ed',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xacd014e8bdf395fa8497b6d585b164547a9d45269377bdf67c96c541b7fec9ed::coin::T',
    },
    unique_index: 2050,
  },
  {
    coingecko_id: '',
    decimals: 6,
    extensions: {
      data: [['bridge', 'wormhole-solana']],
    },
    hippo_symbol: 'USDCso',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDC.svg',
    name: 'USD Coin (Wormhole Solana)',
    official_symbol: 'USDC',
    pancake_symbol: 'USDCso',
    permissioned_listing: true,
    project_url: '',
    symbol: 'USDCso',
    source: 'wormhole-solana',
    token_type: {
      account_address:
        '0xc91d826e29a3183eb3b6f6aa3a722089fdffb8e9642b94c5fcd4c48d035c0080',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xc91d826e29a3183eb3b6f6aa3a722089fdffb8e9642b94c5fcd4c48d035c0080::coin::T',
    },
    unique_index: 2113,
  },
  {
    coingecko_id: 'usd-coin',
    decimals: 6,
    extensions: {
      data: [['bridge', 'wormhole-polygon']],
    },
    hippo_symbol: 'USDCpo',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDC.svg',
    name: 'USD Coin (Wormhole Polygon)',
    official_symbol: 'USDC',
    pancake_symbol: 'USDCpo',
    permissioned_listing: true,
    project_url: '',
    symbol: 'USDCpo',
    source: 'wormhole-polygon',
    token_type: {
      account_address:
        '0xc7160b1c2415d19a88add188ec726e62aab0045f0aed798106a2ef2994a9101e',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xc7160b1c2415d19a88add188ec726e62aab0045f0aed798106a2ef2994a9101e::coin::T',
    },
    unique_index: 2171,
  },
  {
    coingecko_id: 'usd-coin',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole-bsc']],
    },
    hippo_symbol: 'USDCbs',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDC.svg',
    name: 'USD Coin (Wormhole, BSC)',
    official_symbol: 'USDC',
    pancake_symbol: 'USDCbs',
    permissioned_listing: true,
    project_url: '',
    symbol: 'USDCbs',
    source: 'wormhole-bsc',
    token_type: {
      account_address:
        '0x79a6ed7a0607fdad2d18d67d1a0e552d4b09ebce5951f1e5c851732c02437595',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x79a6ed7a0607fdad2d18d67d1a0e552d4b09ebce5951f1e5c851732c02437595::coin::T',
    },
    unique_index: 2202,
  },
  {
    coingecko_id: 'usd-coin',
    decimals: 6,
    extensions: {
      data: [['bridge', 'wormhole-avalanche']],
    },
    hippo_symbol: 'USDCav',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDC.svg',
    name: 'USD Coin (Wormhole Avalanche)',
    official_symbol: 'USDC',
    pancake_symbol: 'USDCav',
    permissioned_listing: true,
    project_url: '',
    symbol: 'USDCav',
    source: 'wormhole-avalanche',
    token_type: {
      account_address:
        '0x39d84c2af3b0c9895b45d4da098049e382c451ba63bec0ce0396ff7af4bb5dff',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x39d84c2af3b0c9895b45d4da098049e382c451ba63bec0ce0396ff7af4bb5dff::coin::T',
    },
    unique_index: 2304,
  },
  {
    coingecko_id: 'avalanche-2',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wWAVAX',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/AVAX.webp',
    name: 'Wrapped AVAX (Wormhole)',
    official_symbol: 'WAVAX',
    pancake_symbol: 'whWAVAX',
    permissioned_listing: true,
    project_url: '',
    symbol: 'WAVAX',
    source: 'wormhole',
    token_type: {
      account_address:
        '0x5b1bbc25524d41b17a95dac402cf2f584f56400bf5cc06b53c36b331b1ec6e8f',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x5b1bbc25524d41b17a95dac402cf2f584f56400bf5cc06b53c36b331b1ec6e8f::coin::T',
    },
    unique_index: 2332,
  },
  {
    coingecko_id: 'sweatcoin',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wSWEAT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/SWEAT.webp',
    name: 'SWEAT',
    official_symbol: 'SWEAT',
    pancake_symbol: 'whSWEAT',
    permissioned_listing: true,
    project_url: '',
    symbol: 'SWEAT',
    source: 'wormhole',
    token_type: {
      account_address:
        '0x9aa4c03344444b53f4d9b1bca229ed2ac47504e3ea6cd0683ebdc0c5ecefd693',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x9aa4c03344444b53f4d9b1bca229ed2ac47504e3ea6cd0683ebdc0c5ecefd693::coin::T',
    },
    unique_index: 2409,
  },
  {
    coingecko_id: 'near',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wNEAR',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/NEAR.webp',
    name: 'NEAR (Wormhole)',
    official_symbol: 'NEAR',
    pancake_symbol: 'whNEAR',
    permissioned_listing: true,
    project_url: '',
    symbol: 'NEAR',
    source: 'wormhole',
    token_type: {
      account_address:
        '0x394205c024d8e932832deef4cbfc7d3bb17ff2e9dc184fa9609405c2836b94aa',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x394205c024d8e932832deef4cbfc7d3bb17ff2e9dc184fa9609405c2836b94aa::coin::T',
    },
    unique_index: 2492,
  },
  {
    coingecko_id: 'nexum',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wNEXM',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/NEXM.webp',
    name: 'Nexum Coin',
    official_symbol: 'NEXM',
    pancake_symbol: 'whNEXM',
    permissioned_listing: true,
    project_url: '',
    symbol: 'NEXM',
    source: 'wormhole',
    token_type: {
      account_address:
        '0x1f9dca8eb42832b9ea07a804d745ef08833051e0c75c45b82665ef6f6e7fac32',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x1f9dca8eb42832b9ea07a804d745ef08833051e0c75c45b82665ef6f6e7fac32::coin::T',
    },
    unique_index: 2527,
  },
  {
    coingecko_id: 'sushi',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wSUSHI',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/SUSHI.webp',
    name: 'SushiToken (Wormhole)',
    official_symbol: 'SUSHI',
    pancake_symbol: 'whSUSHI',
    permissioned_listing: true,
    project_url: '',
    symbol: 'SUSHI',
    source: 'wormhole',
    token_type: {
      account_address:
        '0x2305dd96edd8debb5a2049be54379c74e61b37ceb54a49bd7dee4726d2a6b689',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x2305dd96edd8debb5a2049be54379c74e61b37ceb54a49bd7dee4726d2a6b689::coin::T',
    },
    unique_index: 2700,
  },
  {
    coingecko_id: 'celo',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wCELO',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/CELO.webp',
    name: 'Celo (Wormhole)',
    official_symbol: 'CELO',
    pancake_symbol: 'whCELO',
    permissioned_listing: true,
    project_url: '',
    symbol: 'CELO',
    source: 'wormhole',
    token_type: {
      account_address:
        '0xac0c3c35d50f6ef00e3b4db6998732fe9ed6331384925fe8ec95fcd7745a9112',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xac0c3c35d50f6ef00e3b4db6998732fe9ed6331384925fe8ec95fcd7745a9112::coin::T',
    },
    unique_index: 2801,
  },
  {
    coingecko_id: 'ftx-token',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wFTT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/FTXToken.webp',
    name: 'FTX Token',
    official_symbol: 'FTT',
    pancake_symbol: 'whFTT',
    permissioned_listing: true,
    project_url: '',
    symbol: 'FTT',
    source: 'wormhole',
    token_type: {
      account_address:
        '0x419d16ebaeda8dc374b1178a61d24fb699799d55a3f475f427998769c537b51b',
      module_name: 'coin',
      struct_name: 'T',
      type: '0x419d16ebaeda8dc374b1178a61d24fb699799d55a3f475f427998769c537b51b::coin::T',
    },
    unique_index: 2971,
  },
  {
    coingecko_id: 'chain-2',
    decimals: 8,
    extensions: {
      data: [['bridge', 'wormhole']],
    },
    hippo_symbol: 'wXCN',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/XCN.webp',
    name: 'Chain',
    official_symbol: 'XCN',
    pancake_symbol: 'whXCN',
    permissioned_listing: true,
    project_url: '',
    symbol: 'XCN',
    source: 'wormhole',
    token_type: {
      account_address:
        '0xcefd39b563951a9ec2670aa57086f9adb3493671368ea60ff99e0bc98f697bb5',
      module_name: 'coin',
      struct_name: 'T',
      type: '0xcefd39b563951a9ec2670aa57086f9adb3493671368ea60ff99e0bc98f697bb5::coin::T',
    },
    unique_index: 2991,
  },
  {
    coingecko_id: 'usd-coin',
    decimals: 6,
    extensions: {
      data: [['bridge', 'layerzero']],
    },
    hippo_symbol: 'zUSDC',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDC.svg',
    name: 'USD Coin (LayerZero)',
    official_symbol: 'USDC',
    pancake_symbol: 'lzUSDC',
    permissioned_listing: true,
    project_url: '',
    symbol: 'zUSDC',
    source: 'layerzero',
    token_type: {
      account_address:
        '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa',
      module_name: 'asset',
      struct_name: 'USDC',
      type: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
    },
    unique_index: 3001,
  },
  {
    coingecko_id: 'tether',
    decimals: 6,
    extensions: {
      data: [['bridge', 'layerzero']],
    },
    hippo_symbol: 'zUSDT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg',
    name: 'USD Tether (LayerZero)',
    official_symbol: 'USDT',
    pancake_symbol: 'lzUSDT',
    permissioned_listing: true,
    project_url: '',
    symbol: 'zUSDT',
    source: 'layerzero',
    token_type: {
      account_address:
        '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa',
      module_name: 'asset',
      struct_name: 'USDT',
      type: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
    },
    unique_index: 3002,
  },
  {
    coingecko_id: 'weth',
    decimals: 6,
    extensions: {
      data: [['bridge', 'layerzero']],
    },
    hippo_symbol: 'zWETH',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/WETH.svg',
    name: 'Wrapped Ether (LayerZero)',
    official_symbol: 'WETH',
    pancake_symbol: 'lzWETH',
    permissioned_listing: true,
    project_url: '',
    symbol: 'zWETH',
    source: 'layerzero',
    token_type: {
      account_address:
        '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa',
      module_name: 'asset',
      struct_name: 'WETH',
      type: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH',
    },
    unique_index: 3004,
  },
  {
    coingecko_id: 'usd-coin',
    decimals: 6,
    extensions: {
      data: [['bridge', 'celer']],
    },
    hippo_symbol: 'ceUSDC',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDC.svg',
    name: 'USD Coin (Celer)',
    official_symbol: 'USDC',
    pancake_symbol: 'ceUSDC',
    permissioned_listing: true,
    project_url: 'https://celer.network',
    symbol: 'ceUSDC',
    source: 'celer',
    token_type: {
      account_address:
        '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d',
      module_name: 'celer_coin_manager',
      struct_name: 'UsdcCoin',
      type: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin',
    },
    unique_index: 4001,
  },
  {
    coingecko_id: 'tether',
    decimals: 6,
    extensions: {
      data: [['bridge', 'celer']],
    },
    hippo_symbol: 'ceUSDT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg',
    name: 'Tether USD (Celer)',
    official_symbol: 'USDT',
    pancake_symbol: 'ceUSDT',
    permissioned_listing: true,
    project_url: 'https://celer.network',
    symbol: 'ceUSDT',
    source: 'celer',
    token_type: {
      account_address:
        '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d',
      module_name: 'celer_coin_manager',
      struct_name: 'UsdtCoin',
      type: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin',
    },
    unique_index: 4002,
  },
  {
    coingecko_id: 'wrapped-bitcoin',
    decimals: 8,
    extensions: {
      data: [['bridge', 'celer']],
    },
    hippo_symbol: 'ceWBTC',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/WBTC.svg',
    name: 'Wrapped BTC (Celer)',
    official_symbol: 'WBTC',
    pancake_symbol: 'ceWBTC',
    permissioned_listing: true,
    project_url: 'https://celer.network',
    symbol: 'ceWBTC',
    source: 'celer',
    token_type: {
      account_address:
        '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d',
      module_name: 'celer_coin_manager',
      struct_name: 'WbtcCoin',
      type: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WbtcCoin',
    },
    unique_index: 4003,
  },
  {
    coingecko_id: 'ethereum',
    decimals: 8,
    extensions: {
      data: [['bridge', 'celer']],
    },
    hippo_symbol: 'ceWETH',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/WETH.svg',
    name: 'Wrapped Ether (Celer)',
    official_symbol: 'WETH',
    pancake_symbol: 'ceWETH',
    permissioned_listing: true,
    project_url: 'https://celer.network',
    symbol: 'ceWETH',
    source: 'celer',
    token_type: {
      account_address:
        '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d',
      module_name: 'celer_coin_manager',
      struct_name: 'WethCoin',
      type: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin',
    },
    unique_index: 4004,
  },
  {
    coingecko_id: 'dai',
    decimals: 8,
    extensions: {
      data: [['bridge', 'celer']],
    },
    hippo_symbol: 'ceDAI',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/DAI.svg',
    name: 'Dai Stablecoin (Celer)',
    official_symbol: 'DAI',
    pancake_symbol: 'ceDAI',
    permissioned_listing: true,
    project_url: 'https://celer.network',
    symbol: 'ceDAI',
    source: 'celer',
    token_type: {
      account_address:
        '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d',
      module_name: 'celer_coin_manager',
      struct_name: 'DaiCoin',
      type: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::DaiCoin',
    },
    unique_index: 4005,
  },
  {
    coingecko_id: 'binancecoin',
    decimals: 8,
    extensions: {
      data: [['bridge', 'celer']],
    },
    hippo_symbol: 'ceBNB',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/BNB.svg',
    name: 'Binance Coin (Celer)',
    official_symbol: 'BNB',
    pancake_symbol: 'ceBNB',
    permissioned_listing: true,
    project_url: 'https://celer.network',
    symbol: 'ceBNB',
    source: 'celer',
    token_type: {
      account_address:
        '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d',
      module_name: 'celer_coin_manager',
      struct_name: 'BnbCoin',
      type: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BnbCoin',
    },
    unique_index: 4113,
  },
  {
    coingecko_id: 'binance-usd',
    decimals: 8,
    extensions: {
      data: [['bridge', 'celer']],
    },
    hippo_symbol: 'ceBUSD',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/BUSD.svg',
    name: 'Binance USD (Celer)',
    official_symbol: 'BUSD',
    pancake_symbol: 'ceBUSD',
    permissioned_listing: true,
    project_url: 'https://celer.network',
    symbol: 'ceBUSD',
    source: 'celer',
    token_type: {
      account_address:
        '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d',
      module_name: 'celer_coin_manager',
      struct_name: 'BusdCoin',
      type: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BusdCoin',
    },
    unique_index: 4119,
  },
  {
    coingecko_id: 'usd-coin',
    decimals: 6,
    extensions: {
      data: [['bridge', 'multichain']],
    },
    hippo_symbol: 'multiUSDC',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDC.svg',
    name: 'USD Coin (Multichain)',
    official_symbol: 'USDC',
    pancake_symbol: 'multiUSDC',
    permissioned_listing: true,
    project_url: 'https://multichain.org/',
    symbol: 'multiUSDC',
    source: 'multichain',
    token_type: {
      account_address:
        '0xd6d6372c8bde72a7ab825c00b9edd35e643fb94a61c55d9d94a9db3010098548',
      module_name: 'USDC',
      struct_name: 'Coin',
      type: '0xd6d6372c8bde72a7ab825c00b9edd35e643fb94a61c55d9d94a9db3010098548::USDC::Coin',
    },
    unique_index: 5001,
  },
  {
    coingecko_id: '',
    decimals: 8,
    extensions: {
      data: [],
    },
    hippo_symbol: 'XBTC',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/XBTC.svg',
    name: 'XBTC',
    official_symbol: 'XBTC',
    pancake_symbol: 'XBTC',
    permissioned_listing: true,
    project_url: 'https://github.com/OmniBTC/OmniBridge',
    symbol: 'XBTC',
    source: 'omnibridge',
    token_type: {
      account_address:
        '0x3b0a7c06837e8fbcce41af0e629fdc1f087b06c06ff9e86f81910995288fd7fb',
      module_name: 'xbtc',
      struct_name: 'XBTC',
      type: '0x3b0a7c06837e8fbcce41af0e629fdc1f087b06c06ff9e86f81910995288fd7fb::xbtc::XBTC',
    },
    unique_index: 5003,
  },
  {
    coingecko_id: '',
    decimals: 8,
    extensions: {
      data: [
        ['lp', 'aries'],
        ['bridge', 'native'],
      ],
    },
    hippo_symbol: 'ar-APT',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/ar-APT.svg',
    name: 'Aries Aptos Coin LP Token',
    official_symbol: 'aAPT',
    pancake_symbol: 'ar-APT',
    permissioned_listing: true,
    project_url: 'https://ariesmarkets.xyz/',
    symbol: 'ar-APT',
    source: 'native',
    token_type: {
      account_address:
        '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3',
      module_name: 'reserve',
      struct_name: 'LP<0x1::aptos_coin::AptosCoin>',
      type: '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::reserve::LP<0x1::aptos_coin::AptosCoin>',
    },
    unique_index: 15338,
  },
  {
    coingecko_id: '',
    decimals: 8,
    extensions: {
      data: [
        ['lp', 'aries'],
        ['bridge', 'native'],
      ],
    },
    hippo_symbol: 'ar-SOL',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/ar-SOL.svg',
    name: 'Aries Solana (Wormhole) LP Token',
    official_symbol: 'aSOL',
    pancake_symbol: 'ar-SOL',
    permissioned_listing: true,
    project_url: 'https://ariesmarkets.xyz/',
    symbol: 'ar-SOL',
    source: 'native',
    token_type: {
      account_address:
        '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3',
      module_name: 'reserve',
      struct_name:
        'LP<0xdd89c0e695df0692205912fb69fc290418bed0dbe6e4573d744a6d5e6bab6c13::coin::T>',
      type: '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::reserve::LP<0xdd89c0e695df0692205912fb69fc290418bed0dbe6e4573d744a6d5e6bab6c13::coin::T>',
    },
    unique_index: 15339,
  },
  {
    coingecko_id: '',
    decimals: 6,
    extensions: {
      data: [
        ['lp', 'aries'],
        ['bridge', 'native'],
      ],
    },
    hippo_symbol: 'ar-zUSDC',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/ar-USDC.svg',
    name: 'Aries USDC (Layerzero) LP Token',
    official_symbol: 'aUSDC',
    pancake_symbol: 'ar-zUSDC',
    permissioned_listing: true,
    project_url: 'https://ariesmarkets.xyz/',
    symbol: 'ar-zUSDC',
    source: 'native',
    token_type: {
      account_address:
        '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3',
      module_name: 'reserve',
      struct_name:
        'LP<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
      type: '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::reserve::LP<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
    },
    unique_index: 15340,
  },
  {
    coingecko_id: '',
    decimals: 6,
    extensions: {
      data: [
        ['lp', 'aries'],
        ['bridge', 'native'],
      ],
    },
    hippo_symbol: 'ar-USDC',
    logo_url:
      'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/ar-USDC.svg',
    name: 'Aries USDC (Wormhole) LP Token',
    official_symbol: 'aUSDC',
    pancake_symbol: 'ar-USDC',
    permissioned_listing: true,
    project_url: 'https://ariesmarkets.xyz/',
    symbol: 'ar-USDC',
    source: 'native',
    token_type: {
      account_address:
        '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3',
      module_name: 'reserve',
      struct_name:
        'LP<0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>',
      type: '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::reserve::LP<0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>',
    },
    unique_index: 15341,
  },
];

export default rawInfoMainnet;
