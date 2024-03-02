// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */
/* eslint-disable  no-await-in-loop */

import AppScreen from './AppScreen';

class ImportMnemonicScreen extends AppScreen {
  constructor() {
    super('~ImportMnemonic-screen');
  }

  private get nextButton() {
    return $('~button-Next');
  }

  async submitPhrase(phrase: string) {
    const wordsArray = phrase.split(' ');
    for (let i = 0; i < wordsArray.length; i += 1) {
      const input = await $(`~input-mnemonic-word-${i}`);
      if (driver.isAndroid) {
        await driver.hideKeyboard('tap_outside');
        await input.click();
      }
      await input.setValue(wordsArray[i]);
    }
    await this.nextButton.click();
  }
}

export default new ImportMnemonicScreen();
