// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable max-len */
import { customColors } from '@petra/core/colors';
import { CoinGeckoProvider } from '@petra/core/hooks/useCoinGecko';
import { UserFlagProvider } from '@petra/core/flags';
import {
  AppStateProvider,
  AccountsProvider,
  NetworksProvider,
} from 'core/hooks';
import { KeychainProvider } from 'core/hooks/useKeychain';
import { DeeplinkProvider } from 'core/providers/DeeplinkProvider';
import MobileStorageProvider from 'core/providers/MobileStorageProvider';
import { PromptProvider } from 'core/providers/PromptProvider';
import AlertModalProvider from 'core/providers/AlertModalProvider';
import NavigationChangeProvider from 'core/providers/NavigationChangeProvider';
import { ThemeProvider } from 'core/providers/ThemeProvider';
import ToastProvider from 'core/providers/ToastProvider';
import { WebViewPopoverProvider } from 'core/providers/WebViewPopoverProvider';
import SignerProvider from 'core/shared/providers/SignerProvider';
import WebRestApiProvider from 'core/shared/providers/WebRestApiProvider';
import React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AnalyticsProvider } from '@segment/analytics-react-native';
import { REACT_APP_STATSIG_SDK_KEY } from '@env';
import SegmentClient from 'core/utils/segmentClient';
import { StatsigProvider } from 'statsig-react-native';
import AppRoot from './navigation/AppRoot';
import NavigationWrapper from './navigation/NavigationWrapper';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

// see statsig options docs for additional information
// https://docs.statsig.com/client/reactNativeSDK#statsig-options
const statsigConfig = {
  // The react-native implementation injects some extra useful metadata
  ProviderOverride: StatsigProvider,
  sdkKey: REACT_APP_STATSIG_SDK_KEY ?? 'client-local',
};

export default function App() {
  return (
    <GestureHandlerRootView
      style={{ backgroundColor: customColors.navy['900'], flex: 1 }}
    >
      {/* prettier-ignore */}
      <SafeAreaProvider>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <MobileStorageProvider>
              <ToastProvider>
                  <AppStateProvider>{/* depends on MobileStorageProvider */}
                    <AccountsProvider>{/* depends on AppStateProvider */}
                      <UserFlagProvider config={statsigConfig}>{/* depends on AppStateProvider */}
                        <NetworksProvider>{/* depends on AppStateProvider */}
                          <NavigationChangeProvider>
                            <NavigationWrapper>{/* depends on NetworksProvider, AccountsProvider  */}
                              <AnalyticsProvider client={SegmentClient}>
                                <DeeplinkProvider>{/* depends on ToastProvider, AnalyticsProvider, NetworksProvider */}
                                  <QueryClientProvider client={queryClient}>
                                    <WebRestApiProvider>{/* depends on NetworksProvider */}
                                      <SignerProvider>
                                        <KeychainProvider>{/* depends on AppStateProvider, AnalyticsProvider */}
                                          <PromptProvider>
                                            <WebViewPopoverProvider>
                                              <CoinGeckoProvider>
                                                <AlertModalProvider>
                                                  <AppRoot />
                                                </AlertModalProvider>
                                              </CoinGeckoProvider>
                                            </WebViewPopoverProvider>
                                          </PromptProvider>
                                        </KeychainProvider>
                                      </SignerProvider>
                                    </WebRestApiProvider>
                                  </QueryClientProvider>
                                </DeeplinkProvider>
                              </AnalyticsProvider>
                            </NavigationWrapper>
                          </NavigationChangeProvider>
                        </NetworksProvider>
                      </UserFlagProvider>
                    </AccountsProvider>
                  </AppStateProvider>
              </ToastProvider>
            </MobileStorageProvider>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
