// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */
// copied from https://github.com/webdriverio/appium-boilerplate

import AppScreen from './AppScreen';

class AssetsScreen extends AppScreen {
  constructor() {
    super('~Assets-screen');
  }

  private get address() {
    return $('~assets-address');
  }

  private get balance() {
    return $('~assets-block-balance');
  }

  private get aptBalance() {
    return $('~assets-apt-balance');
  }

  private get settings() {
    return $('~button-settings');
  }

  private get faucet() {
    return $('~button-Faucet');
  }

  private get accountHeader() {
    return $('~button-account-header');
  }

  async accountHeaderClick() {
    return this.accountHeader.click();
  }

  async isBalanceDisplayed() {
    return this.balance.isDisplayed();
  }

  async balanceText() {
    return this.balance.getText();
  }

  async aptBalanceText() {
    return this.aptBalance.getText();
  }

  async addressClick() {
    return this.address.click();
  }

  async addressValue() {
    return this.address.getText();
  }

  async settingsClick() {
    return this.settings.click();
  }

  async faucetClick() {
    return this.faucet.click();
  }
}

export default new AssetsScreen();
