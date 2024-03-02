// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint @petra/no-client-date: "off" */

import axios from 'axios';
import { getServerTime, getServerDate, synchronizeTime } from './server-time';

jest.useFakeTimers();

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('before synchronize()', () => {
  beforeEach(() => {
    jest.setSystemTime(new Date('2022-10-17'));
  });

  test('ServerDate() == new Date()', () => {
    expect(getServerDate()).toEqual(new Date());
  });

  test('ServerDate.now() == Date.now()', () => {
    expect(getServerTime()).toEqual(Date.now());
  });
});

describe('after synchronize()', () => {
  const delta = Math.floor(1e5 * (Math.random() - 0.5));

  beforeEach(() => {
    jest.setSystemTime(new Date('2022-10-17'));

    mockAxios.get.mockImplementation(
      () =>
        new Promise((resolve) => {
          // Simulate network request/response delay.
          jest.advanceTimersByTime(50);
          const data = (Date.now() + delta).toString();
          jest.advanceTimersByTime(50);
          resolve({ data });
        }),
    );
  });

  test('ServerDate() == new Date(now + delta)', async () => {
    await synchronizeTime();
    expect(getServerDate()).toEqual(new Date(Date.now() + delta));
  });

  test('ServerDate.now() == Date.now() + delta', async () => {
    await synchronizeTime();
    expect(getServerTime()).toEqual(Date.now() + delta);
  });
});

describe('when synchronize() fails', () => {
  beforeEach(async () => {
    jest.setSystemTime(new Date('2022-10-17'));
    mockAxios.get.mockResolvedValueOnce({ data: Date.now().toString() });
    await synchronizeTime();
  });

  test('invalid timestamp received', () => {
    mockAxios.get.mockResolvedValueOnce({ data: 'ERROR: TOO_MANY_REQUESTS' });
    expect(synchronizeTime()).rejects.toBeInstanceOf(Error);
    expect(getServerTime()).toEqual(Date.now());
  });

  test('MAX_DELTA exceeded', () => {
    mockAxios.get.mockResolvedValueOnce({
      data: (Date.now() + 1e8).toString(),
    });
    expect(synchronizeTime()).rejects.toBeInstanceOf(Error);
    expect(getServerTime()).toEqual(Date.now());
  });
});
