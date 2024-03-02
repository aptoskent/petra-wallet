// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { expect } from '@playwright/test';
import { test } from './lib/fixtures';
import { AptosAccount } from 'aptos';
import type { PetraApiClient } from '@petra/core/api';

declare global {
  interface Window {
    aptos: PetraApiClient;
  }
}
test('non-transaction public api methods', async ({
  page,
  prompt,
  onboarding,
}) => {
  const account = new AptosAccount();
  await onboarding.withPrivateKey(account);

  await page.goto('https://explorer.aptoslabs.com/');
  const connectedAccount = await prompt.runAndApprove(() =>
    page.evaluate(() => window.aptos.connect()),
  );
  expect(await page.evaluate(() => window.aptos.isConnected())).toBe(true);
  expect(await page.evaluate(() => window.aptos.network())).toEqual('Mainnet');
  expect(await page.evaluate(() => window.aptos.getNetwork())).toEqual({
    name: 'Mainnet',
    chainId: '1',
    url: 'https://fullnode.mainnet.aptoslabs.com',
  });

  const expectedAccount = {
    address: account.address().hex(),
    publicKey: account.pubKey().hex(),
  };
  expect(connectedAccount).toEqual(expectedAccount);
  expect(await page.evaluate(() => window.aptos.account())).toEqual(
    expectedAccount,
  );

  const messageRequest = {
    address: true,
    application: true,
    chainId: true,
    message: 'ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ',
    nonce: '1337',
  };
  const fullMessage = `APTOS
address: ${expectedAccount.address}
application: https://explorer.aptoslabs.com
chainId: 1
message: ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ
nonce: 1337`;
  const fullMessageBytes = new TextEncoder().encode(fullMessage);
  const expectedSignature = account.signBuffer(fullMessageBytes).noPrefix();

  const signedMessage = await prompt.runAndApprove(() =>
    page.evaluate(
      (messageRequest) => window.aptos.signMessage(messageRequest),
      messageRequest,
    ),
  );
  expect(signedMessage).toEqual({
    address: expectedAccount.address,
    application: 'https://explorer.aptoslabs.com',
    chainId: 1,
    fullMessage,
    message: messageRequest.message,
    nonce: messageRequest.nonce,
    prefix: 'APTOS',
    signature: expectedSignature,
  });

  await page.evaluate(() => window.aptos.disconnect());
  expect(await page.evaluate(() => window.aptos.isConnected())).toBe(false);
});

test('connected apps page', async ({ context, page, prompt, onboarding }) => {
  const account = new AptosAccount();
  await onboarding.withPrivateKey(account);

  const explorerPage = await context.newPage();
  const explorerUrl = 'https://explorer.aptoslabs.com';
  await explorerPage.goto(explorerUrl);
  await explorerPage.evaluate(() =>
    window.aptos.onDisconnect(() => {
      document.body.textContent = 'disconnected';
    }),
  );
  await prompt.runAndApprove(() =>
    explorerPage.evaluate(() => window.aptos.connect()),
  );

  const namesPage = await context.newPage();
  const namesUrl = 'https://aptosnames.com';
  await namesPage.goto(namesUrl);
  await namesPage.evaluate(() =>
    window.aptos.onDisconnect(() => {
      document.body.textContent = 'disconnected';
    }),
  );
  await prompt.runAndApprove(() =>
    namesPage.evaluate(() => window.aptos.connect()),
  );

  await page.bringToFront();
  await page.getByRole('link', { name: 'Account Settings' }).click();
  await page.locator('text=Security and Privacy').click();
  await page.locator('text=Connected Apps').click();
  await expect(page.locator('body')).toContainText('aptosnames.com');
  await expect(page.locator('body')).toContainText('explorer.aptoslabs.com');
  await expect(page.locator('body')).not.toContainText('No connected apps');
  expect(await namesPage.evaluate(() => window.aptos.isConnected())).toBe(true);
  expect(await explorerPage.evaluate(() => window.aptos.isConnected())).toBe(
    true,
  );
  await expect(namesPage.locator('body')).not.toHaveText('disconnected');
  await expect(explorerPage.locator('body')).not.toHaveText('disconnected');

  await page.locator('text=Revoke').first().click();
  await expect(page.locator('body')).not.toContainText('aptosnames.com');
  await expect(page.locator('body')).toContainText('explorer.aptoslabs.com');
  await expect(page.locator('body')).not.toContainText('No connected apps');
  expect(await namesPage.evaluate(() => window.aptos.isConnected())).toBe(
    false,
  );
  expect(await explorerPage.evaluate(() => window.aptos.isConnected())).toBe(
    true,
  );
  await expect(namesPage.locator('body')).toHaveText('disconnected');
  await expect(explorerPage.locator('body')).not.toHaveText('disconnected');

  await page.locator('text=Revoke').first().click();
  await expect(page.locator('body')).not.toContainText('aptosnames.com');
  await expect(page.locator('body')).not.toContainText(
    'explorer.aptoslabs.com',
  );
  await expect(page.locator('body')).toContainText('No connected apps');
  expect(await namesPage.evaluate(() => window.aptos.isConnected())).toBe(
    false,
  );
  expect(await explorerPage.evaluate(() => window.aptos.isConnected())).toBe(
    false,
  );
  await expect(namesPage.locator('body')).toHaveText('disconnected');
  await expect(explorerPage.locator('body')).toHaveText('disconnected');
});
