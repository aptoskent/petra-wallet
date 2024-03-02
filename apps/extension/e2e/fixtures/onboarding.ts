// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { ClipboardFixture } from './clipboard';
import { AptosAccount } from 'aptos';
import { SharedFixture } from './shared';

export class OnboardingFixture {
  constructor(
    private page: Page,
    private extensionId: string,
    private shared: SharedFixture,
    private clipboard: ClipboardFixture,
  ) {}

  /**
   * Open onboarding page within the current tab
   */
  private async openOnboarding() {
    const { extensionId, page } = this;
    const onboardingUrl = `chrome-extension://${extensionId}/onboarding.html`;
    await page.goto(onboardingUrl);
    await expect(page.locator('body')).toContainText('Welcome to Petra');

    // When the extension is installed, the onboarding page automatically opens,
    // so we're making sure all unnecessary tabs are closed
    await page
      .context()
      .pages()
      .forEach((tab) => tab !== page && tab.close());
  }

  /**
   * Open extension page within the current tab
   */
  private async openExtension() {
    const { extensionId, page } = this;
    await page.goto(`chrome-extension://${extensionId}/index.html`);
  }

  private async setupPassword() {
    const { page } = this;

    await expect(page.locator('body')).toContainText('Create a password');
    const password = 'hunter2*****';
    await page.locator('[placeholder="Enter Password"]').fill(password);
    await page.locator('[placeholder="Confirm Password"]').fill(password);
    // TODO: Investigate why it's not possible to use .check() here.
    await page.locator('[name=termsOfService]').dispatchEvent('click');

    const continueButton = page.locator('text=Continue');
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    return password;
  }

  async withNewAccount() {
    const { clipboard, page, shared } = this;
    await this.openOnboarding();

    await page.locator('text=Create New Wallet').click();
    const password = await this.setupPassword();

    await expect(page.locator('body')).toContainText('Secret recovery phrase');
    await page.locator('text=Click to reveal').click();
    await page.locator('text=Copy').click();
    await page.locator('text=Continue').click();

    await expect(page.locator('body')).toContainText(
      'Enter Your Secret Recovery Phrase',
    );
    const recoveryPhrase = await clipboard.read();
    await shared.fillAndSubmitMnemonicForm(recoveryPhrase);

    await expect(page.locator('body')).toContainText('Keep your phrase safe');
    await page.locator('role=button[name="Done"]').click();

    await expect(page.locator('body')).toContainText('Welcome to your wallet');

    await this.openExtension();
    return { password, recoveryPhrase };
  }

  async withPrivateKey(accountOrPrivateKey: AptosAccount | string) {
    const { page } = this;
    await this.openOnboarding();

    const privateKey =
      accountOrPrivateKey instanceof AptosAccount
        ? accountOrPrivateKey.toPrivateKeyObject().privateKeyHex
        : accountOrPrivateKey;

    await page.locator('text=Import Wallet').click();
    await page.locator('text=Import private key').click();
    await page.locator('input').fill(privateKey);
    await page.locator('text=Import').click();
    const password = await this.setupPassword();

    await expect(page.locator('body')).toContainText(
      'Successfully imported new account',
    );

    await expect(page.locator('body')).toContainText('Welcome to your wallet');
    await this.openExtension();
    return { password };
  }

  async withRecoveryPhrase(recoveryPhrase: string) {
    const { page, shared } = this;
    await this.openOnboarding();

    await page.locator('text=Import Wallet').click();
    await page.locator('text=Import mnemonic').click();
    await shared.fillAndSubmitMnemonicForm(recoveryPhrase);
    const password = await this.setupPassword();

    await expect(page.locator('body')).toContainText(
      'Successfully imported new account',
    );

    await expect(page.locator('body')).toContainText('Welcome to your wallet');
    await this.openExtension();
    return { password };
  }
}
