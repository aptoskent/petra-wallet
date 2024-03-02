// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { screen, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { AptosName } from '@petra/core/utils/names';
import { ActivityItem } from '@petra/core/types/activity';
import { ActivityListItem } from './ActivityListItem';

function TestApp({ children }: { children: React.ReactNode }) {
  return (
    <IntlProvider locale="en">
      <MemoryRouter>{children}</MemoryRouter>
    </IntlProvider>
  );
}

it('renders coin transfers', async () => {
  const activityItem: ActivityItem = {
    amount: -100000000000n,
    coinInfo: {
      decimals: 8,
      name: 'Aptos Coin',
      symbol: 'APT',
      type: '0x1::aptos_coin::AptosCoin',
    },
    creationNum: 3,
    recipient:
      '0x75d0b7d54c3b26c7d2b4f8e21c22be555e691e8d4a253d50d3165e87d6ba2cb6',
    recipientName: new AptosName('foobar.apt'),
    sender:
      '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
    senderName: new AptosName('kentawhite.apt'),
    sequenceNum: 636,
    status: 'success',
    timestamp: 1677574285000,
    txnVersion: 439763481n,
    type: 'coinTransfer',
  };

  render(<ActivityListItem item={activityItem} />, {
    wrapper: TestApp,
  });

  expect(screen.getByText('-1,000 APT'));
  expect(screen.getByText('To foobar.apt'));
});
