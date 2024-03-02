// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */

import AppScreen from './AppScreen';

class NetworkScreen extends AppScreen {
  constructor() {
    super('~Network-screen');
  }

  private get testnetItem() {
    return $('~NetworkListItem-Testnet');
  }

  async testnetClick() {
    return this.testnetItem.click();
  }
}

export default new NetworkScreen();
