// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { renderHook } from '@testing-library/react';
import { useFormContext } from 'react-hook-form';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SdkTransaction } from '../hooks/useWebRestApi';
import { MetadataJson, TokenData } from '../types';
import { RestApiContext } from '../hooks/useRestApi';
import CoinSwapProvider from './CoinSwapProvider';
import { NetworksProvider } from '../hooks/useNetworks';

jest.mock('../../hooks/useHippoNetworkConfig', () => () => ({
  name: 'mainnet',
}));

jest.mock('aptos', () => ({
  ...jest.requireActual('aptos'),
  TokenClient: jest.fn(() => {}),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const context = {
  addPendingTxn: () => Promise.resolve(),
  getAddressFromName: () => Promise.resolve(''),
  getCoinInfo: () => Promise.resolve(undefined),
  getEvents: () => Promise.resolve([]),
  getNameFromAddress: () => Promise.resolve(undefined),
  getPendingTxns: () => Promise.resolve([]),
  getTokenData: () => Promise.resolve({} as TokenData),
  getTokenMetadata: () => Promise.resolve({} as MetadataJson),
  getTransaction: () => Promise.resolve({} as SdkTransaction),
};

function TestApp({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RestApiContext.Provider value={context}>
        <NetworksProvider>
          <CoinSwapProvider>{children}</CoinSwapProvider>
        </NetworksProvider>
      </RestApiContext.Provider>
    </QueryClientProvider>
  );
}

jest.mock('@manahippo/hippo-sdk', () => ({
  TokenClient: jest.fn(() => {}),
  TradeAggregator: jest.fn(() => {}),
}));

test('should return coin list dict', async () => {
  const { result } = renderHook(() => useFormContext(), {
    wrapper: TestApp,
  });

  expect(result.current.getValues('selectedSlippage')).toBe('0.01');
  expect(result.current.getValues('isFixedOutput')).toBe(false);
  expect(result.current.getValues('currencyFrom')).toEqual({
    amount: '0',
    balance: undefined,
    isInvalid: false,
    isUserEntered: false,
    token: {
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
    },
  });
  expect(result.current.getValues('currencyTo')).toEqual({
    amount: '0',
    balance: undefined,
    isInvalid: false,
    isUserEntered: false,
    token: {
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
    },
  });
});
