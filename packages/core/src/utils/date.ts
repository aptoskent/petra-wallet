// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @petra/no-client-date */

/**
 *
 * @param timestamp string or number in milliseconds
 * @returns "MMMM DD, YYYY" format
 */
export function fullDate(timestamp: string | number): string {
  const targetDate = new Date(Number(timestamp));
  const today = new Date();
  const isInPast = targetDate < today;
  const date = isInPast ? today : targetDate;

  return date.toLocaleDateString('en-us', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default fullDate;
