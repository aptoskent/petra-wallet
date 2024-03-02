// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { expect, defineConfig } from '@playwright/test';

import { AptosAccount } from 'aptos';
import { test as base } from './lib/fixtures';
import { setUpTokenTransfer } from './utils';

interface TokenDirectTrannsferFixture {
  alice: AptosAccount;
  bob: AptosAccount;
  collectionName: string;
  tokenName: string;
  directTransferToken: () => Promise<void>;
}

defineConfig({
  expect: {
    timeout: 30 * 1000,
  },
  use: {
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },
});

// Extend basic test by providing a "tokenDirectTransferFixture" fixture.
const test = base.extend<{
  tokenDirectTransferFixture: TokenDirectTrannsferFixture;
}>({
  tokenDirectTransferFixture: async (
    { aptosClient, faucetClient, tokenClient },
    use,
  ) => {
    const {
      alice,
      bob,
      directTransferToken,
      optInToDirectTransfer,
      collectionName,
      tokenName,
    } = await setUpTokenTransfer({ aptosClient, faucetClient, tokenClient });

    // opt Bob into direct transfer
    await optInToDirectTransfer();

    await use({
      alice,
      bob,
      collectionName,
      tokenName,
      directTransferToken,
    });
  },
});

test('direct transfer token flow with receiver already opted in', async ({
  page,
  onboarding,
  shared,
  tokenDirectTransferFixture,
}) => {
  const { alice, bob, tokenName } = tokenDirectTransferFixture;
  await onboarding.withPrivateKey(alice);
  await shared.switchNetwork('Testnet');

  // go to library
  await page.locator('text=Library').click();
  await page.locator('img').first().click();

  // click on offer token button
  await page.locator('[aria-label="offer"]').click();
  await expect(page.locator('body')).toContainText('Add a wallet address');
  await expect(page.locator('[aria-label="invalid"]')).toBeVisible();

  await page.locator('input >> nth=0').first().fill(bob.address().hex());
  await expect(page.locator('[aria-label="success"]')).toBeVisible();
  await page.locator('[aria-label="next"]').click();

  // Confirmation screen
  await expect(page.locator('body')).toContainText('Confirm');
  await expect(page.locator('body')).toContainText(tokenName);
  await expect(page.locator('body')).toContainText(
    bob.address().toString().slice(-5),
  );

  await expect(page.locator('text="Direct Transfer"')).toBeVisible();
  await expect(
    page.locator('[aria-label="direct-transfer-option"]'),
  ).toBeChecked();

  await expect(page.locator('[aria-label="send"]')).toBeEnabled({
    timeout: 15000,
  });
  await page.locator('[aria-label="send"]').click();

  // Confirmation Details screen
  await expect(page.locator('body')).toContainText(
    'Waiting for confirmed details',
  );
  await expect(page.locator('[aria-label="spinner"]')).toBeHidden();

  await expect(page.locator('body')).toContainText('Transaction Successful');
  // Go back to Gallery & Pending screen
  await page.locator('text=Close').click();
});

test('receiver has received a direct transfer', async ({
  page,
  onboarding,
  shared,
  tokenDirectTransferFixture,
}) => {
  const { bob, directTransferToken } = tokenDirectTransferFixture;

  await directTransferToken();

  await onboarding.withPrivateKey(bob);
  await shared.switchNetwork('Testnet');

  // go to library
  await page.locator('text=Library').click();

  // Gallery & Pending screen
  await page.locator('text="Collected (1)"').click({ timeout: 15000 });
  await expect(page.locator('img').first()).toBeVisible();
});
