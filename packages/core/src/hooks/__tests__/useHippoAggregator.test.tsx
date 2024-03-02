// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { TradeAggregator } from '@manahippo/hippo-sdk';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppStorageContext } from '../useStorage';
import { NetworksProvider } from '../useNetworks';
import { AppStateProvider } from '../useAppState';
import useHippoAggregator from '../useHippoAggregator';

jest.mock('../useHippoNetworkConfig', () => () => ({ name: 'mainnet' }));

jest.mock('@scure/bip32', () => ({
  TextEncoder: jest.fn(),
}));

jest.mock('aptos', () => ({
  ...jest.requireActual('aptos'),
  HexString: jest.fn(() => {}),
  TokenClient: jest.fn(() => {}),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const storageContext = {
  persistentStorage: {
    get: () => ({
      featureConfig: '',
    }),
  },
  sessionStorage: {
    get: () => {},
  },
};

function TestApp({ children }: { children: React.ReactNode }) {
  return (
    <AppStorageContext.Provider value={storageContext as any}>
      <AppStateProvider>
        <QueryClientProvider client={queryClient}>
          <NetworksProvider>{children}</NetworksProvider>
        </QueryClientProvider>
      </AppStateProvider>
    </AppStorageContext.Provider>
  );
}

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

test('should return hippo aggregator when TradeAggregator resolve', async () => {
  (TradeAggregator as any as jest.Mock).mockImplementation(() => ({
    name: 'hippoAggregator',
  }));
  let hook: any = {};
  await act(() => {
    hook = renderHook(() => useHippoAggregator(), {
      wrapper: TestApp,
    });
  });

  const { result } = hook;
  expect(result.current).not.toBeNull();
  expect(result.current.isLoading).toBe(false);
  expect(result.current.hippoAggregator).toBeDefined();
});

test('should return undefined if TradeAggregator throws error', async () => {
  (TradeAggregator as any as jest.Mock).mockImplementation(() => {
    throw Error('some unknown error');
  });
  let hook: any = {};
  const mockTrackTradeAggregatorErrorEvent = jest.fn();
  await act(() => {
    hook = renderHook(
      () =>
        useHippoAggregator(
          {},
          {
            trackTradeAggregatorErrorEvent: mockTrackTradeAggregatorErrorEvent,
          },
        ),
      {
        wrapper: TestApp,
      },
    );
  });

  const { result } = hook;
  expect(result.current).not.toBeNull();
  expect(result.current.isLoading).toBe(false);
  expect(result.current.hippoAggregator).toBeUndefined();
  expect(mockTrackTradeAggregatorErrorEvent).toHaveBeenCalled();
});
