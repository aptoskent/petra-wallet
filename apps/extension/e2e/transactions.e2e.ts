// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { expect } from '@playwright/test';
import { test } from './lib/fixtures';
import { AptosAccount, Types } from 'aptos';

test('import a new account, switch to devnet, fund with faucet, send 0.01 APT to self', async ({
  aptosClient,
  page,
  onboarding,
  shared,
}) => {
  const account = new AptosAccount();
  const transferAmount = '0.01';
  const transferAmountAsNumber = Number(transferAmount);
  await onboarding.withPrivateKey(account);

  await shared.switchNetwork('Testnet');
  await shared.useFaucet();
  
  await page.waitForSelector('.chakra-spinner', { state: 'detached' })
  await page.locator('text=Send').click();
  await page.locator('input >> nth=0').first().fill(account.address().hex());
  await page.locator('input >> nth=2').first().fill(transferAmount);
  await page.locator('text=Next').click();

  await expect(page.locator('body')).toContainText('Confirm transaction');
  await page.locator('[type=submit]').click();

  await expect(page.locator('body')).toContainText('Transaction succeeded');
  await expect(page.locator('body')).toContainText(`Amount transferred: ${transferAmount}`);

  const transactions = await aptosClient.getAccountTransactions(account.address().toString()) as Types.Transaction_UserTransaction[];
  const onlyTransaction = transactions[0];
  await expect(Number(onlyTransaction.events[1].data.amount)).toEqual(1e8 * transferAmountAsNumber)
});
