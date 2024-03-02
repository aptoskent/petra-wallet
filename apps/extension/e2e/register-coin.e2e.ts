// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { expect, type Page } from '@playwright/test';
import { test } from './lib/fixtures';
import { AptosAccount } from 'aptos';
import { moonCoinInfo } from './utils';

/**
 * TODO: Remove this when we have a better way to wait for simulation to finish
 * and avoid NUMBER_OF_TYPE_ARGUMENTS_MISMATCH error. Likely need to consolidate
 * the register coin flow into using a single consolidated context + hook
 */
const manualDelay = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

interface fillCustomCoinInputProps {
  page: Page;
  symbol: string;
}

/**
 * Fills in custom coin inputs
 */
const fillCustomCoinInputs = async ({
  page,
  symbol,
}: fillCustomCoinInputProps) => {
  await page.getByRole('link').first().click();

  await page.getByPlaceholder('Token address').clear()
  await page.getByPlaceholder('Token address').fill(`${moonCoinInfo.address}::${moonCoinInfo.coinName}::${symbol}`);
  await page.getByPlaceholder('Token name').clear()
  await page.getByPlaceholder('Token name').fill(moonCoinInfo.coinName);
  await page.getByPlaceholder('Symbol').clear()
  await page.getByPlaceholder('Symbol').fill(symbol);

  await page.waitForSelector('.chakra-spinner', { state: 'detached' });
  await manualDelay(1000);
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();

  await expect(page.getByText(`Successfully added ${moonCoinInfo.coinName} to your coins`)).toContainText(`Successfully added ${moonCoinInfo.coinName} to your coins`);

  await page.getByText('Close').click();
}

interface RegisterCustomCoinProps {
  page: Page;
}

/**
 * Register custom coin flow
 */
export const registerCustomCoin = async ({
  page,
}: RegisterCustomCoinProps) => {
  await page.getByRole('link', { name: 'Manage' }).click();

  await fillCustomCoinInputs({ page, symbol: moonCoinInfo.symbol[0] })
  await fillCustomCoinInputs({ page, symbol: moonCoinInfo.symbol[3] })
  await fillCustomCoinInputs({ page, symbol: moonCoinInfo.symbol[12] })

  await page.getByRole('button', { name: 'back' }).click();
}

test('Register a new coin called MoonCoin0, MoonCoin3, and MoonCoin12 to another account', async ({
  page,
  onboarding,
  shared,
  faucetClient,
}) => {
  const fromAccount = new AptosAccount();
  const [fromAccountTxn] = await faucetClient.fundAccount(fromAccount.address().toString(), 100_000_000, 15);
  await faucetClient.waitForTransaction(fromAccountTxn, { checkSuccess: true });

  await onboarding.withPrivateKey(fromAccount);
  await shared.switchNetwork('Testnet');
  await page.getByRole('link', { name: 'Wallet Home' }).click();

  await registerCustomCoin({ page })
});