// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-underscore-dangle */

import React from 'react';
import * as Types from '@petra/core/activity/types';
import {
  SendTokenEvent,
  ReceiveTokenEvent,
  SendTokenOfferEvent,
  ReceiveTokenOfferEvent,
  MintTokenEvent,
} from './TokenEvent';
import {
  SendCoinEvent,
  ReceiveCoinEvent,
  SwapCoinEvent,
  GasCoinEvent,
} from './CoinEvent';
import StakeEvent from './StakeEvent';

interface ActivityListItemProps {
  event: Types.ActivityEvent;
}

function ActivityListItem({ event }: ActivityListItemProps) {
  switch (event._type) {
    case 'send':
      return <SendCoinEvent event={event} />;
    case 'receive':
      return <ReceiveCoinEvent event={event} />;
    case 'swap':
      return <SwapCoinEvent event={event} />;
    case 'gas':
      return <GasCoinEvent event={event} />;
    case 'send_token':
      return <SendTokenEvent event={event} />;
    case 'receive_token':
      return <ReceiveTokenEvent event={event} />;
    case 'send_token_offer':
      return <SendTokenOfferEvent event={event} />;
    case 'receive_token_offer':
      return <ReceiveTokenOfferEvent event={event} />;
    case 'mint_token':
      return <MintTokenEvent event={event} />;
    case 'add-stake':
    case 'unstake':
    case 'withdraw-stake':
      return <StakeEvent event={event} />;
    default:
      return null;
  }
}

export default ActivityListItem;
