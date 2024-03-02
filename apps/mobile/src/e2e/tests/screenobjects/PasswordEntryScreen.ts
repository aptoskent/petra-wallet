// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */
import AppScreen from './AppScreen';
import Gestures from '../helpers/Gestures';

class PasswordEntryScreen extends AppScreen {
  constructor() {
    super('~PasswordEntry-screen');
  }

  private get enterPassword() {
    return $('~input-enter-password');
  }

  private get confirmPassword() {
    return $('~input-confirm-password');
  }

  private get continueButton() {
    return $('~button-continue');
  }

  private get title() {
    return $('~onboarding-instruction-title');
  }

  private get subtext() {
    return $('~onboarding-instruction-subtext');
  }

  async titleText() {
    return this.title.getText();
  }

  async subtextText() {
    return this.subtext.getText();
  }

  async isEnterPasswordInputDisplayed() {
    return this.enterPassword.isDisplayed();
  }

  async isConfirmPasswordInputDisplayed() {
    return this.confirmPassword.isDisplayed();
  }

  async isContinueButtonDisplayed() {
    return this.continueButton.isDisplayed();
  }

  async submitPasswordEntry({ password }: { password: string }) {
    await this.enterPassword.setValue(password);
    await this.confirmPassword.setValue(password);

    if (await driver.isKeyboardShown()) {
      /**
       * Normally we would hide the keyboard with this command
       * `driver.hideKeyboard()`, but there is an issue for hiding the keyboard
       * on iOS when using the command. You will get an error like below
       *
       *  Request failed with status 400 due to Error Domain=com.facebook.WebDriverAgent Code=1
       *  "The keyboard on iPhone cannot be dismissed because of a known XCTest issue.
       *  Try to dismiss it in the way supported by your application under test."
       *  UserInfo={NSLocalizedDescription=The keyboard on iPhone cannot be dismissed
       *  because of a known XCTest issue. Try to dismiss
       *  it in the way supported by your application under test.}
       *
       * That's why we click outside of the keyboard.
       */
      await $('~PasswordEntry-screen').click();
    }
    // On smaller screens there could be a possibility that the button is not shown
    await Gestures.checkIfDisplayedWithSwipeUp(await this.continueButton, 2);
    await this.continueButton.click();
  }
}

export default new PasswordEntryScreen();
