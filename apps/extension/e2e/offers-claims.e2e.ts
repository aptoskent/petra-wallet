// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { expect } from '@playwright/test';
import { AptosAccount } from 'aptos';
import { test as base } from './lib/fixtures';
import { setUpTokenTransfer } from './utils';

interface TokenOfferFixture {
  alice: AptosAccount;
  bob: AptosAccount;
  collectionName: string;
  tokenName: string;
  offerToken: () => Promise<void>;
}

// Extend basic test by providing a "tokenOffer" fixture.
const test = base.extend<{ tokenOfferFixture: TokenOfferFixture }>({
  tokenOfferFixture: async (
    { aptosClient, faucetClient, tokenClient },
    use,
  ) => {
    const { alice, bob, offerToken, collectionName, tokenName } =
      await setUpTokenTransfer({ aptosClient, faucetClient, tokenClient });

    await use({
      alice,
      bob,
      collectionName,
      tokenName,
      offerToken,
    });
  },
});

test('offer token flow', async ({
  page,
  onboarding,
  shared,
  tokenOfferFixture,
}) => {
  const { alice, bob, tokenName } = tokenOfferFixture;
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

  await expect(page.locator('[aria-label="spinner"]')).toBeHidden({
    timeout: 30000,
  });
  await expect(page.locator('[aria-label="send"]')).toBeEnabled({
    timeout: 15000,
  });
  await page.locator('[aria-label="send"]').click();

  // Confirmation Details screen
  await expect(page.locator('body')).toContainText(
    'Waiting for confirmed details',
  );
  await expect(page.locator('[aria-label="spinner"]')).toBeHidden({
    timeout: 15000,
  });
  await expect(page.locator('body')).toContainText('Transaction Successful', {
    timeout: 15000,
  });

  // Gallery & Pending screen
  await page.locator('text=Close').click();
  await page.locator('[aria-label="pending-tab"]').click();
  await expect(page.locator('[aria-label="spinner"]')).toBeHidden({
    timeout: 30000,
  });
  await expect(page.locator('body')).toContainText(tokenName, {
    timeout: 30000,
  });
  await expect(page.locator('body')).toContainText('Cancel Offer');
});

test('claim token offer flow', async ({
  tokenOfferFixture,
  page,
  onboarding,
  shared,
}) => {
  const { bob, offerToken } = tokenOfferFixture;
  await offerToken();

  await onboarding.withPrivateKey(bob);
  await shared.switchNetwork('Testnet');

  // go to library
  await page.locator('text=Library').click();
  await page.locator('[aria-label="pending-tab"]').click({ timeout: 15000 });

  await expect(page.locator('[aria-label="spinner"]')).toBeHidden({
    timeout: 30000,
  });

  // click to accept token
  await page.locator('[aria-label=accept]').click();

  // confirmation screen
  await expect(page.locator('body')).toContainText('Accept this offer');
  await expect(page.locator('[aria-label=spinner]')).toBeHidden({
    timeout: 15000,
  });
  await expect(page.locator('[aria-label=accept]')).toBeEnabled({
    timeout: 15000,
  });
  await page.locator('[aria-label=accept]').click();

  // approve transaction
  await page.locator('text="Accept offer"').click();

  // Confirmation Details screen
  await expect(page.locator('body')).toContainText(
    'Waiting for confirmed details',
  );
  await expect(page.locator('body')).toContainText('The offer was accepted!', {
    timeout: 15000,
  });

  // Gallery & Pending screen
  await page.locator('text=Close').click();
  await page.locator('text="Collected (1)"').click({ timeout: 15000 });

  await expect(page.locator('img').first()).toBeVisible();
});

test('cancel token offer flow', async ({
  tokenOfferFixture,
  onboarding,
  shared,
  page,
}) => {
  const { alice, offerToken } = tokenOfferFixture;
  await offerToken();

  await onboarding.withPrivateKey(alice);
  await shared.switchNetwork('Testnet');

  // go to library
  await page.locator('text=Library').click();
  await page.locator('[aria-label="pending-tab"]').click({ timeout: 15000 });

  await expect(page.locator('[aria-label="spinner"]')).toBeHidden({
    timeout: 30000,
  });

  // click to cancel token offer
  await page.locator('[aria-label="cancel"]').click();

  // confirmation screen
  await expect(page.locator('body')).toContainText('Cancel this offer');
  await expect(page.locator('[aria-label=spinner]')).toBeHidden({
    timeout: 15000,
  });
  await page.locator('text="Cancel offer"').click();

  // approve transaction
  await expect(page.locator('body')).toContainText('Approve cancellation');
  await expect(page.locator('[aria-label="approve"]')).toBeEnabled({
    timeout: 15000,
  });
  await page.locator('[aria-label="approve"]').click();

  // Confirmation Details screen
  await expect(page.locator('body')).toContainText(
    'Waiting for confirmed details',
    { timeout: 15000 },
  );
  await expect(page.locator('body')).toContainText('Offer canceled.', {
    timeout: 15000,
  });

  // Gallery & Pending screen
  await page.locator('text=Close').click();
  await page.locator('[aria-label="pending-tab"]').click();
});
