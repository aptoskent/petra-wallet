// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { handleRequestCore, oldHandleRequestCore, RequestErr } from './index';

const walletAddress = '0x1';
const env = {
  MOONPAY_API_KEY: 'pk_test',
  MOONPAY_SECRET_KEY: 'sk_test',
  MOONPAY_URL: 'https://moonpay.petra-wallet.workers.dev',
};

// Success case
test('Sign url', async () => {
  const result = handleRequestCore(
    `${env.MOONPAY_URL}?walletAddress=${walletAddress}&apiKey=${env.MOONPAY_API_KEY}`,
    env,
  );

  expect(result).toContain(`apiKey=${env.MOONPAY_API_KEY}`);
  expect(result).toContain('signature=');
  expect(result).toContain('currencyCode=apt');
});

// Test: missing api key, should error
test('Sign url, no api key', async () => {
  const result = () =>
    handleRequestCore(`${env.MOONPAY_URL}?walletAddress=${walletAddress}`, env);

  expect(result).toThrowError(RequestErr.MISSING_REQUIRED_PARAMS);
});

// Test: wrong api key, should not sign
test('Sign url, wrong api key', async () => {
  const wrongApiKey = 'pk_wrong';
  const result = () =>
    handleRequestCore(
      `${env.MOONPAY_URL}?walletAddress=${walletAddress}&apiKey=${wrongApiKey}`,
      env,
    );

  expect(result).toThrowError(RequestErr.WRONG_API_KEY);
});

/**
 * Testing this because of
 * @see https://stackoverflow.com/questions/67406320/javascript-not-accepting-percentage-in-the-url-query-param
 *
 * Test: old moonpay derivation function: should be the same as new
 */
test('Old moonpay signature function', async () => {
  const oldResult = oldHandleRequestCore(
    `${env.MOONPAY_URL}?walletAddress=${walletAddress}&apiKey=${env.MOONPAY_API_KEY}`,
    env,
  );
  const oldResultUrl = new URL(oldResult);

  const newResult = handleRequestCore(
    `${env.MOONPAY_URL}?walletAddress=${walletAddress}&apiKey=${env.MOONPAY_API_KEY}`,
    env,
  );
  const newResultUrl = new URL(newResult);

  expect(newResultUrl).toEqual(oldResultUrl);
});
