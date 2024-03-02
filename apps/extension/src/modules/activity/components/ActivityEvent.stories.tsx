// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-extend-native */

import * as React from 'react';
import { Box } from '@chakra-ui/react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import testList from '@petra/core/hooks/coinsLists/testnetList';
import { RawCoinInfo } from '@manahippo/coin-list';
import * as Types from '@petra/core/activity/types';
import ActivityEvent, { ActivityEventProps } from './ActivityEvent';

// TODO(https://github.com/storybookjs/storybook/issues/13950)
// @ts-ignore
BigInt.prototype.toJSON = function toJSON() {
  return this.toString();
};

const COIN_LIST = testList.reduce((acc, x) => {
  acc[x.token_type.type] = x;
  return acc;
}, {} as Record<string, RawCoinInfo>);

export default {
  component: ActivityEvent,
  title: 'ActivityEvent',
} as ComponentMeta<typeof ActivityEvent>;

// eslint-disable-next-line react/function-component-definition
const Template: ComponentStory<typeof ActivityEvent> = (
  args: ActivityEventProps,
) => (
  <Box
    border="1px solid #dee1e3"
    fontFamily="Work Sans, sans-serif"
    width="390px"
  >
    <ActivityEvent {...args} coinList={COIN_LIST} />
  </Box>
);

export const SendCoinEvent = Template.bind({});

SendCoinEvent.args = {
  activityEvent: {
    _type: 'send',
    account: '0x1',
    amount: 1000000000n,
    coin: '0x1::aptos_coin::AptosCoin',
    gas: 192800n,
    receiver: {
      address: '0x3',
      name: undefined,
    },
    success: true,
    timestamp: new Date('2022-03-01T19:08:21'),
    version: 98290392n,
  } as Types.SendCoinEvent,
};

export const ReceiveCoinEvent = Template.bind({});

ReceiveCoinEvent.args = {
  activityEvent: {
    _type: 'receive',
    account: '0x1',
    amount: 1019620000n,
    coin: '0x1::aptos_coin::AptosCoin',
    gas: 192800n,
    sender: {
      address:
        '0x9efbf0ccb6c07dcab7dc1e3c88024ce4adc49f175bdd8d0ebb672c5262c5b3be',
      name: undefined,
    },
    success: true,
    timestamp: new Date('2022-03-01T19:08:21'),
    version: 98290392n,
  } as Types.ReceiveCoinEvent,
};

export const SwapCoinEvent = Template.bind({});

SwapCoinEvent.args = {
  activityEvent: {
    _type: 'swap',
    account: '0x1',
    amount: 1899000000n,
    coin: '0x1::aptos_coin::AptosCoin',
    gas: 192800n,
    success: true,
    swapAmount: 1230000n,
    swapCoin:
      '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T',
    timestamp: new Date('2022-03-01T19:08:21'),
    version: 98290392n,
  } as Types.SwapCoinEvent,
};

export const GasEvent = Template.bind({});

GasEvent.args = {
  activityEvent: {
    _type: 'gas',
    account: '0x1',
    gas: 192800n,
    success: true,
    timestamp: new Date('2022-03-01T19:08:21'),
    version: 98290392n,
  } as Types.GasEvent,
};

export const SendTokenEvent = Template.bind({});

SendTokenEvent.args = {
  activityEvent: {
    _type: 'send_token',
    account:
      '0x46bb9b717d8a23b2dde3e70de48ad191cb2fd7fdf5f2a9e257079b53965e65c5',
    collection: 'Savage Nation',
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
  } as Types.SendTokenEvent,
};

export const ReceiveTokenEvent = Template.bind({});

ReceiveTokenEvent.args = {
  activityEvent: {
    _type: 'receive_token',
    account:
      '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
    collection: 'Aptos Names V1',
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
  } as Types.ReceiveTokenEvent,
};

export const SendTokenOfferEvent = Template.bind({});

SendTokenOfferEvent.args = {
  activityEvent: {
    _type: 'send_token_offer',
    account:
      '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
    collection: 'Aptos Names V1',
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
  } as Types.SendTokenOfferEvent,
};

export const ReceiveTokenOfferEvent = Template.bind({});

ReceiveTokenOfferEvent.args = {
  activityEvent: {
    _type: 'receive_token_offer',
    account:
      '0x3d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b33',
    collection: 'Aptos Names V1',
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
  } as Types.ReceiveTokenOfferEvent,
};
