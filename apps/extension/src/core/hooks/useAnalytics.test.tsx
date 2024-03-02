// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { renderHook } from '@testing-library/react';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { NetworksProvider } from '@petra/core/hooks/useNetworks';
import { AccountsProvider } from '@petra/core/hooks/useAccounts';
import { AppStateProvider } from '@petra/core/hooks/useAppState';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { analyticsEvent } from '@petra/core/utils/analytics/events';
import { AnalyticsProvider, useAnalytics } from 'core/hooks/useAnalytics';
import WebStorageProvider from 'shared/providers/WebStorageProvider';

import packageJson from '../../../package.json';

jest.mock('@segment/analytics-next');
const MockedAnalyticsBrowser = jest.mocked(AnalyticsBrowser);

function createMockAnalytics(): any {
  return {
    page: jest.fn(),
    screen: jest.fn(),
    track: jest.fn(),
    user: jest.fn(() => ({
      anonymousId: jest.fn(),
    })),
  };
}

function TestApp({ children }: { children: React.ReactNode }) {
  return (
    <WebStorageProvider>
      <AppStateProvider>
        <AccountsProvider>
          <NetworksProvider>
            <MemoryRouter initialEntries={['/create-wallet']}>
              <AnalyticsProvider>{children}</AnalyticsProvider>
            </MemoryRouter>
          </NetworksProvider>
        </AccountsProvider>
      </AppStateProvider>
    </WebStorageProvider>
  );
}

describe('in development', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  test('trackEvent does nothing', async () => {
    const mockAnalytics = createMockAnalytics();
    MockedAnalyticsBrowser.load.mockReturnValue(mockAnalytics);
    const { result } = renderHook(() => useAnalytics(), { wrapper: TestApp });

    await result.current.trackEvent({
      eventType: analyticsEvent.RECEIVE_FAUCET,
      params: {
        amount: '100',
        coinType: '0x1::aptos_coin::AptosCoin',
      },
    });

    expect(mockAnalytics.track).not.toHaveBeenCalled();
  });

  test('trackPage does nothing', async () => {
    const mockAnalytics = createMockAnalytics();
    MockedAnalyticsBrowser.load.mockReturnValue(mockAnalytics);
    const { result } = renderHook(() => useAnalytics(), { wrapper: TestApp });

    await result.current.trackPage({
      page: '/create-wallet',
    });

    expect(mockAnalytics.page).not.toHaveBeenCalled();
  });

  test('trackScreen does nothing', async () => {
    const mockAnalytics = createMockAnalytics();
    MockedAnalyticsBrowser.load.mockReturnValue(mockAnalytics);
    const { result } = renderHook(() => useAnalytics(), { wrapper: TestApp });

    await result.current.trackScreen({
      screen: 'Transfer drawer',
    });

    expect(mockAnalytics.screen).not.toHaveBeenCalled();
  });
});

describe('in production', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production';
    process.env.REACT_APP_SEGMENT_WRITE_KEY = 'foobar';
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';
    delete process.env.REACT_APP_SEGMENT_WRITE_KEY;
  });

  test('it loads segment', () => {
    renderHook(() => useAnalytics(), { wrapper: TestApp });
    expect(MockedAnalyticsBrowser.load).toHaveBeenCalled();
  });

  test('trackEvent', async () => {
    const mockAnalytics = createMockAnalytics();
    MockedAnalyticsBrowser.load.mockReturnValue(mockAnalytics);
    const { result } = renderHook(() => useAnalytics(), { wrapper: TestApp });

    await result.current.trackEvent({
      eventType: analyticsEvent.RECEIVE_FAUCET,
      params: {
        amount: '100',
        coinType: '0x1::aptos_coin::AptosCoin',
      },
    });

    expect(mockAnalytics.track).toHaveBeenCalledWith('Click faucet', {
      address: undefined,
      category: 'Faucet',
      name: 'Click faucet',
      properties: {
        $browser: 'Safari',
        $extensionVersion: packageJson.version,
        $os: undefined,
        action: 'Click faucet',
        amount: '100',
        coinType: '0x1::aptos_coin::AptosCoin',
        eventEnv: 'event',
        network: 'Mainnet',
        value: undefined,
        walletId: undefined,
      },
      type: 'track',
    });
  });

  test('trackPage', async () => {
    const mockAnalytics = createMockAnalytics();
    MockedAnalyticsBrowser.load.mockReturnValue(mockAnalytics);
    const { result } = renderHook(() => useAnalytics(), { wrapper: TestApp });

    await result.current.trackPage({
      page: '/create-wallet',
    });

    expect(mockAnalytics.page).toHaveBeenCalledWith('/create-wallet', {
      address: undefined,
      properties: {
        $browser: 'Safari',
        $extensionVersion: packageJson.version,
        $os: undefined,
        eventEnv: 'event',
        network: 'Mainnet',
        walletId: undefined,
      },
    });
  });

  test('trackScreen', async () => {
    const mockAnalytics = createMockAnalytics();
    MockedAnalyticsBrowser.load.mockReturnValue(mockAnalytics);
    const { result } = renderHook(() => useAnalytics(), { wrapper: TestApp });

    await result.current.trackScreen({
      screen: 'Transfer drawer',
    });

    expect(mockAnalytics.screen).toHaveBeenCalledWith(
      'Transfer drawer',
      'Transfer drawer',
      {
        address: undefined,
        properties: {
          $browser: 'Safari',
          $extensionVersion: packageJson.version,
          $os: undefined,
          eventEnv: 'event',
          network: 'Mainnet',
          walletId: undefined,
        },
      },
    );
  });
});
