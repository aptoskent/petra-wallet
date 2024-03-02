// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import timeUntil from '@petra/core/utils/timeUntil';
import { i18nmock } from 'strings';

/**
 * This function omits the days, hours, and minutes if they are 0,
 * but ONLY if all of their preceding values are also 0. For example:
 *
 * 1d 0h 0m 0s => 1d 0h 0m 0s
 * 0d 1h 0m 0s => 1h 0m 0s
 * 0d 0h 1m 0s => 1m 0s
 * 0d 0h 0m 1s => 1s
 */
export default function timeUntilFormatted(
  timestamp: string | number,
): null | string {
  const d = i18nmock('general:timeUntil.dayAbbreviation');
  const m = i18nmock('general:timeUntil.minuteAbbreviation');
  const s = i18nmock('general:timeUntil.secondAbbreviation');
  const h = i18nmock('general:timeUntil.hourAbbreviation');

  const res = timeUntil(timestamp);

  if (res) {
    const count: string[] = [];

    if (res.days) count.push(`${res.days}${d}`);
    if (res.hours || res.days) count.push(`${res.hours}${h}`);
    if (res.minutes || res.hours || res.days) {
      count.push(`${res.minutes}${m}`);
    }
    count.push(`${res.seconds}${s}`);

    return count.join(' ');
  }

  return null;
}
