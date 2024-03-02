// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { PropsWithChildren, useContext, useEffect } from 'react';
import { Statsig, StatsigContext } from 'statsig-react';

export type StatsigOverridesProps = PropsWithChildren<{
  overrides: string[];
}>;

export default function StatsigOverrides({
  children,
  overrides,
}: StatsigOverridesProps) {
  const { initialized } = useContext(StatsigContext);

  useEffect(() => {
    if (initialized) {
      for (const gateName of overrides) {
        Statsig.overrideGate(gateName, true);
      }
    }
    return () => {
      if (initialized) {
        for (const gateName of overrides) {
          Statsig.removeGateOverride(gateName);
        }
      }
    };
  }, [initialized, overrides]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
