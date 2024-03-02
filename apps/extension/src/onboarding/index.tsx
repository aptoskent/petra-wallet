// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useRoutes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { useAppState } from '@petra/core/hooks/useAppState';
import { routes } from 'core/routes';
import Root from 'core/Root';
import DesktopOnboarding from './components/DesktopOnboarding';

function App() {
  const appRoutes = useRoutes(routes);
  const { isAppStateReady } = useAppState();

  // Pause rendering until state is ready
  return isAppStateReady ? (
    <DesktopOnboarding>{appRoutes}</DesktopOnboarding>
  ) : null;
}

const root = createRoot(document.getElementById('onboarding') as Element);
root.render(
  <Root>
    <App />
  </Root>,
);
