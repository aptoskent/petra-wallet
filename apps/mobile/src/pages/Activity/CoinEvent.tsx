// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as Types from '@petra/core/activity/types';
import { customColors } from '@petra/core/colors';
import PetraAddress from 'core/components/PetraAddress';
import Typography from 'core/components/Typography';
import React from 'react';
import { View } from 'react-native';
import ActivityGasSVG from 'shared/assets/svgs/activity_gas';
import ActivityReceiveSVG from 'shared/assets/svgs/activity_receive';
import ActivitySendSVG from 'shared/assets/svgs/activity_send';
import ActivitySendFailureSvg from 'shared/assets/svgs/activity_send_failure';
import ActivitySwapSVG from 'shared/assets/svgs/activity_swap';
import ActivitySwapFailureSVG from 'shared/assets/svgs/activity_swap_failure';
import { APTOS_COIN_INFO } from 'shared/constants';
import { i18nmock } from 'strings';
import BaseEvent, {
  ActivityEventProps,
  BaseActivityStatusText,
} from './BaseEvent';
import { formatCoin, symbolForCoin } from './util';

function SendCoinEvent({ event }: ActivityEventProps<Types.SendCoinEvent>) {
  const youSent = i18nmock('assets:activity.youSent');
  const toSend = i18nmock('assets:activity.toSend');

  const coin = symbolForCoin(event.coin, event.coinInfo);
  const receiver = <PetraAddress address={event.receiver} bold />;

  const text = (
    <Typography variant="body" numberOfLines={2}>
      <BaseActivityStatusText
        status={event.success}
        successText={youSent}
        failText={toSend}
      />{' '}
      {receiver} {`${coin}.`}
    </Typography>
  );

  const amount = formatCoin(event.amount, event.coinInfo);
  let extra;
  if (amount) {
    extra = (
      <Typography variant="body" weight="600" numberOfLines={1}>
        -{amount}
      </Typography>
    );
  }
  return (
    <BaseEvent
      icon={event.success ? <ActivitySendSVG /> : <ActivitySendFailureSvg />}
      text={text}
      extra={extra}
    />
  );
}

function ReceiveCoinEvent({
  event,
}: ActivityEventProps<Types.ReceiveCoinEvent>) {
  const youReceived = i18nmock('assets:activity.youReceived');
  const from = i18nmock('general:from');
  const coin = symbolForCoin(event.coin, event.coinInfo);
  const sender = <PetraAddress address={event.sender} bold />;
  const text = (
    <Typography variant="body" numberOfLines={2}>
      {youReceived} {coin} {from} {sender}.
    </Typography>
  );

  const amount = formatCoin(event.amount, event.coinInfo);
  let extra;
  if (amount) {
    extra = (
      <Typography
        variant="body"
        weight="600"
        numberOfLines={1}
        color={customColors.green[500]}
      >
        +{amount}
      </Typography>
    );
  }

  return <BaseEvent icon={<ActivityReceiveSVG />} text={text} extra={extra} />;
}

function SwapCoinEvent({ event }: ActivityEventProps<Types.SwapCoinEvent>) {
  const youSwapped = i18nmock('assets:activity.youSwapped');
  const toSwap = i18nmock('assets:activity.toSwap');
  const coin = symbolForCoin(event.coin, event.coinInfo);
  const swapCoin = symbolForCoin(event.swapCoin, event.coinInfo);
  const text = (
    <Typography variant="body" numberOfLines={2}>
      <BaseActivityStatusText
        status={event.success}
        successText={youSwapped}
        failText={toSwap}
      />
      {` ${coin} → ${swapCoin}`}
    </Typography>
  );

  const amount = formatCoin(event.amount, event.coinInfo);
  const swapAmount = formatCoin(event.swapAmount, event.coinInfo);
  let extra;
  if (amount || swapAmount) {
    extra = (
      <View style={{ alignItems: 'flex-end' }}>
        <Typography
          variant="body"
          weight="600"
          numberOfLines={1}
          color={customColors.green[500]}
        >
          +{swapAmount ?? swapCoin}
        </Typography>
        <Typography
          variant="body"
          numberOfLines={1}
          weight="400"
          color={customColors.navy[500]}
        >
          -{amount ?? coin}
        </Typography>
      </View>
    );
  }

  return (
    <BaseEvent
      icon={event.success ? <ActivitySwapSVG /> : <ActivitySwapFailureSVG />}
      text={text}
      extra={extra}
    />
  );
}

function GasCoinEvent({ event }: ActivityEventProps<Types.GasEvent>) {
  // TODO: Use entry function name if possible
  const networkFee = i18nmock('assets:activity.networkFee');
  const text = (
    <Typography variant="body" numberOfLines={2}>
      {networkFee}: #{event.version.toString()}
    </Typography>
  );

  const amount = formatCoin(event.gas, APTOS_COIN_INFO);
  let extra;
  if (amount) {
    extra = (
      <Typography variant="body" weight="600" numberOfLines={1}>
        -{amount}
      </Typography>
    );
  }
  return <BaseEvent icon={<ActivityGasSVG />} text={text} extra={extra} />;
}

export { GasCoinEvent, ReceiveCoinEvent, SendCoinEvent, SwapCoinEvent };
