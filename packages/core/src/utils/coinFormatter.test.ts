// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { type RawCoinInfo } from '@manahippo/coin-list';
import coinFormatter, {
  parseScientificNotation,
  cutDecimals,
  numToGrouped,
} from './coinFormatter';

const aptosCoin = {
  coingecko_id: 'aptos',
  decimals: 8,
  extensions: {
    data: [['bridge', 'native']],
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
} as RawCoinInfo;

const usdcCoin = {
  coingecko_id: 'usd-coin',
  decimals: 6,
  extensions: {
    data: [['bridge', 'wormhole']],
  },
  logo_url:
    'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDC.svg',
  name: 'USD Coin (Wormhole)',
  official_symbol: 'USDC',
  project_url: '',
  symbol: 'USDC',
  token_type: {
    account_address:
      '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea',
    module_name: 'coin',
    struct_name: 'T',
    type: '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T',
  },
} as RawCoinInfo;

test('numToGrouped should return correct output', async () => {
  expect(numToGrouped('1')).toBe('1');
  expect(numToGrouped('12')).toBe('12');
  expect(numToGrouped('123')).toBe('123');
  expect(numToGrouped('123.392')).toBe('123.392');
  expect(numToGrouped('1234')).toBe('1,234');
  expect(numToGrouped('1234678.234')).toBe('1,234,678.234');
  expect(numToGrouped('1222872348923')).toBe('1,222,872,348,923');
  expect(numToGrouped('1372923909234790242394')).toBe(
    '1,372,923,909,234,790,242,394',
  );
  expect(numToGrouped('0.13444')).toBe('0.13444');
});

test('cutDecimals should return correct output', async () => {
  expect(cutDecimals('1.234', 0)).toBe('1.');
  expect(cutDecimals('1.234', 2)).toBe('1.23');
  expect(cutDecimals('1.234567780079709', 5)).toBe('1.23456');
  expect(cutDecimals('19723097.9237021', 5)).toBe('19723097.92370');
});

test('avoidScientificNotation should return correct output', async () => {
  expect(parseScientificNotation(123e8)).toBe('12300000000');
  expect(parseScientificNotation(1.23e4)).toBe('12300');
  expect(parseScientificNotation(1.2345678e-5)).toBe('0.000012345678');
});

test('should return coin amount formatter', async () => {
  expect(coinFormatter(1.12345678e8, aptosCoin)).toBe('112,345,678');
  expect(coinFormatter(1e8, null)).toBe('');
  expect(coinFormatter(1.24e8, aptosCoin)).toBe('124,000,000');
  expect(coinFormatter(1.2912e8, usdcCoin)).toBe('129,120,000');
  expect(coinFormatter(1293712907e-8, usdcCoin)).toBe('12.937129');
  expect(coinFormatter(1.222872348923e12, usdcCoin)).toBe('1,222,872,348,923');
});
