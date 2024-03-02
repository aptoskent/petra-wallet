// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import AppScreen from '../screenobjects/AppScreen';
import AssetsScreen from '../screenobjects/AssetsScreen';
import NetworkScreen from '../screenobjects/NetworkScreen';
import SettingsScreen from '../screenobjects/SettingsScreen';

export default class AccountFixture {
  static async openSettings() {
    await AssetsScreen.waitForIsShown(true);
    await AssetsScreen.settingsClick();
  }

  static async removeAccount() {
    await this.openSettings();

    await SettingsScreen.waitForIsShown();
    await SettingsScreen.removeAccountClick();
    await SettingsScreen.confirmRemoveWaitForDisplayed();
    await SettingsScreen.confirmRemoveClick();
  }

  static async switchToTestnet() {
    await this.openSettings();
    await SettingsScreen.waitForIsShown();
    await SettingsScreen.networkClick();
    await NetworkScreen.waitForIsShown();
    await NetworkScreen.testnetClick();
    // back to settings
    await AppScreen.clickBackButton();
    // back to assets
    await SettingsScreen.waitForIsShown();
    await AppScreen.clickBackButton();
  }

  static async faucet() {
    await AssetsScreen.waitForIsShown(true);
    await AssetsScreen.faucetClick();
  }
}
