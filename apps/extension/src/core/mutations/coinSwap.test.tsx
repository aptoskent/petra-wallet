// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react';
import { useTransactionSubmit } from 'core/mutations/transaction';
import { NetworksProvider } from '@petra/core/hooks/useNetworks';
import { UnlockedAccountsProvider } from '@petra/core/hooks/useAccounts';
import mockAccount from 'core/mocks/accounts';
import queryKeys from '@petra/core/queries/queryKeys';
import { useCoinSwapMutation } from './coinSwap';

jest.mock('@petra/core/hooks/useHippoNetworkConfig', () => () => ({
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

function TestApp({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UnlockedAccountsProvider
        accounts={{ [mockAccount.address]: mockAccount }}
        encryptionKey="0x7ff74d5b5982b4e616ab51aa9ed6d539fba7540d2a76468c0bcbf8568aa55bce"
      >
        <NetworksProvider>{children}</NetworksProvider>
      </UnlockedAccountsProvider>
    </QueryClientProvider>
  );
}

jest.mock('@manahippo/hippo-sdk', () => ({
  TokenClient: jest.fn(() => {}),
  TradeAggregator: jest.fn(() => {}),
}));

jest.mock('core/mutations/transaction', () => ({
  useTransactionSubmit: jest.fn(),
}));

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQueryClient: jest.fn(),
}));

test('should return mutation function to perform coin swap', async () => {
  (useTransactionSubmit as any as jest.Mock).mockImplementation(() => ({
    isError: false,
    isLoading: false,
    mutateAsync: jest.fn(),
  }));
  const { result } = renderHook(() => useCoinSwapMutation(), {
    wrapper: TestApp,
  });

  expect(result.current.mutateAsync).toBeDefined();
  expect(result.current.isLoading).toBe(false);
  expect(result.current.isError).toBe(false);
});

test('should call invalidateQueries onSuccess', async () => {
  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  };

  (useQueryClient as any as jest.Mock).mockImplementation(
    () => mockQueryClient,
  );

  (useTransactionSubmit as any as jest.Mock).mockImplementation(
    (_cb, options) => ({
      isError: false,
      isLoading: false,
      mutateAsync: jest.fn(() => options.onSuccess()),
    }),
  );

  const { result } = renderHook(() => useCoinSwapMutation(), {
    wrapper: TestApp,
  });

  expect(mockQueryClient.invalidateQueries).not.toHaveBeenCalled();
  expect(result.current.mutateAsync).toBeDefined();

  await result.current.mutateAsync({} as any);

  expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(
    queryKeys.getAccountResources,
  );
});
