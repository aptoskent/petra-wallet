// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useRoutes } from 'react-router-dom';
import { AccountsProvider } from '@petra/core/hooks/useAccounts';
import { useAppState } from '@petra/core/hooks/useAppState';
import { NetworksProvider } from '@petra/core/hooks/useNetworks';
import { AnalyticsProvider } from 'core/hooks/useAnalytics';
import {
  KeystoneRequestContext,
  useKeystoneRequestContextValue,
} from 'modules/keystone';
import CachedRestApiProvider from 'shared/providers/CachedRestApiProvider';
import SignerProvider from 'shared/providers/SignerProvider';
import { ApprovalRequestContextProvider, usePromptState } from './hooks';
import { routes } from './routes';

export default function Prompt() {
  const promptRoutes = useRoutes(routes);
  const { isAppStateReady } = useAppState();
  const { approvalRequest } = usePromptState();
  const keystoneContext = useKeystoneRequestContextValue({
    urType: 'aptos-signature',
  });

  // Pause rendering until state is ready
  return isAppStateReady && approvalRequest !== undefined ? (
    <AccountsProvider>
      <NetworksProvider>
        <AnalyticsProvider>
          <CachedRestApiProvider>
            <SignerProvider>
              <KeystoneRequestContext.Provider value={keystoneContext}>
                <ApprovalRequestContextProvider
                  approvalRequest={approvalRequest}
                >
                  {promptRoutes}
                </ApprovalRequestContextProvider>
              </KeystoneRequestContext.Provider>
            </SignerProvider>
          </CachedRestApiProvider>
        </AnalyticsProvider>
      </NetworksProvider>
    </AccountsProvider>
  ) : null;
}
