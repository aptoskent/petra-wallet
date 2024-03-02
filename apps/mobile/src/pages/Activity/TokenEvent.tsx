// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-underscore-dangle */

import * as Types from '@petra/core/activity/types';
import NFTImage from 'core/components/NFTImage';
import PetraAddress from 'core/components/PetraAddress';
import Typography from 'core/components/Typography';
import React from 'react';
import ActivityReceiveSVG from 'shared/assets/svgs/activity_receive';
import ActivityReceiveFailureSVG from 'shared/assets/svgs/activity_receive_failure';
import ActivitySendSVG from 'shared/assets/svgs/activity_send';
import ActivitySendFailureSvg from 'shared/assets/svgs/activity_send_failure';
import { i18nmock } from 'strings';
import BaseEvent, {
  ActivityEventProps,
  BaseActivityStatusText,
} from './BaseEvent';

function trimmedName(name: string) {
  const maxNameLength = 20;
  return name.length > maxNameLength
    ? `${name.substring(0, maxNameLength - 3)}...`
    : name.substring(0, maxNameLength);
}

type TokenEventProps = {
  icon: JSX.Element;
  text: JSX.Element;
  uri: string;
};

function BaseTokenEvent({ icon, text, uri }: TokenEventProps) {
  return (
    <BaseEvent
      icon={icon}
      text={text}
      extra={
        <NFTImage
          style={{ borderRadius: 4, height: 48, width: 48 }}
          size={48}
          uri={uri}
        />
      }
    />
  );
}

function SendTokenEvent({ event }: ActivityEventProps<Types.SendTokenEvent>) {
  const youSent = i18nmock('assets:activity.youSent');
  const toSend = i18nmock('assets:activity.toSend');
  const receiver = <PetraAddress address={event.receiver} bold />;
  const text = (
    <Typography variant="body" numberOfLines={2}>
      <BaseActivityStatusText
        status={event.success}
        successText={youSent}
        failText={toSend}
      />
      {` ${trimmedName(event.name)} to `} {receiver}.
    </Typography>
  );
  return (
    <BaseTokenEvent
      icon={event.success ? <ActivitySendSVG /> : <ActivitySendFailureSvg />}
      text={text}
      uri={event.uri}
    />
  );
}

function ReceiveTokenEvent({
  event,
}: ActivityEventProps<Types.ReceiveTokenEvent>) {
  let text;
  if (event.sender) {
    const sender = <PetraAddress address={event.sender} bold />;
    text = (
      <Typography variant="body" numberOfLines={2}>
        You received {trimmedName(event.name)} from {sender}.
      </Typography>
    );
  } else {
    text = (
      <Typography variant="body" numberOfLines={2}>
        You received {trimmedName(event.name)}.
      </Typography>
    );
  }

  return (
    <BaseTokenEvent icon={<ActivityReceiveSVG />} text={text} uri={event.uri} />
  );
}

function SendTokenOfferEvent({
  event,
}: ActivityEventProps<Types.SendTokenOfferEvent>) {
  const receiver = <PetraAddress address={event.receiver} bold />;
  const text = (
    <Typography variant="body" numberOfLines={2}>
      You sent a Pending NFT to {receiver}: {trimmedName(event.name)}.
    </Typography>
  );
  return (
    <BaseTokenEvent icon={<ActivitySendSVG />} text={text} uri={event.uri} />
  );
}

function ReceiveTokenOfferEvent({
  event,
}: ActivityEventProps<Types.ReceiveTokenOfferEvent>) {
  const sender = <PetraAddress address={event.sender} bold />;
  const text = (
    <Typography variant="body" numberOfLines={2}>
      You received a pending NFT from {sender} {trimmedName(event.name)}.
    </Typography>
  );
  return (
    <BaseTokenEvent icon={<ActivityReceiveSVG />} text={text} uri={event.uri} />
  );
}

function MintTokenEvent({ event }: ActivityEventProps<Types.MintTokenEvent>) {
  const youMinted = i18nmock('assets:activity.youMinted');
  const toMint = i18nmock('assets:activity.toMint');
  const text = (
    <Typography variant="body" numberOfLines={2}>
      <BaseActivityStatusText
        status={event.success}
        successText={youMinted}
        failText={toMint}
      />
      {` an NFT: ${trimmedName(event.name)}.`}
    </Typography>
  );
  return (
    <BaseTokenEvent
      icon={
        event.success ? <ActivityReceiveSVG /> : <ActivityReceiveFailureSVG />
      }
      text={text}
      uri={event.uri}
    />
  );
}

export {
  MintTokenEvent,
  ReceiveTokenEvent,
  ReceiveTokenOfferEvent,
  SendTokenEvent,
  SendTokenOfferEvent,
};
