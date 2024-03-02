// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */

import AppScreen from './AppScreen';

class AccountSwitcherScreen extends AppScreen {
  constructor() {
    super('~AccountSwitcher-screen');
  }

  private get addAccountButton() {
    return $('~button-add-account');
  }

  async addAccountClick() {
    return this.addAccountButton.click();
  }
}

export default new AccountSwitcherScreen();
