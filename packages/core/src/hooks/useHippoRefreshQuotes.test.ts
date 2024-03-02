// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TradeAggregator } from '@manahippo/hippo-sdk';
import { renderHook } from '@testing-library/react';
import { RawCoinInfo } from '@manahippo/coin-list';
import { useHippoRefreshQuotes } from './useHippoRefreshQuotes';
import { MaxSteps } from './useHippoQuotes';

jest.mock('./useHippoNetworkConfig', () => () => ({ name: 'mainnet' }));

const aptCoin = {
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
};

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
};

jest.mock('@manahippo/hippo-sdk', () => ({
  TokenClient: jest.fn(() => {}),
  TradeAggregator: jest.fn(() => {}),
}));

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: () => ({
    isLoading: false,
    isSuccess: true,
  }),
}));

test('should return refreshQuotes', async () => {
  (TradeAggregator as any as jest.Mock).mockImplementation(() => ({
    name: 'hippoAggregator',
  }));

  const config = {
    allowHighGas: false,
    fromAmount: 1,
    fromToken: aptCoin as RawCoinInfo,
    isFixedOutput: false,
    isReload: true,
    maxSteps: 3 as MaxSteps,
    toAmount: 0,
    toToken: usdcCoin as RawCoinInfo,
  };
  const hook = renderHook(() => useHippoRefreshQuotes(config));

  const { result } = hook;
  expect(result.current).toBeInstanceOf(Function);
});

test('should call requestQuotesViaAPI when fromAmount is defined and isFixedOutput is falsy', async () => {
  const mockRequestQuotesViaAPI = jest.fn(() =>
    Promise.resolve({
      allRoutesCount: 10,
      routes: [],
    }),
  );
  (TradeAggregator as any as jest.Mock).mockImplementation(() => ({
    name: 'hippoAggregator',
    requestQuotesViaAPI: mockRequestQuotesViaAPI,
  }));

  const config = {
    allowHighGas: false,
    fromAmount: 1,
    fromToken: aptCoin as RawCoinInfo,
    isFixedOutput: false,
    isReload: true,
    maxSteps: 3 as any,
    toAmount: 0,
    toToken: usdcCoin as RawCoinInfo,
  };
  const hook = renderHook(() => useHippoRefreshQuotes(config));

  const { result } = hook;
  const refreshQuotes = result.current;

  await refreshQuotes();
  expect(mockRequestQuotesViaAPI).toHaveBeenCalled();
});

test('should call getQuotesWithFixedOutputWithChange when toAmount is defined and isFixedOutput is truthy', async () => {
  const mockGetQuotesWithFixedOutputWithChange = jest.fn(() =>
    Promise.resolve({
      hasRoutes: true,
    }),
  );
  (TradeAggregator as any as jest.Mock).mockImplementation(() => ({
    getQuotesWithFixedOutputWithChange: mockGetQuotesWithFixedOutputWithChange,
    name: 'hippoAggregator',
  }));

  const config = {
    allowHighGas: false,
    fromAmount: 0,
    fromToken: aptCoin as RawCoinInfo,
    isFixedOutput: true,
    isReload: true,
    maxSteps: 3 as MaxSteps,
    toAmount: 1,
    toToken: usdcCoin as RawCoinInfo,
  };
  const hook = renderHook(() => useHippoRefreshQuotes(config));

  const { result } = hook;
  const refreshQuotes = result.current;

  await refreshQuotes();
  expect(mockGetQuotesWithFixedOutputWithChange).toHaveBeenCalled();
});
