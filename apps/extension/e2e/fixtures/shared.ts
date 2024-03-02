// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { ClipboardFixture } from './clipboard';

export class SharedFixture {
  constructor(
    private page: Page,
    private clipboard: ClipboardFixture,
  ) {}

  /**
   * Navigate to settings and switch network to the desired one
   */
  async switchNetwork(networkName: 'Devnet' | 'Testnet' | 'Mainnet') {
    const { page } = this;
    await page.getByRole('link', { name: 'Account Settings' }).click();
    await page.locator('text=Network').click();
    await page.locator(`text=${networkName}`).first().click();
    await page.locator('[aria-label=back]').click();
  }

  /**
   * Navigate to home page and retrieve address from "Copy address" in home page
   */
  async copyAddressFromHome() {
    const { clipboard, page } = this;
    await page.locator('text=Home >> nth=0').click();
    await page.locator('[aria-label="Copy Address"]').click();
    const address = await clipboard.read();
    expect(address).toMatch(/^0x[0-9a-f]{64}$/);
    return address;
  }

  /**
   * Navigate to account settings and copy mnemonic
   */
  async copyMnemonicFromSettings(password: string) {
    const { clipboard, page } = this;

    await page.getByRole('link', { name: 'Account Settings' }).click();
    await page.locator('text=Manage account').click();
    await page.locator('input').first().fill(password);
    await page.locator('text=Next').click();

    // Copy recovery phrase.
    await page.locator('text=Show >> nth=1').click();
    await expect(page.locator('body')).toContainText('Secret recovery phrase');
    await page.locator('text=Copy').click();
    const newRecoveryPhrase = await clipboard.read();

    await page.locator('[aria-label=back]').click();
    await page.locator('[aria-label=back]').click();

    return newRecoveryPhrase;
  }

  /**
   * Navigate to settings and remove active account
   */
  async deleteCurrentAccount(password: string) {
    const { page } = this;
    await page.getByRole('link', { name: 'Account Settings' }).click();
    await page.locator('text=Remove account').click();
    await page.locator('input').first().fill(password);
    await page.locator('text=Next').click();
    await page.locator('button >> text=Remove').click();
  }

  /**
   * Navigate to home and call the faucet
   */
  async useFaucet() {
    const { page } = this;
    await page.getByRole('link', { name: 'Wallet Home' }).click();
    await page.locator('text=Faucet').click();
    await page.waitForSelector('.chakra-spinner', { state: 'detached' })
  }

  /**
   * Fill out mnemonic form and press "Continue" button
   */
  async fillAndSubmitMnemonicForm(recoveryPhrase: string) {
    const { page } = this;
    const recoveryPhraseWords = recoveryPhrase.split(' ');
    await expect(recoveryPhraseWords).toHaveLength(12);

    for (let i = 0; i < recoveryPhraseWords.length; i += 1) {
      await page.locator('input').nth(i).fill(recoveryPhraseWords[i]);
    }
    const button = await page.locator('button:below(input)').first();
    await expect(button).toBeEnabled();
    await button.click();
  }

  async addAccountFromMnemonic(recoveryPhrase: string) {
    const { page } = this;
    await page.getByRole('link', { name: 'Account Settings' }).click();
    await page.locator('text=Switch account').click();
    await page.locator('text=Add account').click();
    await page.locator('text=Import mnemonic').click();
    await this.fillAndSubmitMnemonicForm(recoveryPhrase);
  }

  async importAccountFromPrivateKey(privateKey: string) {
    const { page } = this;
    await page.getByRole('link', { name: 'Account Settings' }).click();
    await page.locator('text=Switch account').click();
    await page.locator('text=Add account').click();
    await page.locator('text=Import private key').click();
    await page.locator('input').first().fill(privateKey);
    await page.locator('button >> text=Submit').click();
  }
}
