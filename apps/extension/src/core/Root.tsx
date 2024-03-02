// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  ChakraProvider,
  StyleFunctionProps,
  mergeThemeOverride,
  theme as baseTheme,
} from '@chakra-ui/react';
import { setEncryptedStateMigrationConfig } from '@petra/core/encryptedState';
import bip44MnemonicMigration from '@petra/core/encryptedState/migrations/bip44Mnemonic';
import { UserFlagProvider } from '@petra/core/flags';
import { AppStateProvider } from '@petra/core/hooks/useAppState';
import { AccountsProvider } from '@petra/core/hooks/useAccounts';
import { NetworksProvider } from '@petra/core/hooks/useNetworks';
import { setKeyDerivationImplementation } from '@petra/core/utils/keyDerivation';
import pbkdf2DeriveKey from '@petra/core/utils/pbkdf2DeriveKey';
import React from 'react';
import { type IntlConfig, IntlProvider } from 'react-intl';
import { QueryClientProvider, QueryClient } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { customColors } from '@petra/core/colors';
import { AnalyticsProvider } from 'core/hooks/useAnalytics';
import WebStorageProvider from 'shared/providers/WebStorageProvider';

// Set derivation function implementations
setKeyDerivationImplementation('pbkdf2', pbkdf2DeriveKey);

setEncryptedStateMigrationConfig({
  migrations: [bip44MnemonicMigration],
});

const isProductionEnv = process.env.NODE_ENV === 'production';

// `extendTheme` is doing something funky with colors, so we need to manually merge
const baseThemeWithColors = { ...baseTheme };
for (const entry of Object.entries(baseThemeWithColors.colors)) {
  const [color, palette] = entry;
  if (typeof palette === 'object' && color in customColors) {
    Object.assign(palette, customColors[color as keyof typeof customColors]);
  }
}

const theme = mergeThemeOverride(baseThemeWithColors, {
  colors: customColors,
  components: {
    Spinner: {
      baseStyle: (props: StyleFunctionProps) => ({
        color: props.colorMode === 'dark' ? 'navy.200' : 'navy.700',
      }),
    },
  },
  initialColorMode: 'light',
  styles: {
    global: {
      'html, body': {
        margin: 0,
        overflow: isProductionEnv ? 'hidden' : undefined,
        padding: 0,
      },
    },
  },
  useSystemColorMode: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: isProductionEnv,
    },
  },
});

// Attempt to connect and notify background script that the extension popup was opened
if (isProductionEnv) {
  // TODO: figure out if this is needed
  chrome.runtime.connect();
  chrome.runtime.sendMessage({ type: 'popupOpened' }).then();
}

function loadLocaleData(locale: IntlConfig['locale']) {
  if (locale === 'zh') {
    return import('compiled-lang/zh.json') as unknown as Promise<
      IntlConfig['messages']
    >;
  }

  return Promise.resolve(undefined);
}

const statsigConfig = {
  options: {
    localMode: process.env.NODE_ENV !== 'production',
  },
  overrides: process.env.REACT_APP_STATSIG_LOCAL_OVERRIDES?.split(','),
  sdkKey: process.env.REACT_APP_STATSIG_SDK_KEY ?? 'client-local',
};

type RootProps = React.PropsWithChildren<{}>;

/**
 * The top-level component which renders shared context providers.
 */
export default function Root({ children }: RootProps) {
  // TODO: Use navigator.language or similar to provide this.
  const locale = 'en';

  const [messages, setMessages] = React.useState<
    IntlConfig['messages'] | undefined
  >(undefined);
  React.useEffect(() => {
    loadLocaleData(locale).then(setMessages);
  }, [locale]);

  return (
    <React.StrictMode>
      <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
        <ChakraProvider theme={theme}>
          <WebStorageProvider>
            <AppStateProvider>
              <AccountsProvider>
                <UserFlagProvider config={statsigConfig}>
                  <NetworksProvider>
                    <QueryClientProvider client={queryClient}>
                      <MemoryRouter>
                        <AnalyticsProvider>{children}</AnalyticsProvider>
                      </MemoryRouter>
                    </QueryClientProvider>
                  </NetworksProvider>
                </UserFlagProvider>
              </AccountsProvider>
            </AppStateProvider>
          </WebStorageProvider>
        </ChakraProvider>
      </IntlProvider>
    </React.StrictMode>
  );
}
