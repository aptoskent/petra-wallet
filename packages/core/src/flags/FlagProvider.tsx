// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { PropsWithChildren, useMemo } from 'react';
import {
  StatsigOptions,
  StatsigProvider as DefaultStatsigProvider,
} from 'statsig-react';
import StatsigOverrides from './StatsigOverrides';

const defaultOptions = {
  disableAutoMetricsLogging: true,
  disableCurrentPageLogging: true,
  disableErrorLogging: true,
};

export interface StatsigConfig {
  ProviderOverride?: typeof DefaultStatsigProvider;
  options?: StatsigOptions;
  overrides?: string[];
  sdkKey: string;
}

export type FlagProviderProps = PropsWithChildren<{
  config: StatsigConfig;
  userId?: string;
}>;

/**
 * Provider for feature flags.
 *
 * Currently implemented using https://statsig.com/.
 */
export default function FlagProvider({
  children,
  config,
  userId,
}: FlagProviderProps) {
  const { ProviderOverride, options, overrides, sdkKey } = config;
  const mergedOptions = useMemo(
    () => ({ ...defaultOptions, ...options }),
    [options],
  );
  const user = useMemo(() => ({ userID: userId }), [userId]);

  const StatsigProvider = ProviderOverride ?? DefaultStatsigProvider;

  return (
    <StatsigProvider sdkKey={sdkKey} user={user} options={mergedOptions}>
      {overrides !== undefined ? (
        <StatsigOverrides overrides={overrides}>{children}</StatsigOverrides>
      ) : (
        children
      )}
    </StatsigProvider>
  );
}
