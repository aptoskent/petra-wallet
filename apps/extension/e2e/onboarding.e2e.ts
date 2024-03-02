// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { expect } from '@playwright/test';
import { test } from './lib/fixtures';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { AptosAccount } from 'aptos';

test('onboarding with new account', async ({ onboarding }) => {
  await onboarding.withNewAccount();
});

test('onboarding with private key', async ({ onboarding }) => {
  const account = new AptosAccount();
  const privateKey = account.toPrivateKeyObject().privateKeyHex;
  await onboarding.withPrivateKey(privateKey);
});

test('onboarding with existing mnemonic', async ({ onboarding }) => {
  const recoveryPhrase = generateMnemonic(wordlist);
  await onboarding.withRecoveryPhrase(recoveryPhrase);
});

test('create account, verify mnemonic from settings, delete account, then import account again', async ({
  page,
  onboarding,
  shared,
}) => {
  const { password, recoveryPhrase } = await onboarding.withNewAccount();

  const recoveryPhraseFromSettings = await shared.copyMnemonicFromSettings(
    password,
  );
  await expect(recoveryPhrase).toEqual(recoveryPhraseFromSettings);

  const originalAddress = await shared.copyAddressFromHome();
  await shared.deleteCurrentAccount(password);

  await page.locator('text=Import mnemonic').click();
  await shared.fillAndSubmitMnemonicForm(recoveryPhrase);
  await expect(page.locator('body')).toContainText(
    'Successfully imported new account',
  );

  const newAddress = await shared.copyAddressFromHome();
  expect(newAddress).toEqual(originalAddress);
});

test('create account & copy mnemonic, import same mnemonic, and see error', async ({
  page,
  onboarding,
  shared,
}) => {
  const { recoveryPhrase } = await onboarding.withNewAccount();
  await shared.addAccountFromMnemonic(recoveryPhrase);
  await expect(page.locator('body')).toContainText(
    'Error: Account already exists in wallet',
  );
});

test('import existing mnemonic', async ({
  page,
  onboarding,
  shared,
}) => {
  const mnemonic = 'shoot island position soft burden budget tooth cruel issue economy destroy above';
  const expectedAddress = '0x07968dab936c1bad187c60ce4082f307d030d780e91e694ae03aef16aba73f30';
  await onboarding.withRecoveryPhrase(mnemonic);
  const address = await shared.copyAddressFromHome();
  expect(address).toEqual(expectedAddress);
});
