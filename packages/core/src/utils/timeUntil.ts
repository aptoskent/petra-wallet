// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export default function timeUntil(timestamp: string | number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null {
  // eslint-disable-next-line @petra/no-client-date
  const startDate = new Date();
  const endDate = new Date(Number(timestamp));
  const difference = endDate.getTime() - startDate.getTime();

  if (difference < 0) return null;

  const numSeconds = Math.floor(difference / 1000);
  const numMinutes = Math.floor(numSeconds / 60);
  const numHours = Math.floor(numMinutes / 60);
  const numDays = Math.floor(numHours / 24);

  return {
    days: numDays,
    hours: numHours % 24,
    minutes: numMinutes % 60,
    seconds: numSeconds % 60,
  };
}
