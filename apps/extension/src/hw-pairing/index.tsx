// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useAppState } from '@petra/core/hooks/useAppState';
import { AccountsProvider } from '@petra/core/hooks/useAccounts';
import { NetworksProvider } from '@petra/core/hooks/useNetworks';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Root from 'core/Root';
import { routes } from './routes';

function App() {
  const appRoutes = useRoutes(routes);
  const { isAppStateReady } = useAppState();

  // Pause rendering until state is ready
  return isAppStateReady ? (
    <AccountsProvider>
      <NetworksProvider>{appRoutes}</NetworksProvider>
    </AccountsProvider>
  ) : null;
}

const root = createRoot(document.getElementById('root') as Element);
root.render(
  <Root>
    <App />
  </Root>,
);
