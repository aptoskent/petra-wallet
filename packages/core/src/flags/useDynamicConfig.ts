// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useContext, useMemo } from 'react';
import { DynamicConfig, Statsig, StatsigContext } from 'statsig-react';

/**
 * A hook that returns the specified dynamic config
 * Currently implemented using https://statsig.com/.
 */
export default function useDynamicConfig(
  configName: string,
): DynamicConfig | undefined {
  const { initStarted, initialized, userVersion } = useContext(StatsigContext);

  return useMemo(
    () => (initialized ? Statsig.getConfig(configName) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialized, initStarted, configName, userVersion],
  );
}
