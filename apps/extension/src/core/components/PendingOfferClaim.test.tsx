// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { screen, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { AppStateProvider } from '@petra/core/hooks/useAppState';
import { AccountsProvider } from '@petra/core/hooks/useAccounts';
import { MemoryRouter } from 'react-router-dom';
import { NetworksProvider } from '@petra/core/hooks/useNetworks';
import CachedRestApiProvider from 'shared/providers/CachedRestApiProvider';
import WebStorageProvider from 'shared/providers/WebStorageProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { TokenOfferClaimProvider } from '@petra/core/hooks/useTokenOfferClaim';
import { AptosName } from '@petra/core/utils/names';
import PendingOfferClaim from './PendingOfferClaim';

function TestApp({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <IntlProvider locale="en">
      <WebStorageProvider>
        <AppStateProvider>
          <AccountsProvider>
            <NetworksProvider>
              <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                  <CachedRestApiProvider>
                    <TokenOfferClaimProvider>
                      {children}
                    </TokenOfferClaimProvider>
                  </CachedRestApiProvider>
                </MemoryRouter>
              </QueryClientProvider>
            </NetworksProvider>
          </AccountsProvider>
        </AppStateProvider>
      </WebStorageProvider>
    </IntlProvider>
  );
}

it('renders pending offers', async () => {
  const pendingToken = {
    amount: 1,
    collectionData: {
      collectionDataIdHash:
        'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
      collectionName: 'Aptos Names V1',
      creatorAddress:
        '0xf019d3c5901345a7f454848ce702943d1e629ded16a911f3b3b566a44ab1402d',
      description: '.apt names from the Aptos Foundation',
      idHash:
        'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
      metadataUri: 'https://aptosnames.com',
      name: 'Aptos Names V1',
      supply: 0,
    },
    fromAddress:
      '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
    fromAddressName: new AptosName('sfsabkjgbeg.apt'),
    lastTransactionTimestamp: '2023-02-27T18:33:17',
    lastTransactionVersion: 438555272,
    toAddress:
      '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
    toAddressName: new AptosName('kentawhite.apt'),
    tokenData: {
      amount: 1,
      collection: 'Aptos Names V1',
      collectionData: {},
      collectionDataIdHash:
        'a36e54b7983a85a23e048c77786b81649f757806a443930071f3f3289ecbd950',
      creator:
        '0xf019d3c5901345a7f454848ce702943d1e629ded16a911f3b3b566a44ab1402d',
      description: 'This is an official Aptos Foundation Name Service Name',
      idHash:
        '875b46e9f109652b5bdf7c366ebbd77c41e66c6fdee403737520257084fa794b',
      isSoulbound: false,
      lastTxnVersion: 438555272n,
      metadataUri:
        'https://www.aptosnames.com/api/v1/metadata/testingtesting1234.apt',
      name: 'testingtesting1234.apt',
      propertyVersion: 1,
      tokenProperties: {},
      tokenStandard: 'v2' as const,
    },
  };
  render(<PendingOfferClaim pendingToken={pendingToken} />, {
    wrapper: TestApp,
  });
  expect(screen.getAllByText('testingtesting1234.apt')).toHaveLength(2);
  expect(screen.getByText('From: sfsabkjgbeg.apt'));
  expect(screen.getByRole('button')).toHaveTextContent('Accept');
});
