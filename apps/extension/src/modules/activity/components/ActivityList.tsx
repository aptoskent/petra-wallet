// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import * as Sentry from '@sentry/react';
import { Heading } from '@chakra-ui/react';
import { type RawCoinInfo } from '@manahippo/coin-list';
import * as Types from '@petra/core/activity/types';
import { ActivityGroup, groupByTime } from '@petra/core/activity/group';
import ChakraLink from 'core/components/ChakraLink';
import { customColors } from '@petra/core/colors';
import ActivityEvent from './ActivityEvent';

function ActivityGroupTitle({
  activityGroup,
}: {
  activityGroup: ActivityGroup;
}) {
  switch (activityGroup.name) {
    case 'today':
      return <FormattedMessage defaultMessage="Today" />;
    case 'yesterday':
      return <FormattedMessage defaultMessage="Yesterday" />;
    case 'thisWeek':
      return <FormattedMessage defaultMessage="This Week" />;
    default:
      return (
        <FormattedDate
          value={activityGroup.start}
          timeZone="UTC"
          month="long"
          year="numeric"
        />
      );
  }
}

type ActivityGroupProps = {
  activityGroup: ActivityGroup;
  coinList: Record<string, RawCoinInfo>;
};

function ActivityGroupComponent({
  activityGroup,
  coinList,
}: ActivityGroupProps) {
  return (
    <>
      <Heading
        fontSize="24px"
        lineHeight="29px"
        color={customColors.navy[900]}
        paddingX="16px"
        paddingY="10px"
      >
        <ActivityGroupTitle activityGroup={activityGroup} />
      </Heading>
      {activityGroup.events.map((activityEvent) => (
        <Sentry.ErrorBoundary key={activityEvent.version.toString()}>
          <ChakraLink
            to={`/transactions/${activityEvent.version}`}
            w="100%"
            m={0}
          >
            <ActivityEvent activityEvent={activityEvent} coinList={coinList} />
          </ChakraLink>
        </Sentry.ErrorBoundary>
      ))}
    </>
  );
}

type ActivityListProps = {
  activityEvents: Types.ActivityEvent[];
  coinList: Record<string, RawCoinInfo>;
};

export default function ActivityList({
  activityEvents,
  coinList,
}: ActivityListProps) {
  const activityGroups = groupByTime(activityEvents);

  return (
    <>
      {activityGroups.map((activityGroup) =>
        activityGroup.events.length > 0 ? (
          <ActivityGroupComponent
            key={activityGroup.start.getTime()}
            activityGroup={activityGroup}
            coinList={coinList}
          />
        ) : null,
      )}
    </>
  );
}
