// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { renderHook, waitFor } from '@testing-library/react';
import React, { PropsWithChildren, StrictMode, useMemo } from 'react';
import FlagProvider, { StatsigConfig } from './FlagProvider';
import useFlag from './useFlag';

const baseTestConfig: StatsigConfig = {
  options: { localMode: true },
  sdkKey: 'client-mock-sdk-key',
};

type StatsigTestConfigProviderFlags = PropsWithChildren<{
  flags?: string[];
}>;

function TestStatsigProvider({
  children,
  flags,
}: StatsigTestConfigProviderFlags) {
  const mergedConfig = useMemo(
    () => ({ ...baseTestConfig, overrides: flags }),
    [flags],
  );

  return (
    <StrictMode>
      <FlagProvider config={mergedConfig}>{children}</FlagProvider>
    </StrictMode>
  );
}

describe('useGate', () => {
  it('returns false when flag is not set', async () => {
    const { result } = renderHook(() => useFlag('someFlag'), {
      wrapper: (props) => <TestStatsigProvider {...props} />,
    });

    expect(result.current).toBeUndefined();
    await waitFor(() => expect(result.current).toBeFalsy());
  });

  test('returns true when flag is set', async () => {
    const flags = ['someFlag'];
    const { result } = renderHook(() => useFlag('someFlag'), {
      wrapper: (props) => <TestStatsigProvider {...props} flags={flags} />,
    });

    expect(result.current).toBeUndefined();
    await waitFor(() => expect(result.current).toBeTruthy());
  });
});
