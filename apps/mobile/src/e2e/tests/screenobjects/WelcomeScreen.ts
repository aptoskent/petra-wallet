// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */
import AppScreen from './AppScreen';

class WelcomeScreen extends AppScreen {
  constructor() {
    super('~Welcome-screen');
  }

  private get onboardingCarousel() {
    return $('~onboarding-carousel');
  }

  private get createWalletButton() {
    return $('~button-create-wallet');
  }

  private get importWalletButton() {
    return $('~button-import-wallet');
  }

  private get dots() {
    return $('~dots');
  }

  private get byAptos() {
    return $('~by-aptos');
  }

  async isCarouselDisplayed() {
    return this.onboardingCarousel.isDisplayed();
  }

  async isByAptosDisplayed() {
    return this.byAptos.isDisplayed();
  }

  async isDotsDisplayed() {
    return this.dots.isDisplayed();
  }

  async isCreateWalletButtonDisplayed() {
    return this.createWalletButton.isDisplayed();
  }

  async createWalletButtonText() {
    return this.createWalletButton.getText();
  }

  async importWalletButtonText() {
    return this.importWalletButton.getText();
  }

  async isImportWalletButtonDisplayed() {
    return this.importWalletButton.isDisplayed();
  }

  async tapOnCreateWalletButton() {
    await this.createWalletButton.click();
  }

  async tapOnImportWalletButton() {
    await this.importWalletButton.click();
  }
}

export default new WelcomeScreen();
