// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { renderHook } from '@testing-library/react';
import { RawCoinInfo } from '@manahippo/coin-list';
import useHippoNetworkConfig from './useHippoNetworkConfig';
import { useCoinListDict } from './useCoinListDict';

import { NetworksProvider } from './useNetworks';

jest.mock('../hooks/useHippoNetworkConfig', () => jest.fn());

// these mock are necessary
// otherwise it will throw error ReferenceError: TextDecoder is not defined
jest.mock('@scure/bip32', () => ({
  TextEncoder: jest.fn(),
}));

jest.mock('aptos', () => ({
  ...jest.requireActual('aptos'),
  HexString: jest.fn(() => {}),
  TokenClient: jest.fn(() => {}),
}));

(useHippoNetworkConfig as any as jest.Mock).mockReturnValue('mainnet');

function TestApp({ children }: { children: React.ReactNode }) {
  return <NetworksProvider>{children}</NetworksProvider>;
}

jest.mock('@manahippo/hippo-sdk', () => ({
  TokenClient: jest.fn(() => {}),
  TradeAggregator: jest.fn(() => {}),
}));

test('should return coin list dict', async () => {
  const { result } = renderHook(() => useCoinListDict(), {
    wrapper: TestApp,
  });

  expect(result.current.coinListDict).toBeDefined();
  expect(result.current.coinListDict).toBeInstanceOf(Object);
  const coinDict = result.current.coinListDict as Record<string, RawCoinInfo>;
  const aptCoin = coinDict['0x1::aptos_coin::AptosCoin'];
  expect(aptCoin.name).toBe('Aptos Coin');
  expect(aptCoin.symbol).toBe('APT');
  expect(aptCoin.coingecko_id).toBe('aptos');
  expect(aptCoin.project_url).toBe('https://aptoslabs.com/');
});
