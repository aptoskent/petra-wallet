// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */
import AppScreen from './AppScreen';

class ImportWalletOptionsScreen extends AppScreen {
  constructor() {
    super('~ImportWalletOptions-screen');
  }

  private get importPrivateKeyButton() {
    return $('~button-import-private-key');
  }

  private get importPhraseButton() {
    return $('~button-import-mnemonic');
  }

  async isPrivateKeyButtonDisplayed() {
    return this.importPrivateKeyButton.isDisplayed();
  }

  async tapPrivateKeyButton() {
    await this.importPrivateKeyButton.click();
  }

  async tapPhraseButton() {
    await this.importPhraseButton.click();
  }
}

export default new ImportWalletOptionsScreen();
