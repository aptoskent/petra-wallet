// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { screen, render } from '@testing-library/react';
import mainnetList from '@petra/core/hooks/coinsLists/mainnetList';
import { RawCoinInfo } from '@manahippo/coin-list';
import * as Types from '@petra/core/activity/types';
import { CoinInfoData } from '@petra/core/types';
import ActivityEvent from './ActivityEvent';

const COIN_LIST = mainnetList.reduce((acc, x) => {
  acc[x.token_type.type] = x;
  return acc;
}, {} as Record<string, RawCoinInfo>);

const AptosCoinInfo: CoinInfoData = {
  decimals: 8,
  name: 'Aptos Coin',
  symbol: 'APT',
  type: '0x1::aptos_coin::AptosCoin',
};

function TestApp({ children }: { children: React.ReactNode }) {
  return <IntlProvider locale="en">{children}</IntlProvider>;
}

it('renders SendCoinEvent', () => {
  const activityEvent: Types.SendCoinEvent = {
    _type: 'send',
    account: '0x1',
    amount: 1000000000n,
    coin: '0x1::aptos_coin::AptosCoin',
    coinInfo: AptosCoinInfo,
    eventIndex: 0,
    gas: 192800n,
    receiver: {
      address: '0x3',
      name: undefined,
    },
    success: true,
    timestamp: new Date('2022-03-01T19:08:21'),
    version: 98290392n,
  };

  const { container } = render(
    <ActivityEvent activityEvent={activityEvent} coinList={COIN_LIST} />,
    {
      wrapper: TestApp,
    },
  );

  expect(container.querySelector('p')).toHaveTextContent('You sent 0x3 APT.');
  expect(screen.getByText('-10 APT')).toBeInTheDocument();
});

it('renders ReceiveCoinEvent', () => {
  const activityEvent: Types.ReceiveCoinEvent = {
    _type: 'receive',
    account: '0x1',
    amount: 1019620000n,
    coin: '0x1::aptos_coin::AptosCoin',
    coinInfo: AptosCoinInfo,
    eventIndex: 0,
    gas: 192800n,
    sender: {
      address:
        '0x9efbf0ccb6c07dcab7dc1e3c88024ce4adc49f175bdd8d0ebb672c5262c5b3be',
      name: undefined,
    },
    success: true,
    timestamp: new Date('2022-03-01T19:08:21'),
    version: 98290392n,
  };

  const { container } = render(
    <ActivityEvent activityEvent={activityEvent} coinList={COIN_LIST} />,
    {
      wrapper: TestApp,
    },
  );

  expect(container.querySelector('p')).toHaveTextContent(
    'You received APT from 0x9efbf..5b3be.',
  );
  expect(screen.getByText('+10.1962 APT')).toBeInTheDocument();
});

it('renders SwapCoinEvent', () => {
  const activityEvent: Types.SwapCoinEvent = {
    _type: 'swap',
    account: '0x1',
    amount: 1899000000n,
    coin: '0x1::aptos_coin::AptosCoin',
    coinInfo: AptosCoinInfo,
    eventIndex: 0,
    gas: 192800n,
    success: true,
    swapAmount: 1230000n,
    swapCoin:
      '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T',
    timestamp: new Date('2022-03-01T19:08:21'),
    version: 98290392n,
  };

  const { container } = render(
    <ActivityEvent activityEvent={activityEvent} coinList={COIN_LIST} />,
    {
      wrapper: TestApp,
    },
  );

  expect(container.querySelector('p')).toHaveTextContent(
    'You swapped APT → USDC.',
  );
  expect(screen.getByText('+1.23 USDC')).toBeInTheDocument();
  expect(screen.getByText('-18.99 APT')).toBeInTheDocument();
});

it('renders GasEvent', () => {
  const activityEvent: Types.GasEvent = {
    _type: 'gas',
    account: '0x1',
    eventIndex: 0,
    gas: 192800n,
    success: true,
    timestamp: new Date('2022-03-01T19:08:21'),
    version: 98290392n,
  };

  const { container } = render(
    <ActivityEvent activityEvent={activityEvent} coinList={COIN_LIST} />,
    {
      wrapper: TestApp,
    },
  );

  expect(container.querySelector('p')).toHaveTextContent(
    'Network Fee: Miscellaneous',
  );
  expect(screen.getByText('-0.001928 APT')).toBeInTheDocument();
});

it('renders SendTokenEvent', () => {
  const activityEvent: Types.SendTokenEvent = {
    _type: 'send_token',
    account:
      '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
    collection: 'Savage Nation',
    eventIndex: 0,
    gas: 191700n,
    name: 'SA#01',
    receiver: {
      address:
        '0xfe72e4ba98b4052434f7313c9c93aea1a0ee6f0c54892e6435fb92ea53cfda0a',
      name: undefined,
    },
    success: true,
    timestamp: new Date('2023-03-01T09:52:01'),
    uri: 'https://firebasestorage.googleapis.com/v0/b/aptos-marketplace-a149b.appspot.com/o/item%2Fb30380bf4bacce49923ee2ea2257a39e.avif?alt=media&token=9807b531-78d5-4fd1-81ad-03d6a62a74ed',
    version: 442086400n,
  };

  const { container } = render(
    <ActivityEvent activityEvent={activityEvent} coinList={COIN_LIST} />,
    {
      wrapper: TestApp,
    },
  );

  expect(container.querySelector('p')).toHaveTextContent(
    'You sent SA#01 0xfe72e..fda0a',
  );
});

it('renders ReceiveTokenEvent', () => {
  const activityEvent: Types.ReceiveTokenEvent = {
    _type: 'receive_token',
    account:
      '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
    collection: 'Aptos Names V1',
    eventIndex: 0,
    gas: 184500n,
    name: 'testingtesting1234.apt',
    sender: {
      address:
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
      name: undefined,
    },
    success: true,
    timestamp: new Date('2023-02-27T18:32:36'),
    uri: 'https://aptos-names-api-u6smh7xtla-uw.a.run.app/v1/image/testingtesting1234',
    version: 438554252n,
  };

  const { container } = render(
    <ActivityEvent activityEvent={activityEvent} coinList={COIN_LIST} />,
    {
      wrapper: TestApp,
    },
  );

  expect(container.querySelector('p')).toHaveTextContent(
    'You received testingtesting1234.apt 0xc548e..f72b8.',
  );
});

it('renders SendTokenOfferEvent', () => {
  const activityEvent: Types.SendTokenOfferEvent = {
    _type: 'send_token_offer',
    account:
      '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
    collection: 'Aptos Names V1',
    eventIndex: 0,
    gas: 193800n,
    name: 'testingtesting1234.apt',
    receiver: {
      address:
        '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
      name: undefined,
    },
    success: true,
    timestamp: new Date('2023-02-27T18:32:23'),
    uri: 'https://aptos-names-api-u6smh7xtla-uw.a.run.app/v1/image/testingtesting1234',
    version: 438553941n,
  };

  const { container } = render(
    <ActivityEvent activityEvent={activityEvent} coinList={COIN_LIST} />,
    {
      wrapper: TestApp,
    },
  );

  expect(container.querySelector('p')).toHaveTextContent(
    'You sent a Pending NFT to 0x3d78e..42b33: testingtesting1234.apt.',
  );
});

it('renders ReceiveTokenOfferEvent', () => {
  const activityEvent: Types.ReceiveTokenOfferEvent = {
    _type: 'receive_token_offer',
    account:
      '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
    collection: 'Aptos Names V1',
    eventIndex: 0,
    gas: 184500n,
    name: 'testingtesting1234.apt',
    sender: {
      address:
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
      name: undefined,
    },
    success: true,
    timestamp: new Date('2023-02-27T18:32:36'),
    uri: 'https://aptos-names-api-u6smh7xtla-uw.a.run.app/v1/image/testingtesting1234',
    version: 438554252n,
  };

  const { container } = render(
    <ActivityEvent activityEvent={activityEvent} coinList={COIN_LIST} />,
    {
      wrapper: TestApp,
    },
  );

  expect(container.querySelector('p')).toHaveTextContent(
    'You received a Pending NFT from 0xc548e..f72b8: testingtesting1234.apt.',
  );
});
