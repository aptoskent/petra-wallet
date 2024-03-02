// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useContext, useMemo } from 'react';
import { Statsig, StatsigContext } from 'statsig-react';

/**
 * A hook that returns whether the specified feature flag is enabled.
 * Currently implemented using https://statsig.com/.
 */
export default function useFlag(flagName: string) {
  const { initStarted, initialized, userVersion } = useContext(StatsigContext);

  return useMemo(
    () => (initialized ? Statsig.checkGate(flagName) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialized, initStarted, flagName, userVersion],
  );
}
