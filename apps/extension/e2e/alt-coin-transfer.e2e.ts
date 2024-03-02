// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { expect } from '@playwright/test';
import { test } from './lib/fixtures';
import { AptosAccount, AptosClient } from 'aptos';
import { moonCoinInfo } from './utils';
import { mintCoin, signAndSubmitRegisterCoinTransaction } from '@petra/core/utils/coin'
import { getSequenceNumber } from '@petra/core/queries/account'

export const getMoonCoinStructType = (symbol: string) => {
  return `${moonCoinInfo.address}::${moonCoinInfo.coinName}::${symbol}` as const;
}

interface MintMoonCoinProps {
  amount: number;
  symbol: string;
  mintRecipient: AptosAccount;
}

export const mintMoonCoin = async ({
  amount,
  symbol,
  mintRecipient,
}: MintMoonCoinProps) => {
  await mintCoin({ 
    amount, 
    symbol, 
    coinModuleAccountAddress: moonCoinInfo.address, 
    mintRecipient: mintRecipient.address().toString(),
    coinModuleAccountPrivateKey: moonCoinInfo.privateKey,
    coinName: moonCoinInfo.coinName,
  });
}

interface RegisterMoonCoinProps {
  aptosAccount: AptosAccount;
  aptosClient: AptosClient;
}

/**
 * Registers MoonCoin0, MoonCoin3, and MoonCoin12
 * for a given user. Submits txn to chain
 */
export const registerMoonCoins = async ({
  aptosAccount,
  aptosClient,
}: RegisterMoonCoinProps) => {
  const [sequenceNumber, chainId] = await Promise.all([
    getSequenceNumber({ address: aptosAccount.address(), aptosClient }),
    aptosClient.getChainId(),
  ]);

  const txnOptions = {
    expirationSecondsFromNow: 60,
    gasUnitPrice: 150,
    maxGasAmount: 1e4,
  };

  await Promise.all([
    signAndSubmitRegisterCoinTransaction({ 
      aptosAccount, 
      aptosClient, 
      coinStructTag: getMoonCoinStructType(moonCoinInfo.symbol[0]),
      sequenceNumber,
      chainId,
      txnOptions,
    }),
    signAndSubmitRegisterCoinTransaction({ 
      aptosAccount, 
      aptosClient, 
      coinStructTag: getMoonCoinStructType(moonCoinInfo.symbol[3]), 
      sequenceNumber: sequenceNumber + BigInt(1),
      chainId,
      txnOptions,
    }),
    signAndSubmitRegisterCoinTransaction({ 
      aptosAccount, 
      aptosClient, 
      coinStructTag: getMoonCoinStructType(moonCoinInfo.symbol[12]), 
      sequenceNumber: sequenceNumber + BigInt(2),
      chainId,
      txnOptions,
    }),
  ])
}

test('import a new account, switch to Testnet, fund with faucet, send MoonCoin0 MoonCoin3 and MoonCoin12 to another account', async ({
  page,
  onboarding,
  shared,
  faucetClient,
}) => {
  // Account initialization
  const toAccount = new AptosAccount();
  const [toAccountTxn] = await faucetClient.fundAccount(toAccount.address().toString(), 100_000_000, 15);

  const fromAccount = new AptosAccount();
  const [fromAccountTxn] = await faucetClient.fundAccount(fromAccount.address().toString(), 100_000_000, 15);

  await Promise.all([
    faucetClient.waitForTransaction(toAccountTxn, { checkSuccess: true }),
    faucetClient.waitForTransaction(fromAccountTxn, { checkSuccess: true })
  ])

  // Register MoonCoin0, MoonCoin3, and MoonCoin12 to "from" and "to" accounts
  await Promise.all([
    registerMoonCoins({ aptosAccount: toAccount, aptosClient: faucetClient }),
    registerMoonCoins({ aptosAccount: fromAccount, aptosClient: faucetClient })
  ]);

  // Mint MoonCoin0, MoonCoin3 and MoonCoin12 to "from" account
  await mintMoonCoin({ mintRecipient: fromAccount, symbol: moonCoinInfo.symbol[0], amount: 1e6 });
  await mintMoonCoin({ mintRecipient: fromAccount, symbol: moonCoinInfo.symbol[3], amount: 1e8 });
  await mintMoonCoin({ mintRecipient: fromAccount, symbol: moonCoinInfo.symbol[12], amount: 1e15 });

  // Onboarding account "from"
  await onboarding.withPrivateKey(fromAccount);
  await shared.switchNetwork('Testnet');
  await page.getByRole('link', { name: 'Wallet Home' }).click();

  // Do the 0 decimal coin first
  await page.waitForSelector('.chakra-spinner', { state: 'detached' })
  await page.locator('text=Send').click();
  await page.locator('input >> nth=0').first().fill(toAccount.address().hex());
  await page.click('#select-coin-tag')
  await page.getByText('Moon Coin•1,000,000 MOON').click()

  // Should not allow for decimals and convert to 100001
  await page.getByPlaceholder('0').fill('100001.001');
  await page.locator('text=Next').click();
  await expect(page.locator('body')).toContainText('Confirm transaction');
  await page.locator('[type=submit]').click();
  await expect(page.locator('body')).toContainText('Transaction succeeded');
  await expect(page.locator('body')).toContainText('Amount transferred: 100001');

  // Do the 3 decimal coin next
  await page.waitForSelector('.chakra-spinner', { state: 'detached' })
  await page.locator('text=Send').click();
  await page.locator('input >> nth=0').first().fill(toAccount.address().hex());
  await page.click('#select-coin-tag')
  await page.getByText('Moon Coin•100,000 MOON').click();

  await page.getByPlaceholder('0').fill('10000.010');
  await page.locator('text=Next').click();
  await expect(page.locator('body')).toContainText('Confirm transaction');
  await page.locator('[type=submit]').click();
  await expect(page.locator('body')).toContainText('Transaction succeeded');
  await expect(page.locator('body')).toContainText('Amount transferred: 10000.01');

  // Do the 12 decimal coin last
  await page.waitForSelector('.chakra-spinner', { state: 'detached' })
  await page.locator('text=Send').click();
  await page.locator('input >> nth=0').first().fill(toAccount.address().hex());
  await page.click('#select-coin-tag')
  await page.getByText('Moon Coin•1,000 MOON').click()

  await page.getByPlaceholder('0').fill('1.001');
  await page.locator('text=Next').click();
  await expect(page.locator('body')).toContainText('Confirm transaction');
  await page.locator('[type=submit]').click();
  await expect(page.locator('body')).toContainText('Transaction succeeded');
  await expect(page.locator('body')).toContainText('Amount transferred: 1.001');
});

