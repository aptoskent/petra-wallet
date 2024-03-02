// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */

import AppScreen from './AppScreen';

class SettingsScreen extends AppScreen {
  constructor() {
    super('~Settings-screen');
  }

  private get address() {
    return $('~settings-address');
  }

  private get networkItem() {
    return $('~Network');
  }

  private get removeAccountItem() {
    return $('~RemoveAccount');
  }

  private get confirmRemoveButton() {
    return $('~button-Remove');
  }

  async addressValue() {
    return this.address.getText();
  }

  async removeAccountClick() {
    return this.removeAccountItem.click();
  }

  async confirmRemoveWaitForDisplayed() {
    return this.confirmRemoveButton.waitForDisplayed();
  }

  async confirmRemoveClick() {
    return this.confirmRemoveButton.click();
  }

  async networkClick() {
    return this.networkItem.click();
  }
}

export default new SettingsScreen();
