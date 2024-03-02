// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { transformPetraActivity } from './transform';
import { StakeEvent } from './types';

const addStakeEvent = {
  amount: '5000000000',
  delegator_address:
    '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
  event_index: 5,
  event_type: '0x1::delegation_pool::AddStakeEvent',
  pool_address:
    '0xcd3cdfbd25f69dd03f2a5697445a914b54eb9c687dffe4f0f98c03a70728a18d',
  transaction_version: 585045416,
};

const unlockStakeEvent = {
  amount: '7300046211',
  delegator_address:
    '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
  event_index: 2,
  event_type: '0x1::delegation_pool::UnlockStakeEvent',
  pool_address:
    '0xbd50bb20e1972747db365c3a6e31255d78867c6b8df9877ea6054bb335dd6031',
  transaction_version: 585045103,
};

const withdrawEventBig = {
  amount: '5000000000',
  delegator_address:
    '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
  event_index: 10,
  event_type: '0x1::delegation_pool::WithdrawStakeEvent',
  pool_address:
    '0xcd3cdfbd25f69dd03f2a5697445a914b54eb9c687dffe4f0f98c03a70728a18d',
  transaction_version: 585085307,
};

const withdrawEventSmall = {
  amount: '3000',
  delegator_address:
    '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
  event_index: 4,
  event_type: '0x1::delegation_pool::WithdrawStakeEvent',
  pool_address:
    '0xcd3cdfbd25f69dd03f2a5697445a914b54eb9c687dffe4f0f98c03a70728a18d',
  transaction_version: 585085307,
};

describe(transformPetraActivity, () => {
  test('send APT coin', () => {
    const petraActivity = {
      account_address:
        '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: '54100',
          aptos_names: [],
          block_height: 1499010,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
          event_creation_number: -1,
          event_sequence_number: 0,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
          transaction_timestamp: '2022-10-20T04:01:35',
          transaction_version: 4980001,
        },
        {
          activity_type: '0x1::coin::WithdrawEvent',
          amount: '2440000',
          aptos_names: [],
          block_height: 1499010,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
          event_creation_number: 3,
          event_sequence_number: 0,
          is_gas_fee: false,
          is_transaction_success: true,
          owner_address:
            '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
          transaction_timestamp: '2022-10-20T04:01:35',
          transaction_version: 4980001,
        },
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: '2440000',
          aptos_names: [],
          block_height: 1499010,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xbf3cb724ea6eae637284c0a3ac0937c8e961c9720505372ec5903d7a9ad016c4',
          event_creation_number: 2,
          event_sequence_number: 18,
          is_gas_fee: false,
          is_transaction_success: true,
          owner_address:
            '0xbf3cb724ea6eae637284c0a3ac0937c8e961c9720505372ec5903d7a9ad016c4',
          transaction_timestamp: '2022-10-20T04:01:35',
          transaction_version: 4980001,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [],
      transaction_version: 4980001n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'send',
        account:
          '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
        amount: 2440000n,
        coin: '0x1::aptos_coin::AptosCoin',
        eventIndex: 0,
        gas: 54100n,
        receiver: {
          address:
            '0xbf3cb724ea6eae637284c0a3ac0937c8e961c9720505372ec5903d7a9ad016c4',
          undefined,
        },
        success: true,
        timestamp: new Date('2022-10-20T04:01:35.000Z'),
        version: 4980001n,
      },
    ]);
  });

  test('send APT to self', () => {
    const petraActivity = {
      account_address:
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 750,
          aptos_names: [],
          block_height: 70205098,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: -1,
          event_sequence_number: 808,
          is_gas_fee: true,
          is_transaction_success: true,
          transaction_timestamp: '2023-03-22T05:17:30',
          transaction_version: 473171426,
        },
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: 717,
          aptos_names: [],
          block_height: 70205098,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: 2,
          event_sequence_number: 298,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-03-22T05:17:30',
          transaction_version: 473171426,
        },
        {
          activity_type: '0x1::coin::WithdrawEvent',
          amount: 717,
          aptos_names: [],
          block_height: 70205098,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: 3,
          event_sequence_number: 679,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-03-22T05:17:30',
          transaction_version: 473171426,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [],
      transaction_version: 473171426n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'send',
        account:
          '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
        amount: 717n,
        coin: '0x1::aptos_coin::AptosCoin',
        eventIndex: 0,
        gas: 750n,
        receiver: {
          address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          undefined,
        },
        success: true,
        timestamp: new Date('2023-03-22T05:17:30.000Z'),
        version: 473171426n,
      },
    ]);
  });

  test('receive APT coin', () => {
    const petraActivity = {
      account_address:
        '0x8b07c2d4f8a09e96b520bb717d79423a84d24243b92360c16ab213228e066e48',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 58500,
          aptos_names: [],
          block_height: 35873088,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::aptos_account::transfer',
          event_account_address:
            '0xa4e7455d27731ab857e9701b1e6ed72591132b909fe6e4fd99b66c1d6318d9e8',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 9901,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0xa4e7455d27731ab857e9701b1e6ed72591132b909fe6e4fd99b66c1d6318d9e8',
          transaction_timestamp: '2023-02-27T20:09:29',
          transaction_version: 94385797,
        },
        {
          activity_type: '0x1::coin::WithdrawEvent',
          amount: 823045267,
          aptos_names: [],
          block_height: 35873088,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::aptos_account::transfer',
          event_account_address:
            '0xa4e7455d27731ab857e9701b1e6ed72591132b909fe6e4fd99b66c1d6318d9e8',
          event_creation_number: 3,
          event_index: 0,
          event_sequence_number: 9901,
          is_gas_fee: false,
          is_transaction_success: true,
          owner_address:
            '0xa4e7455d27731ab857e9701b1e6ed72591132b909fe6e4fd99b66c1d6318d9e8',
          transaction_timestamp: '2023-02-27T20:09:29',
          transaction_version: 94385797,
        },
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: 823045267,
          aptos_names: [],
          block_height: 35873088,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::aptos_account::transfer',
          event_account_address:
            '0x8b07c2d4f8a09e96b520bb717d79423a84d24243b92360c16ab213228e066e48',
          event_creation_number: 2,
          event_index: 1,
          event_sequence_number: 0,
          is_gas_fee: false,
          is_transaction_success: true,
          owner_address:
            '0x8b07c2d4f8a09e96b520bb717d79423a84d24243b92360c16ab213228e066e48',
          transaction_timestamp: '2023-02-27T20:09:29',
          transaction_version: 94385797,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [],
      transaction_version: 94385797n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'receive',
        account:
          '0x8b07c2d4f8a09e96b520bb717d79423a84d24243b92360c16ab213228e066e48',
        amount: 823045267n,
        coin: '0x1::aptos_coin::AptosCoin',
        eventIndex: 0,
        gas: 58500n,
        sender: {
          address:
            '0xa4e7455d27731ab857e9701b1e6ed72591132b909fe6e4fd99b66c1d6318d9e8',
          undefined,
        },
        success: true,
        timestamp: new Date('2023-02-27T20:09:29.000Z'),
        version: 94385797n,
      },
    ]);
  });

  test('send non-APT coin', () => {
    const petraActivity = {
      account_address:
        '0x2a9a67573931fbfbc57abc5c0665526320520205a8c230fb7dfc2e55ef3647e7',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 54641,
          aptos_names: [],
          block_height: 3600515,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0x2a9a67573931fbfbc57abc5c0665526320520205a8c230fb7dfc2e55ef3647e7',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 1,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0x2a9a67573931fbfbc57abc5c0665526320520205a8c230fb7dfc2e55ef3647e7',
          transaction_timestamp: '2022-10-26T06:40:28',
          transaction_version: 13233497,
        },
        {
          activity_type: '0x1::coin::WithdrawEvent',
          amount: 30000,
          aptos_names: [],
          block_height: 3600515,
          coin_type:
            '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0x2a9a67573931fbfbc57abc5c0665526320520205a8c230fb7dfc2e55ef3647e7',
          event_creation_number: 5,
          event_index: 0,
          event_sequence_number: 0,
          is_gas_fee: false,
          is_transaction_success: true,
          owner_address:
            '0x2a9a67573931fbfbc57abc5c0665526320520205a8c230fb7dfc2e55ef3647e7',
          transaction_timestamp: '2022-10-26T06:40:28',
          transaction_version: 13233497,
        },
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: 30000,
          aptos_names: [],
          block_height: 3600515,
          coin_type:
            '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0x22a8d5fd9b8f092a49cc2c5f4ddd4655586da1803099eac154a763995f72a18f',
          event_creation_number: 6,
          event_index: 1,
          event_sequence_number: 1,
          is_gas_fee: false,
          is_transaction_success: true,
          owner_address:
            '0x22a8d5fd9b8f092a49cc2c5f4ddd4655586da1803099eac154a763995f72a18f',
          transaction_timestamp: '2022-10-26T06:40:28',
          transaction_version: 13233497,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [],
      transaction_version: 13233497n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'send',
        account:
          '0x2a9a67573931fbfbc57abc5c0665526320520205a8c230fb7dfc2e55ef3647e7',
        amount: 30000n,
        coin: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH',
        eventIndex: 0,
        gas: 54641n,
        receiver: {
          address:
            '0x22a8d5fd9b8f092a49cc2c5f4ddd4655586da1803099eac154a763995f72a18f',
          undefined,
        },
        success: true,
        timestamp: new Date('2022-10-26T06:40:28.000Z'),
        version: 13233497n,
      },
    ]);
  });

  test('receive non-APT coin', () => {
    const petraActivity = {
      account_address:
        '0xe4e8c98a57100f1efcdaecd6e64b9bc0bfcc55df8b0cb9ba1f1a833e073aaf0f',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 54100,
          aptos_names: [],
          block_height: 3605103,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xd0d5e22822a25dd360ef99eec662b3d596f7068739207dc2ab0efcfac04bac20',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 4,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0xd0d5e22822a25dd360ef99eec662b3d596f7068739207dc2ab0efcfac04bac20',
          transaction_timestamp: '2022-10-26T06:59:08',
          transaction_version: 13248109,
        },
        {
          activity_type: '0x1::coin::WithdrawEvent',
          amount: 5000000,
          aptos_names: [],
          block_height: 3605103,
          coin_type:
            '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xd0d5e22822a25dd360ef99eec662b3d596f7068739207dc2ab0efcfac04bac20',
          event_creation_number: 5,
          event_index: 0,
          event_sequence_number: 1,
          is_gas_fee: false,
          is_transaction_success: true,
          owner_address:
            '0xd0d5e22822a25dd360ef99eec662b3d596f7068739207dc2ab0efcfac04bac20',
          transaction_timestamp: '2022-10-26T06:59:08',
          transaction_version: 13248109,
        },
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: 5000000,
          aptos_names: [],
          block_height: 3605103,
          coin_type:
            '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xe4e8c98a57100f1efcdaecd6e64b9bc0bfcc55df8b0cb9ba1f1a833e073aaf0f',
          event_creation_number: 11,
          event_index: 1,
          event_sequence_number: 2,
          is_gas_fee: false,
          is_transaction_success: true,
          owner_address:
            '0xe4e8c98a57100f1efcdaecd6e64b9bc0bfcc55df8b0cb9ba1f1a833e073aaf0f',
          transaction_timestamp: '2022-10-26T06:59:08',
          transaction_version: 13248109,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [],
      transaction_version: 13248109n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'receive',
        account:
          '0xe4e8c98a57100f1efcdaecd6e64b9bc0bfcc55df8b0cb9ba1f1a833e073aaf0f',
        amount: 5000000n,
        coin: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
        eventIndex: 0,
        gas: 54100n,
        sender: {
          address:
            '0xd0d5e22822a25dd360ef99eec662b3d596f7068739207dc2ab0efcfac04bac20',
          undefined,
        },
        success: true,
        timestamp: new Date('2022-10-26T06:59:08.000Z'),
        version: 13248109n,
      },
    ]);
  });

  test('swap two coins', () => {
    const petraActivity = {
      account_address:
        '0x6600dc68360eabff5931ab5180d3b6d8d75cd57f8b660cb1d4349b6ec82b894e',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 480700,
          aptos_names: [],
          block_height: 35864435,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str:
            '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::swap',
          event_account_address:
            '0x6600dc68360eabff5931ab5180d3b6d8d75cd57f8b660cb1d4349b6ec82b894e',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 34,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0x6600dc68360eabff5931ab5180d3b6d8d75cd57f8b660cb1d4349b6ec82b894e',
          transaction_timestamp: '2023-02-27T19:12:45',
          transaction_version: 94366409,
        },
        {
          activity_type: '0x1::coin::WithdrawEvent',
          amount: 21362666,
          aptos_names: [],
          block_height: 35864435,
          coin_type:
            '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
          entry_function_id_str:
            '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::swap',
          event_account_address:
            '0x6600dc68360eabff5931ab5180d3b6d8d75cd57f8b660cb1d4349b6ec82b894e',
          event_creation_number: 7,
          event_index: 0,
          event_sequence_number: 5,
          is_gas_fee: false,
          is_transaction_success: true,
          owner_address:
            '0x6600dc68360eabff5931ab5180d3b6d8d75cd57f8b660cb1d4349b6ec82b894e',
          transaction_timestamp: '2023-02-27T19:12:45',
          transaction_version: 94366409,
        },
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: 173317163,
          aptos_names: [],
          block_height: 35864435,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str:
            '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::swap',
          event_account_address:
            '0x6600dc68360eabff5931ab5180d3b6d8d75cd57f8b660cb1d4349b6ec82b894e',
          event_creation_number: 2,
          event_index: 4,
          event_sequence_number: 5,
          is_gas_fee: false,
          is_transaction_success: true,
          owner_address:
            '0x6600dc68360eabff5931ab5180d3b6d8d75cd57f8b660cb1d4349b6ec82b894e',
          transaction_timestamp: '2023-02-27T19:12:45',
          transaction_version: 94366409,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [],
      transaction_version: 94366409n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'swap',
        account:
          '0x6600dc68360eabff5931ab5180d3b6d8d75cd57f8b660cb1d4349b6ec82b894e',
        amount: 21362666n,
        coin: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
        eventIndex: 0,
        gas: 480700n,
        success: true,
        swapAmount: 173317163n,
        swapCoin: '0x1::aptos_coin::AptosCoin',
        timestamp: new Date('2023-02-27T19:12:45.000Z'),
        version: 94366409n,
      },
    ]);
  });

  test('miscellaneous gas fee', () => {
    const petraActivity = {
      account_address:
        '0x83a2858a223685160a38a45a89af1e309701383b78d99474f7f0e7cd3398caa6',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 99600,
          aptos_names: [],
          block_height: 1412651,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::managed_coin::register',
          event_account_address:
            '0x83a2858a223685160a38a45a89af1e309701383b78d99474f7f0e7cd3398caa6',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 0,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0x83a2858a223685160a38a45a89af1e309701383b78d99474f7f0e7cd3398caa6',
          transaction_timestamp: '2022-10-19T22:24:54',
          transaction_version: 4501292,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [],
      transaction_version: 4501292n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'gas',
        account:
          '0x83a2858a223685160a38a45a89af1e309701383b78d99474f7f0e7cd3398caa6',
        eventIndex: 0,
        gas: 99600n,
        success: true,
        timestamp: new Date('2022-10-19T22:24:54.000Z'),
        version: 4501292n,
      },
    ]);
  });

  test('sending a token (claimed by receiver)', () => {
    const petraActivity = {
      account_address:
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 184500,
          aptos_names: [],
          block_height: 62544529,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x3::token_transfers::claim_script',
          event_account_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 49,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          transaction_timestamp: '2023-02-27T18:32:36',
          transaction_version: 438554252,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
          collection_name: 'Aptos Names V1',
          creator_address:
            '0xf019d3c5901345a7f454848ce702943d1e629ded16a911f3b3b566a44ab1402d',
          current_token_data: {
            metadata_uri:
              'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
          },
          event_account_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          event_creation_number: 4,
          event_index: 0,
          event_sequence_number: 9,
          from_address: null,
          name: 'testingtesting1234.apt',
          property_version: 1,
          to_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          token_amount: 1,
          token_data_id_hash:
            '875b46e9f109652b5bdf7c366ebbd77c41e66c6fdee403737520257084fa794b',
          transaction_timestamp: '2023-02-27T18:32:36',
          transaction_version: 438554252,
          transfer_type: '0x3::token::DepositEvent',
        },
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
          collection_name: 'Aptos Names V1',
          creator_address:
            '0xf019d3c5901345a7f454848ce702943d1e629ded16a911f3b3b566a44ab1402d',
          current_token_data: {
            metadata_uri:
              'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
          },
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: 20,
          event_index: 1,
          event_sequence_number: 11,
          from_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          name: 'testingtesting1234.apt',
          property_version: 1,
          to_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          token_amount: 1,
          token_data_id_hash:
            '875b46e9f109652b5bdf7c366ebbd77c41e66c6fdee403737520257084fa794b',
          transaction_timestamp: '2023-02-27T18:32:36',
          transaction_version: 438554252,
          transfer_type: '0x3::token_transfers::TokenClaimEvent',
        },
      ],
      transaction_version: 438554252n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'send_token',
        account:
          '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
        collection: 'Aptos Names V1',
        eventIndex: 0,
        gas: 184500n,
        name: 'testingtesting1234.apt',
        receiver: {
          address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          undefined,
        },
        success: true,
        timestamp: new Date('2023-02-27T18:32:36.000Z'),
        uri: 'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
        version: 438554252n,
      },
    ]);
  });

  test('sending a token (direct transfer)', () => {
    const petraActivity = {
      account_address:
        '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 191700,
          aptos_names: [],
          block_height: 63237668,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x3::token::transfer_with_opt_in',
          event_account_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 2,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          transaction_timestamp: '2023-03-01T09:52:01',
          transaction_version: 442086400,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            '8f6a8bf15fbb932cf8252d80ece592dd92b507a9e8bff4e9b2d211d6019c6f45',
          collection_name: 'Savage Nation',
          creator_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          current_token_data: {
            metadata_uri:
              'https://firebasestorage.googleapis.com/v0/b/aptos-marketplace-a149b.appspot.com/o/item%2Fb30380bf4bacce49923ee2ea2257a39e.avif?alt=media&token=9807b531-78d5-4fd1-81ad-03d6a62a74ed',
          },
          event_account_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          event_creation_number: 8,
          event_index: 0,
          event_sequence_number: 0,
          from_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          name: 'SA#01',
          property_version: 0,
          to_address: null,
          token_amount: 1,
          token_data_id_hash:
            'e4ebdb1cb838e9ebff9176687be2f9b295358e7e6b8dff27896b3222a6c3431a',
          transaction_timestamp: '2023-03-01T09:52:01',
          transaction_version: 442086400,
          transfer_type: '0x3::token::WithdrawEvent',
        },
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            '8f6a8bf15fbb932cf8252d80ece592dd92b507a9e8bff4e9b2d211d6019c6f45',
          collection_name: 'Savage Nation',
          creator_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          current_token_data: {
            metadata_uri:
              'https://firebasestorage.googleapis.com/v0/b/aptos-marketplace-a149b.appspot.com/o/item%2Fb30380bf4bacce49923ee2ea2257a39e.avif?alt=media&token=9807b531-78d5-4fd1-81ad-03d6a62a74ed',
          },
          event_account_address:
            '0xfe72e4ba98b4052434f7313c9c93aea1a0ee6f0c54892e6435fb92ea53cfda0a',
          event_creation_number: 24,
          event_index: 1,
          event_sequence_number: 162,
          from_address: null,
          name: 'SA#01',
          property_version: 0,
          to_address:
            '0xfe72e4ba98b4052434f7313c9c93aea1a0ee6f0c54892e6435fb92ea53cfda0a',
          token_amount: 1,
          token_data_id_hash:
            'e4ebdb1cb838e9ebff9176687be2f9b295358e7e6b8dff27896b3222a6c3431a',
          transaction_timestamp: '2023-03-01T09:52:01',
          transaction_version: 442086400,
          transfer_type: '0x3::token::DepositEvent',
        },
      ],
      transaction_version: 442086400n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'send_token',
        account:
          '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
        collection: 'Savage Nation',
        eventIndex: 0,
        gas: 191700n,
        name: 'SA#01',
        receiver: {
          address:
            '0xfe72e4ba98b4052434f7313c9c93aea1a0ee6f0c54892e6435fb92ea53cfda0a',
          undefined,
        },
        success: true,
        timestamp: new Date('2023-03-01T09:52:01.000Z'),
        uri: 'https://firebasestorage.googleapis.com/v0/b/aptos-marketplace-a149b.appspot.com/o/item%2Fb30380bf4bacce49923ee2ea2257a39e.avif?alt=media&token=9807b531-78d5-4fd1-81ad-03d6a62a74ed',
        version: 442086400n,
      },
    ]);
  });

  test('receiving a token (claimed by receiver)', () => {
    const petraActivity = {
      account_address:
        '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 184500,
          aptos_names: [],
          block_height: 62544529,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x3::token_transfers::claim_script',
          event_account_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 49,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          transaction_timestamp: '2023-02-27T18:32:36',
          transaction_version: 438554252,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
          collection_name: 'Aptos Names V1',
          creator_address:
            '0xf019d3c5901345a7f454848ce702943d1e629ded16a911f3b3b566a44ab1402d',
          current_token_data: {
            metadata_uri:
              'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
          },
          event_account_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          event_creation_number: 4,
          event_index: 0,
          event_sequence_number: 9,
          from_address: null,
          name: 'testingtesting1234.apt',
          property_version: 1,
          to_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          token_amount: 1,
          token_data_id_hash:
            '875b46e9f109652b5bdf7c366ebbd77c41e66c6fdee403737520257084fa794b',
          transaction_timestamp: '2023-02-27T18:32:36',
          transaction_version: 438554252,
          transfer_type: '0x3::token::DepositEvent',
        },
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
          collection_name: 'Aptos Names V1',
          creator_address:
            '0xf019d3c5901345a7f454848ce702943d1e629ded16a911f3b3b566a44ab1402d',
          current_token_data: {
            metadata_uri:
              'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
          },
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: 20,
          event_index: 1,
          event_sequence_number: 11,
          from_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          name: 'testingtesting1234.apt',
          property_version: 1,
          to_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          token_amount: 1,
          token_data_id_hash:
            '875b46e9f109652b5bdf7c366ebbd77c41e66c6fdee403737520257084fa794b',
          transaction_timestamp: '2023-02-27T18:32:36',
          transaction_version: 438554252,
          transfer_type: '0x3::token_transfers::TokenClaimEvent',
        },
      ],
      transaction_version: 438554252n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'receive_token',
        account:
          '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
        collection: 'Aptos Names V1',
        eventIndex: 0,
        gas: 184500n,
        name: 'testingtesting1234.apt',
        sender: {
          address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          undefined,
        },
        success: true,
        timestamp: new Date('2023-02-27T18:32:36.000Z'),
        uri: 'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
        version: 438554252n,
      },
    ]);
  });

  test('receiving a token (direct transfer)', () => {
    const petraActivity = {
      account_address:
        '0xfe72e4ba98b4052434f7313c9c93aea1a0ee6f0c54892e6435fb92ea53cfda0a',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 191700,
          aptos_names: [],
          block_height: 63237668,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x3::token::transfer_with_opt_in',
          event_account_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 2,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          transaction_timestamp: '2023-03-01T09:52:01',
          transaction_version: 442086400,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            '8f6a8bf15fbb932cf8252d80ece592dd92b507a9e8bff4e9b2d211d6019c6f45',
          collection_name: 'Savage Nation',
          creator_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          current_token_data: {
            metadata_uri:
              'https://firebasestorage.googleapis.com/v0/b/aptos-marketplace-a149b.appspot.com/o/item%2Fb30380bf4bacce49923ee2ea2257a39e.avif?alt=media&token=9807b531-78d5-4fd1-81ad-03d6a62a74ed',
          },
          event_account_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          event_creation_number: 8,
          event_index: 0,
          event_sequence_number: 0,
          from_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          name: 'SA#01',
          property_version: 0,
          to_address: null,
          token_amount: 1,
          token_data_id_hash:
            'e4ebdb1cb838e9ebff9176687be2f9b295358e7e6b8dff27896b3222a6c3431a',
          transaction_timestamp: '2023-03-01T09:52:01',
          transaction_version: 442086400,
          transfer_type: '0x3::token::WithdrawEvent',
        },
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            '8f6a8bf15fbb932cf8252d80ece592dd92b507a9e8bff4e9b2d211d6019c6f45',
          collection_name: 'Savage Nation',
          creator_address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          current_token_data: {
            metadata_uri:
              'https://firebasestorage.googleapis.com/v0/b/aptos-marketplace-a149b.appspot.com/o/item%2Fb30380bf4bacce49923ee2ea2257a39e.avif?alt=media&token=9807b531-78d5-4fd1-81ad-03d6a62a74ed',
          },
          event_account_address:
            '0xfe72e4ba98b4052434f7313c9c93aea1a0ee6f0c54892e6435fb92ea53cfda0a',
          event_creation_number: 24,
          event_index: 1,
          event_sequence_number: 162,
          from_address: null,
          name: 'SA#01',
          property_version: 0,
          to_address:
            '0xfe72e4ba98b4052434f7313c9c93aea1a0ee6f0c54892e6435fb92ea53cfda0a',
          token_amount: 1,
          token_data_id_hash:
            'e4ebdb1cb838e9ebff9176687be2f9b295358e7e6b8dff27896b3222a6c3431a',
          transaction_timestamp: '2023-03-01T09:52:01',
          transaction_version: 442086400,
          transfer_type: '0x3::token::DepositEvent',
        },
      ],
      transaction_version: 442086400n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'receive_token',
        account:
          '0xfe72e4ba98b4052434f7313c9c93aea1a0ee6f0c54892e6435fb92ea53cfda0a',
        collection: 'Savage Nation',
        eventIndex: 0,
        gas: 191700n,
        name: 'SA#01',
        sender: {
          address:
            '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
          undefined,
        },
        success: true,
        timestamp: new Date('2023-03-01T09:52:01.000Z'),
        uri: 'https://firebasestorage.googleapis.com/v0/b/aptos-marketplace-a149b.appspot.com/o/item%2Fb30380bf4bacce49923ee2ea2257a39e.avif?alt=media&token=9807b531-78d5-4fd1-81ad-03d6a62a74ed',
        version: 442086400n,
      },
    ]);
  });

  test('sending a token offer', () => {
    const petraActivity = {
      account_address:
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 193800,
          aptos_names: [],
          block_height: 62544469,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x3::token_transfers::offer_script',
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 740,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          transaction_timestamp: '2023-02-27T18:32:23',
          transaction_version: 438553941,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
          collection_name: 'Aptos Names V1',
          creator_address:
            '0xf019d3c5901345a7f454848ce702943d1e629ded16a911f3b3b566a44ab1402d',
          current_token_data: {
            metadata_uri:
              'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
          },
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: 5,
          event_index: 0,
          event_sequence_number: 31,
          from_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          name: 'testingtesting1234.apt',
          property_version: 1,
          to_address: null,
          token_amount: 1,
          token_data_id_hash:
            '875b46e9f109652b5bdf7c366ebbd77c41e66c6fdee403737520257084fa794b',
          transaction_timestamp: '2023-02-27T18:32:23',
          transaction_version: 438553941,
          transfer_type: '0x3::token::WithdrawEvent',
        },
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
          collection_name: 'Aptos Names V1',
          creator_address:
            '0xf019d3c5901345a7f454848ce702943d1e629ded16a911f3b3b566a44ab1402d',
          current_token_data: {
            metadata_uri:
              'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
          },
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: 18,
          event_index: 1,
          event_sequence_number: 30,
          from_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          name: 'testingtesting1234.apt',
          property_version: 1,
          to_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          token_amount: 1,
          token_data_id_hash:
            '875b46e9f109652b5bdf7c366ebbd77c41e66c6fdee403737520257084fa794b',
          transaction_timestamp: '2023-02-27T18:32:23',
          transaction_version: 438553941,
          transfer_type: '0x3::token_transfers::TokenOfferEvent',
        },
      ],
      transaction_version: 438553941n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'send_token_offer',
        account:
          '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
        collection: 'Aptos Names V1',
        eventIndex: 0,
        gas: 193800n,
        name: 'testingtesting1234.apt',
        receiver: {
          address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          undefined,
        },
        success: true,
        timestamp: new Date('2023-02-27T18:32:23.000Z'),
        uri: 'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
        version: 438553941n,
      },
    ]);
  });

  test('receiving a token offer', () => {
    const petraActivity = {
      account_address:
        '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 193800,
          aptos_names: [],
          block_height: 62544469,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x3::token_transfers::offer_script',
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: -1,
          event_index: -1,
          event_sequence_number: 740,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          transaction_timestamp: '2023-02-27T18:32:23',
          transaction_version: 438553941,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
          collection_name: 'Aptos Names V1',
          creator_address:
            '0xf019d3c5901345a7f454848ce702943d1e629ded16a911f3b3b566a44ab1402d',
          current_token_data: {
            metadata_uri:
              'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
          },
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: 5,
          event_index: 0,
          event_sequence_number: 31,
          from_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          name: 'testingtesting1234.apt',
          property_version: 1,
          to_address: null,
          token_amount: 1,
          token_data_id_hash:
            '875b46e9f109652b5bdf7c366ebbd77c41e66c6fdee403737520257084fa794b',
          transaction_timestamp: '2023-02-27T18:32:23',
          transaction_version: 438553941,
          transfer_type: '0x3::token::WithdrawEvent',
        },
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
          collection_name: 'Aptos Names V1',
          creator_address:
            '0xf019d3c5901345a7f454848ce702943d1e629ded16a911f3b3b566a44ab1402d',
          current_token_data: {
            metadata_uri:
              'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
          },
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: 18,
          event_index: 1,
          event_sequence_number: 30,
          from_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          name: 'testingtesting1234.apt',
          property_version: 1,
          to_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          token_amount: 1,
          token_data_id_hash:
            '875b46e9f109652b5bdf7c366ebbd77c41e66c6fdee403737520257084fa794b',
          transaction_timestamp: '2023-02-27T18:32:23',
          transaction_version: 438553941,
          transfer_type: '0x3::token_transfers::TokenOfferEvent',
        },
      ],
      transaction_version: 438553941n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'receive_token_offer',
        account:
          '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
        collection: 'Aptos Names V1',
        eventIndex: 0,
        gas: 193800n,
        name: 'testingtesting1234.apt',
        sender: {
          address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          undefined,
        },
        success: true,
        timestamp: new Date('2023-02-27T18:32:23.000Z'),
        uri: 'https://aptosnames.com/api/v1/metadata/testingtesting1234.apt',
        version: 438553941n,
      },
    ]);
  });

  test('minting a token', () => {
    const petraActivity = {
      account_address:
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 368400,
          aptos_names: [],
          block_height: 267580,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x3::token::create_token_script',
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: -1,
          event_sequence_number: 3,
          is_gas_fee: true,
          is_transaction_success: true,
          transaction_timestamp: '2022-10-14T10:19:01',
          transaction_version: 536045,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            '43e7d8988e27deea550b249f8f32018addd45ab55d049023f3080fe06dbabba5',
          collection_name: 'Aptos Labs',
          creator_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          current_token_data: {
            metadata_uri:
              'https://aptos-petra.s3.us-east-1.amazonaws.com/aptoslabs.jpg',
          },
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: 7,
          event_sequence_number: 0,
          from_address: null,
          name: 'Aptos Labs #1',
          property_version: 0,
          to_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          token_amount: 1,
          token_data_id_hash:
            'e8594a7a837469beb6e5e7d61147c4b8d752e6303a5624b5d309539ee0a821f6',
          transaction_timestamp: '2022-10-14T10:19:01',
          transaction_version: 536045,
          transfer_type: '0x3::token::DepositEvent',
        },
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            '43e7d8988e27deea550b249f8f32018addd45ab55d049023f3080fe06dbabba5',
          collection_name: 'Aptos Labs',
          creator_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          current_token_data: {
            metadata_uri:
              'https://aptos-petra.s3.us-east-1.amazonaws.com/aptoslabs.jpg',
          },
          event_account_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          event_creation_number: 6,
          event_sequence_number: 0,
          from_address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          name: 'Aptos Labs #1',
          property_version: 0,
          to_address: null,
          token_amount: 1,
          token_data_id_hash:
            'e8594a7a837469beb6e5e7d61147c4b8d752e6303a5624b5d309539ee0a821f6',
          transaction_timestamp: '2022-10-14T10:19:01',
          transaction_version: 536045,
          transfer_type: '0x3::token::MintTokenEvent',
        },
      ],
      transaction_version: 536045n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'mint_token',
        account:
          '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
        amount: 1n,
        collection: 'Aptos Labs',
        eventIndex: 0,
        gas: 368400n,
        minter: {
          address:
            '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
          undefined,
        },
        name: 'Aptos Labs #1',
        success: true,
        timestamp: new Date('2022-10-14T10:19:01.000Z'),
        uri: 'https://aptos-petra.s3.us-east-1.amazonaws.com/aptoslabs.jpg',
        version: 536045n,
      },
    ]);
  });

  test('buying a token', () => {
    const petraActivity = {
      account_address:
        '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
      coin_activities: [
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: 2415000,
          aptos_names: [],
          block_height: 46696096,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str:
            '0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2::marketplace_v2::buy',
          event_account_address:
            '0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2',
          event_creation_number: 2,
          event_sequence_number: 536411,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-04-13T03:58:19',
          transaction_version: 120165703,
        },
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: 4830000,
          aptos_names: [],
          block_height: 46696096,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str:
            '0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2::marketplace_v2::buy',
          event_account_address:
            '0x5b9fcc35e2ec419fc44d18cb1dd499bc9685fcaab3b66aeb3d6ea60f4a84993f',
          event_creation_number: 2,
          event_sequence_number: 1124,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-04-13T03:58:19',
          transaction_version: 120165703,
        },
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: 89355000,
          aptos_names: [],
          block_height: 46696096,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str:
            '0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2::marketplace_v2::buy',
          event_account_address:
            '0x78a2ef21ebaf7ecfd5922f6b7f29a71469a73645e95a1f92c277f3ae1e3b76de',
          event_creation_number: 2,
          event_sequence_number: 841,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-04-13T03:58:19',
          transaction_version: 120165703,
        },
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 61200,
          aptos_names: [],
          block_height: 46696096,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str:
            '0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2::marketplace_v2::buy',
          event_account_address:
            '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
          event_creation_number: -1,
          event_sequence_number: 2,
          is_gas_fee: true,
          is_transaction_success: true,
          transaction_timestamp: '2023-04-13T03:58:19',
          transaction_version: 120165703,
        },
        {
          activity_type: '0x1::coin::WithdrawEvent',
          amount: 4830000,
          aptos_names: [],
          block_height: 46696096,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str:
            '0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2::marketplace_v2::buy',
          event_account_address:
            '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
          event_creation_number: 3,
          event_sequence_number: 6,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-04-13T03:58:19',
          transaction_version: 120165703,
        },
        {
          activity_type: '0x1::coin::WithdrawEvent',
          amount: 2415000,
          aptos_names: [],
          block_height: 46696096,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str:
            '0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2::marketplace_v2::buy',
          event_account_address:
            '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
          event_creation_number: 3,
          event_sequence_number: 7,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-04-13T03:58:19',
          transaction_version: 120165703,
        },
        {
          activity_type: '0x1::coin::WithdrawEvent',
          amount: 89355000,
          aptos_names: [],
          block_height: 46696096,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str:
            '0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2::marketplace_v2::buy',
          event_account_address:
            '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
          event_creation_number: 3,
          event_sequence_number: 8,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-04-13T03:58:19',
          transaction_version: 120165703,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [
        {
          aptos_names_owner: [],
          aptos_names_to: [],
          coin_amount: null,
          coin_type: null,
          collection_data_id_hash:
            '424784f93095e304e45ee509c741bf40e3869eb4a831501b164c4aaf7f22b56f',
          collection_name: 'Deus Ex Machina',
          creator_address:
            '0x92c2e920025b69e0719b05e41734c5faaadd1d71c90f403ae779b81890006c1e',
          current_token_data: {
            metadata_uri:
              'https://aptos-petra.s3.us-east-1.amazonaws.com/aptoslabs.jpg',
          },
          event_account_address:
            '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
          event_creation_number: 4,
          event_sequence_number: 2,
          from_address: null,
          name: 'Deus Ex Machina #978',
          property_version: 0,
          to_address:
            '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
          token_amount: 1,
          token_data_id_hash:
            '4b4ea94882dd4a20737fe177746bbe8384001ac7e796b259e79b775a1db762c9',
          transaction_timestamp: '2023-04-13T03:58:19',
          transaction_version: 120165703,
          transfer_type: '0x3::token::DepositEvent',
        },
      ],
      transaction_version: 120165703n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'send',
        account:
          '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
        amount: 2415000n,
        coin: '0x1::aptos_coin::AptosCoin',
        eventIndex: 0,
        gas: 61200n,
        receiver: {
          address:
            '0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2',
          name: undefined,
        },
        success: true,
        timestamp: new Date('2023-04-13T03:58:19.000Z'),
        version: 120165703n,
      },
      {
        _type: 'send',
        account:
          '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
        amount: 4830000n,
        coin: '0x1::aptos_coin::AptosCoin',
        eventIndex: 1,
        gas: 61200n,
        receiver: {
          address:
            '0x5b9fcc35e2ec419fc44d18cb1dd499bc9685fcaab3b66aeb3d6ea60f4a84993f',
          name: undefined,
        },
        success: true,
        timestamp: new Date('2023-04-13T03:58:19.000Z'),
        version: 120165703n,
      },
      {
        _type: 'send',
        account:
          '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
        amount: 89355000n,
        coin: '0x1::aptos_coin::AptosCoin',
        eventIndex: 2,
        gas: 61200n,
        receiver: {
          address:
            '0x78a2ef21ebaf7ecfd5922f6b7f29a71469a73645e95a1f92c277f3ae1e3b76de',
          name: undefined,
        },
        success: true,
        timestamp: new Date('2023-04-13T03:58:19.000Z'),
        version: 120165703n,
      },
      {
        _type: 'receive_token',
        account:
          '0xc02399a3dadb83d363802e3fc990eceade0e9b2a9a6dc180a092a60b0c17566f',
        collection: 'Deus Ex Machina',
        eventIndex: 3,
        gas: 61200n,
        name: 'Deus Ex Machina #978',
        sender: null,
        success: true,
        timestamp: new Date('2023-04-13T03:58:19.000Z'),
        uri: 'https://aptos-petra.s3.us-east-1.amazonaws.com/aptoslabs.jpg',
        version: 120165703n,
      },
    ]);
  });

  test('transfer with multiple receivers', () => {
    const petraActivity = {
      account_address:
        '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: 54600,
          aptos_names: [],
          block_height: 54153802,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str:
            '0xb488182c907ffe32b2898b9159f58098060584e860a48ddbe0753bd89d8dc96a::wolf_witch::battle',
          event_account_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          event_creation_number: -1,
          event_sequence_number: 399,
          is_gas_fee: true,
          is_transaction_success: true,
          transaction_timestamp: '2023-02-27T18:32:23',
          transaction_version: 138966744n,
        },
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: 150462,
          aptos_names: [],
          block_height: 54153802,
          coin_type:
            '0x52ab49a4039c3d2b0aa6e0a00aaed75dcff72a3120ba3610f62d1d0b6032345a::war_coin::WarCoin',
          entry_function_id_str:
            '0xb488182c907ffe32b2898b9159f58098060584e860a48ddbe0753bd89d8dc96a::wolf_witch::battle',
          event_account_address:
            '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
          event_creation_number: 42,
          event_sequence_number: 193,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-02-27T18:32:23',
          transaction_version: 138966744n,
        },
        {
          activity_type: '0x1::coin::DepositEvent',
          amount: 150462,
          aptos_names: [],
          block_height: 54153802,
          coin_type:
            '0x52ab49a4039c3d2b0aa6e0a00aaed75dcff72a3120ba3610f62d1d0b6032345a::war_coin::WarCoin',
          entry_function_id_str:
            '0xb488182c907ffe32b2898b9159f58098060584e860a48ddbe0753bd89d8dc96a::wolf_witch::battle',
          event_account_address:
            '0x89fa1b72e65fab3da9a42dfe28047c658a5f1ab8857daaf9621b62156baec9f4',
          event_creation_number: 42,
          event_sequence_number: 347,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-02-27T18:32:23',
          transaction_version: 138966744n,
        },
        {
          activity_type: '0x1::coin::WithdrawEvent',
          amount: 300924,
          aptos_names: [],
          block_height: 54153802,
          coin_type:
            '0x52ab49a4039c3d2b0aa6e0a00aaed75dcff72a3120ba3610f62d1d0b6032345a::war_coin::WarCoin',
          entry_function_id_str:
            '0xb488182c907ffe32b2898b9159f58098060584e860a48ddbe0753bd89d8dc96a::wolf_witch::battle',
          event_account_address:
            '0x92e00bccf40c70d701d60830b91aaed4bd52dae9dc2833271261af06a13d38d5',
          event_creation_number: 9,
          event_sequence_number: 428,
          is_gas_fee: false,
          is_transaction_success: true,
          transaction_timestamp: '2023-02-27T18:32:23',
          transaction_version: 138966744n,
        },
      ],
      delegated_staking_activities: [],
      token_activities: [],
      transaction_version: 138966744n,
    };

    expect(transformPetraActivity(petraActivity)).toEqual([
      {
        _type: 'receive',
        account:
          '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
        amount: 150462n,
        coin: '0x52ab49a4039c3d2b0aa6e0a00aaed75dcff72a3120ba3610f62d1d0b6032345a::war_coin::WarCoin',
        eventIndex: 0,
        gas: 54600n,
        sender: {
          address:
            '0x92e00bccf40c70d701d60830b91aaed4bd52dae9dc2833271261af06a13d38d5',
          name: undefined,
        },
        success: true,
        timestamp: new Date('2023-02-27T18:32:23.000Z'),
        version: 138966744n,
      },
    ]);
  });

  test('transforms add stake events', () => {
    const petraActivity = {
      account_address:
        '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: '54100',
          aptos_names: [],
          block_height: 1499010,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
          event_creation_number: -1,
          event_sequence_number: 0,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
          transaction_timestamp: '2022-10-20T04:01:35',
          transaction_version: 4980001,
        },
      ],
      delegated_staking_activities: [addStakeEvent],
      token_activities: [],
      transaction_version: 4980001n,
    };

    const activities = transformPetraActivity(petraActivity);
    const activity = activities[0];

    expect(activities.length).toEqual(1);
    // eslint-disable-next-line no-underscore-dangle
    expect(activity._type).toEqual('add-stake');
    expect((activity as StakeEvent).amount).toEqual(addStakeEvent.amount);
    expect((activity as StakeEvent).pool).toEqual(addStakeEvent.pool_address);
  });

  test('transforms unstake events', () => {
    const petraActivity = {
      account_address:
        '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: '54100',
          aptos_names: [],
          block_height: 1499010,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
          event_creation_number: -1,
          event_sequence_number: 0,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
          transaction_timestamp: '2022-10-20T04:01:35',
          transaction_version: 4980001,
        },
      ],
      delegated_staking_activities: [unlockStakeEvent],
      token_activities: [],
      transaction_version: 4980001n,
    };

    const activities = transformPetraActivity(petraActivity);
    const activity = activities[0];

    expect(activities.length).toEqual(1);
    // eslint-disable-next-line no-underscore-dangle
    expect(activity._type).toEqual('unstake');
    expect((activity as StakeEvent).amount).toEqual(unlockStakeEvent.amount);
    expect((activity as StakeEvent).pool).toEqual(
      unlockStakeEvent.pool_address,
    );
  });

  test('transforms withdraw events', () => {
    const petraActivity = {
      account_address:
        '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
      coin_activities: [
        {
          activity_type: '0x1::aptos_coin::GasFeeEvent',
          amount: '54100',
          aptos_names: [],
          block_height: 1499010,
          coin_type: '0x1::aptos_coin::AptosCoin',
          entry_function_id_str: '0x1::coin::transfer',
          event_account_address:
            '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
          event_creation_number: -1,
          event_sequence_number: 0,
          is_gas_fee: true,
          is_transaction_success: true,
          owner_address:
            '0xa7c0fb9acaae1208b141f6b94f768e0daa14c4722b09074816925355d73875c6',
          transaction_timestamp: '2022-10-20T04:01:35',
          transaction_version: 4980001,
        },
      ],
      delegated_staking_activities: [withdrawEventBig, withdrawEventSmall],
      token_activities: [],
      transaction_version: 4980001n,
    };

    const combinedTotal = petraActivity.delegated_staking_activities
      .reduce<number>(
        (acc, x) =>
          x.event_type === '0x1::delegation_pool::WithdrawStakeEvent'
            ? acc + Number(x.amount)
            : acc,
        0,
      )
      .toString();

    const activities = transformPetraActivity(petraActivity);
    const activity = activities[0];

    expect(activities.length).toEqual(1);
    // eslint-disable-next-line no-underscore-dangle
    expect(activity._type).toEqual('withdraw-stake');
    expect((activity as StakeEvent).amount).toEqual(combinedTotal);
    expect((activity as StakeEvent).pool).toEqual(
      withdrawEventBig.pool_address,
    );
    expect((activity as StakeEvent).pool).toEqual(
      withdrawEventSmall.pool_address,
    );
  });
});
