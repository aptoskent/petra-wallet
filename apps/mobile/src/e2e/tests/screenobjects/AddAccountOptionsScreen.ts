// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */

import AppScreen from './AppScreen';

class AddAccountOptionsScreen extends AppScreen {
  constructor() {
    super('~AddAccountOptions-screen');
  }

  private get createNewAccountButton() {
    return $('~button-create-new-account');
  }

  private get importPrivateKeyButton() {
    return $('~button-import-private-key');
  }

  private get importPhraseButton() {
    return $('~button-import-phrase');
  }

  async importPhraseClick() {
    return this.importPhraseButton.click();
  }

  async importPrivateKeyClick() {
    return this.importPrivateKeyButton.click();
  }

  async createNewAccountClick() {
    return this.createNewAccountButton.click();
  }
}

export default new AddAccountOptionsScreen();
