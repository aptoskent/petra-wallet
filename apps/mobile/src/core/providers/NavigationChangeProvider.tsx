// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StackActions,
  NavigationContainerRefWithCurrent,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { IS_DEVELOPMENT } from 'shared/utils';
import SegmentClient from 'core/utils/segmentClient';
import { useAccounts } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { defaultNetworkName } from '@petra/core/types';
import makeContext from '@petra/core/hooks/makeContext';

export const [PetraNavigationContext, usePetraNavigationContext] =
  makeContext<PetraNavigationContextValue>('PetraNavigationContext');

export interface PetraNavigationContextValue {
  handleOnReady: () => void;
  handleOnStateChange: (state: any) => void;
  handleResetRoot: () => void;
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
  routeName: string;
}

interface NavigationProviderProps {
  children: JSX.Element;
}

const getActiveRouteName = (state: any | undefined): string => {
  if (!state || typeof state.index !== 'number') {
    return 'Unknown';
  }

  const route = state.routes[state.index];

  if (route.state) {
    return getActiveRouteName(route.state);
  }

  return route.name;
};

//
// Segment Documentation with information on react-navigation integration available here:
// https://segment.com/docs/connections/sources/catalog/libraries/mobile/react-native/
export default function NavigationChangeProvider({
  children,
}: NavigationProviderProps) {
  const [routeName, setRouteName] = useState('Unknown');
  const { activeAccountAddress } = useAccounts();
  const { activeNetworkName } = useNetworks();
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | undefined>();

  const handleOnStateChange = useCallback(
    (state: any) => {
      const newRouteName = getActiveRouteName(state);
      if (routeName !== newRouteName) {
        if (!IS_DEVELOPMENT) {
          void SegmentClient.screen(newRouteName, {
            address: activeAccountAddress,
            network: activeNetworkName || defaultNetworkName,
          });
        }
        setRouteName(newRouteName);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeAccountAddress, activeNetworkName],
  );

  const handleOnReady = useCallback(
    () => () => {
      routeNameRef.current = navigationRef?.getCurrentRoute?.()?.name;
    },
    [navigationRef],
  );

  const handleResetRoot = useCallback(() => {
    // this only works with Send Flow currently because to exit the send flow
    // we popToTop.  Each new navigation situation will have to be addressed separately
    if (navigationRef?.isReady()) {
      navigationRef?.dispatch(StackActions.popToTop());
    }
  }, [navigationRef]);

  const navigationValue = useMemo(
    () => ({
      handleOnReady,
      handleOnStateChange,
      handleResetRoot,
      navigationRef,
      routeName,
    }),
    [
      handleOnStateChange,
      handleOnReady,
      handleResetRoot,
      navigationRef,
      routeName,
    ],
  );

  return (
    <PetraNavigationContext.Provider value={navigationValue}>
      {children}
    </PetraNavigationContext.Provider>
  );
}
