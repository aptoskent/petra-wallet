// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TradeAggregator } from '@manahippo/hippo-sdk';
import { renderHook } from '@testing-library/react';
import { RawCoinInfo } from '@manahippo/coin-list';
import { MaxSteps, useHippoQuotes } from './useHippoQuotes';
import useHippoRefreshQuotesQuery from '../queries/useHippoRefreshQuotesQuery';

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

jest.mock('../queries/useHippoRefreshQuotesQuery', () => jest.fn());

test('should return hippo quotes result by default', async () => {
  (TradeAggregator as any as jest.Mock).mockImplementation(() => ({
    name: 'hippoAggregator',
  }));

  (useHippoRefreshQuotesQuery as any as jest.Mock).mockReturnValue({
    data: null,
  });

  const config = {
    allowHighGas: false,
    fromCoinAmount: 1,
    fromToken: aptCoin as RawCoinInfo,
    isFixedOutput: false,
    isPriceYToX: true,
    isReload: true,
    maxSteps: 3 as MaxSteps,
    toCoinAmount: 0,
    toToken: usdcCoin as RawCoinInfo,
  };
  const hook = renderHook(() => useHippoQuotes(config, {}));

  const { result } = hook;
  expect(result.current.data).toBeDefined();
  expect(result.current.data.bestRouteQuote).toBe(null);
  expect(result.current.data.isLoadingRoutes).toBe(false);
  expect(result.current.data.minimumReceived).toBe(null);
  expect(result.current.data.output).toBe(null);
  expect(result.current.data.priceImpact).toBe(null);
  expect(result.current.data.priceImpactText).toBe('-');
  expect(result.current.data.rate).toBe('n/a');
});

test('should return hippo quotes result for apt->usdc when there is query data', async () => {
  (TradeAggregator as any as jest.Mock).mockImplementation(() => ({
    name: 'hippoAggregator',
  }));
  (useHippoRefreshQuotesQuery as any as jest.Mock).mockReturnValue({
    data: {
      routes: [
        {
          quote: {
            inputUiAmt: 1.0,
            outputUiAmt: 2.0,
            priceImpact: 0.08,
          },
          route: null,
        },
      ],
    },
  });

  const config = {
    allowHighGas: false,
    fromToken: aptCoin as RawCoinInfo,
    fromUiAmt: 1,
    isFixedOutput: false,
    isPriceYToX: true,
    isReload: true,
    maxSteps: 3 as MaxSteps,
    toToken: usdcCoin as RawCoinInfo,
    toUiAmt: 0,
  };
  const hook = renderHook(() => useHippoQuotes(config, {}));

  const { result } = hook;
  expect(result.current.data.isLoadingRoutes).toBe(false);
  expect(result.current.data.minimumReceived).toBe('1.9998 USDC');
  expect(result.current.data.output).toBe('2 USDC');
  expect(result.current.data.priceImpact).toBe(0.08);
  expect(result.current.data.priceImpactText).toBe('8.00%');
  expect(result.current.data.rate).toBe('1 APT ≈ 2 USDC');
});

test('should return hippo quotes result for usdc->apt when there is query data', async () => {
  (TradeAggregator as any as jest.Mock).mockImplementation(() => ({
    name: 'hippoAggregator',
  }));
  (useHippoRefreshQuotesQuery as any as jest.Mock).mockReturnValue({
    data: {
      routes: [
        {
          quote: {
            inputUiAmt: 2.0,
            outputUiAmt: 1.0,
            priceImpact: 0.08,
          },
          route: null,
        },
      ],
    },
  });

  const config = {
    allowHighGas: false,
    fromToken: aptCoin as RawCoinInfo,
    fromUiAmt: 0,
    isFixedOutput: true,
    isPriceYToX: true,
    isReload: true,
    maxSteps: 3 as MaxSteps,
    toToken: usdcCoin as RawCoinInfo,
    toUiAmt: 1,
  };
  const hook = renderHook(() => useHippoQuotes(config, {}));

  const { result } = hook;
  expect(result.current.data.isLoadingRoutes).toBe(false);
  expect(result.current.data.minimumReceived).toBe('0.9999 USDC');
  expect(result.current.data.output).toBe('1 USDC');
  expect(result.current.data.priceImpact).toBe(0.08);
  expect(result.current.data.priceImpactText).toBe('8.00%');
  expect(result.current.data.rate).toBe('1 APT ≈ 0.5 USDC');
});
