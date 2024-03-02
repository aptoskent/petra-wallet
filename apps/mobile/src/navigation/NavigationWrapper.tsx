// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { usePetraNavigationContext } from 'core/providers/NavigationChangeProvider';

function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const { handleOnReady, handleOnStateChange, navigationRef } =
    usePetraNavigationContext();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleOnReady}
      onStateChange={handleOnStateChange}
    >
      {children}
    </NavigationContainer>
  );
}

export default NavigationWrapper;
