// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */
import AppScreen from './AppScreen';
import Gestures from '../helpers/Gestures';

class ChooseAccountNameScreen extends AppScreen {
  constructor() {
    super('~ChooseAccountName-screen');
  }

  private get accountName() {
    return $('~input-choose-account-name');
  }

  private get doneButton() {
    return $('~button-done');
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

  async isAccountNameInputDisplayed() {
    return this.accountName.isDisplayed();
  }

  async submitAccountName({ name }: { name: string }) {
    await this.accountName.setValue(name);

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
      await $('~ChooseAccountName-screen').click();
    }
    // On smaller screens there could be a possibility that the button is not shown
    await Gestures.checkIfDisplayedWithSwipeUp(await this.doneButton, 2);
    await this.doneButton.click();
  }
}

export default new ChooseAccountNameScreen();
