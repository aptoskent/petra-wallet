// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { handleRequestCore, RequestErr } from './worker';

const walletAddress = '0x1';
const env = {
  MOONPAY_API_KEY: 'pk_test',
  MOONPAY_SECRET_KEY: 'sk_test',
  BUY_URL: 'https://buy.petra-wallet.workers.dev',
  COINBASE_APP_ID: '6c91706c-adcd-4036-bb21-0a6d2e3737c6',
};

// Success case: moonpay
test('Sign moonpay url', async () => {
  const result = handleRequestCore(
    `${env.BUY_URL}?walletAddress=${walletAddress}&apiKey=${env.MOONPAY_API_KEY}`,
    env,
  );

  expect(result.moonpayUrl).toContain(`apiKey=${env.MOONPAY_API_KEY}`);
  expect(result.moonpayUrl).toContain('signature=');
  expect(result.moonpayUrl).toContain('currencyCode=apt');
});

// Success case: coinbase
test('Generate Coinbase url', async () => {
  const result = handleRequestCore(
    `${env.BUY_URL}?walletAddress=${walletAddress}&apiKey=${env.MOONPAY_API_KEY}`,
    env,
  );

  expect(result.coinbaseUrl).toContain(
    'https://pay.coinbase.com/buy/select-asset',
  );
  expect(result.coinbaseUrl).toContain(
    'appId=6c91706c-adcd-4036-bb21-0a6d2e3737c6',
  );
});

// Test: missing api key, should error
test('Sign moonpay url, no api key', async () => {
  const result = () =>
    handleRequestCore(`${env.BUY_URL}?walletAddress=${walletAddress}`, env);

  expect(result).toThrowError(RequestErr.MISSING_REQUIRED_PARAMS);
});

// Test: wrong api key, should not sign
test('Sign url, wrong api key', async () => {
  const wrongApiKey = 'pk_wrong';
  const result = () =>
    handleRequestCore(
      `${env.BUY_URL}?walletAddress=${walletAddress}&apiKey=${wrongApiKey}`,
      env,
    );

  expect(result).toThrowError(RequestErr.WRONG_API_KEY);
});
