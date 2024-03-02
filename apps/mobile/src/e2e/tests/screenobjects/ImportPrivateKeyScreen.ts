// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */
import AppScreen from './AppScreen';

class ImportPrivateKeyScreen extends AppScreen {
  constructor() {
    super('~ImportPrivateKey-screen');
  }

  private get textField() {
    return $('~input-private-key');
  }

  private get nextButton() {
    return $('~button-Next');
  }

  async isTextFieldDisplayed() {
    return this.textField.isDisplayed();
  }

  async submitPrivateKey(key: string) {
    await this.textField.setValue(key);
    await this.nextButton.click();
  }
}

export default new ImportPrivateKeyScreen();
