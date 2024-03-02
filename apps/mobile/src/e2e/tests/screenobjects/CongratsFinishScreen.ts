// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */
import AppScreen from './AppScreen';

class CongratsFinishScreen extends AppScreen {
  constructor() {
    super('~CongratsFinish-screen');
  }

  private get mainText() {
    return $('~congrats-finish-main-text');
  }

  private get doneButton() {
    return $('~button-congrats-finish-done');
  }

  async mainTextContent() {
    return this.mainText.getText();
  }

  async isMainTextDisplayed() {
    return this.mainText.isDisplayed();
  }

  async isDoneButtonDisplayed() {
    return this.doneButton.isDisplayed();
  }

  async tapDoneButton() {
    await this.doneButton.click();
  }
}

export default new CongratsFinishScreen();
