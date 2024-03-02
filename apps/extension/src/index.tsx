// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import * as Sentry from '@sentry/react';
import { synchronizeTime } from '@petra/core/utils/server-time';
import { createRoot } from 'react-dom/client';
import { useRoutes } from 'react-router-dom';
import { useAppState } from '@petra/core/hooks/useAppState';
import { TokenOfferClaimProvider } from '@petra/core/hooks/useTokenOfferClaim';
import { createStandaloneToast } from '@chakra-ui/toast';
import { routes } from 'core/routes';
import { isMobile } from '@petra/core/utils/browser';
import filterAnalyticsEvent from '@petra/core/utils/analytics';
import Root from 'core/Root';
import {
  KeystoneRequestContext,
  useKeystoneRequestContextValue,
} from 'modules/keystone';
import CachedRestApiProvider from 'shared/providers/CachedRestApiProvider';
import SignerProvider from 'shared/providers/SignerProvider';
import packageJson from '../package.json';

const { ToastContainer } = createStandaloneToast();

// eslint-disable-next-line global-require
window.Buffer = window.Buffer || require('buffer').Buffer;

// Synchronize client clock with server time.
synchronizeTime().then();

// Error reporting with Sentry.
Sentry.init({
  beforeSend: filterAnalyticsEvent,
  beforeSendTransaction: filterAnalyticsEvent,
  dsn: process.env.REACT_APP_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  ignoreErrors: [
    // This error is expected to happen if the dapp hasn't set up a listener
    // for our messages.
    'Could not establish connection. Receiving end does not exist.',
  ],
  release: `petra-extension@${packageJson.version}`,
  tracesSampleRate: 1.0,
});

function App() {
  const appRoutes = useRoutes(routes);
  const { isAppStateReady } = useAppState();
  const keystoneContext = useKeystoneRequestContextValue({
    urType: 'aptos-signature',
  });

  // Pause rendering until state is ready
  return isAppStateReady ? (
    <CachedRestApiProvider>
      <SignerProvider>
        <KeystoneRequestContext.Provider value={keystoneContext}>
          <TokenOfferClaimProvider>{appRoutes}</TokenOfferClaimProvider>
        </KeystoneRequestContext.Provider>
      </SignerProvider>
    </CachedRestApiProvider>
  ) : null;
}

// Force window size if rendering in the extension popup
if (window && window.origin.startsWith('chrome-extension') && !isMobile()) {
  const { minHeight, minWidth } = window.getComputedStyle(document.body);
  Object.assign(document.body.style, { height: minHeight, width: minWidth });
}

const root = createRoot(document.getElementById('root') as Element);

// Async load development container only in development mode
const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const devContainerPromise = isDevelopment
  ? import('core/layouts/DevelopmentContainer')
  : Promise.resolve(undefined);

devContainerPromise.then((devModule) => {
  const MaybeDevelopmentContainer =
    devModule?.default ?? (({ children }) => children);

  root.render(
    <Root>
      <MaybeDevelopmentContainer>
        <App />
      </MaybeDevelopmentContainer>
      <ToastContainer />
    </Root>,
  );
});
