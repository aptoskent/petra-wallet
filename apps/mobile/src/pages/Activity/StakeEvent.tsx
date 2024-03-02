// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-underscore-dangle */

import * as Types from '@petra/core/activity/types';
import Typography from 'core/components/Typography';
import React, { useEffect, useMemo } from 'react';
import { i18nmock } from 'strings';
import { APTOS_COIN_INFO } from 'shared/constants';
import PetraAddress from 'core/components/PetraAddress';
import { useTheme } from 'core/providers/ThemeProvider';
import ActivitySendSVG from 'shared/assets/svgs/activity_send';
import ActivityReceiveSVG from 'shared/assets/svgs/activity_receive';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { stakingEvents } from '@petra/core/utils/analytics/events';
import BaseEvent, {
  ActivityEventProps,
  BaseActivityStatusText,
} from './BaseEvent';
import { formatCoin } from './util';

export default function StakeEvent({
  event,
}: ActivityEventProps<Types.StakeEvent>) {
  const { theme } = useTheme();

  const { trackEvent } = useTrackEvent();

  const stakedWith = i18nmock('activity:stakeEvents.stakedWith');
  const unstakedWith = i18nmock('activity:stakeEvents.unstakedWith');
  const withdrewFrom = i18nmock('activity:stakeEvents.withdrewFrom');

  const icon = useMemo(() => {
    switch (event._type) {
      case 'add-stake':
        return <ActivitySendSVG />;
      case 'unstake':
        return <ActivitySendSVG />;
      case 'withdraw-stake':
        return <ActivityReceiveSVG />;
      default:
        return null;
    }
  }, [event._type]);

  const message = useMemo<string>(() => {
    switch (event._type) {
      case 'add-stake':
        return stakedWith;
      case 'unstake':
        return unstakedWith;
      case 'withdraw-stake':
        return withdrewFrom;
      default:
        return '';
    }
  }, [event._type, stakedWith, unstakedWith, withdrewFrom]);

  useEffect(() => {
    if (!message || !icon) {
      void trackEvent({
        eventType: stakingEvents.UNKNOWN_STAKING_EVENT,
        params: {
          unknownStakingEvent: event._type,
        },
      });
    }
  }, [message, icon, event._type, trackEvent]);

  const text = (
    <Typography variant="body" numberOfLines={2}>
      <BaseActivityStatusText
        status={event.success}
        successText={message}
        failText=""
      />{' '}
      <PetraAddress bold address={event.pool} />
    </Typography>
  );

  if (!message || !icon) {
    return null;
  }

  return (
    <BaseEvent
      icon={icon}
      text={text}
      extra={
        <Typography
          variant="body"
          color={theme.typography.primaryDisabled}
          numberOfLines={1}
          weight="600"
        >
          {formatCoin(BigInt(event.amount), APTOS_COIN_INFO)}
        </Typography>
      }
    />
  );
}
