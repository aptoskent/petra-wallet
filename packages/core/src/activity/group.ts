// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as Types from './types';
import { getServerDate } from '../utils/server-time';

const DAY_MS = 86400000;

export type ActivityGroup = {
  events: Types.ActivityEvent[];
  name: 'today' | 'yesterday' | 'thisWeek' | 'month';
  start: Date;
};

export function groupByTime(events: Types.ActivityEvent[]) {
  const groups: ActivityGroup[] = [];

  const startOfDay = getServerDate();
  startOfDay.setHours(0, 0, 0, 0);
  groups.push({
    events: [],
    name: 'today',
    start: startOfDay,
  });
  groups.push({
    events: [],
    name: 'yesterday',
    start: new Date(startOfDay.getTime() - DAY_MS),
  });

  const startOfWeek = new Date(
    startOfDay.getTime() - startOfDay.getDay() * DAY_MS,
  );
  groups.push({
    events: [],
    name: 'thisWeek',
    start: startOfWeek,
  });

  const result: ActivityGroup[] = [...groups];
  let group = groups.shift();
  for (const event of events) {
    while (group && event.timestamp < group.start) {
      group = groups.shift();
    }

    if (group == null) {
      const startOfMonth = new Date(event.timestamp.getTime());
      startOfMonth.setHours(0, 0, 0, 0);
      startOfMonth.setDate(1);
      group = {
        events: [],
        name: 'month',
        start: startOfMonth,
      };
      result.push(group);
    }

    group.events.push(event);
  }

  return result;
}

export function groupPagesToSections(
  pages: { events: Types.ActivityEvent[] }[] | undefined,
  getGroupTitle: (group: ActivityGroup) => string,
) {
  const events = pages?.flatMap((page) => page.events) ?? [];
  const activityGroups = groupByTime(events);

  return activityGroups
    .map((activityGroup) => ({
      data: activityGroup.events,
      title: getGroupTitle(activityGroup),
    }))
    .filter((section) => section.data.length > 0);
}
