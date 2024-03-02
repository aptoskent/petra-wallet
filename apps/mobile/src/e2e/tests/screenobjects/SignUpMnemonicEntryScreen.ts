// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */
import Gestures from '../helpers/Gestures';
import AppScreen from './AppScreen';

class SignUpMnemonicEntryScreen extends AppScreen {
  constructor() {
    super('~SignUpMnemonicEntry-screen');
  }

  private get title() {
    return $('~onboarding-instruction-title');
  }

  private get subtext() {
    return $('~onboarding-instruction-subtext');
  }

  private get nextButton() {
    return $('~button-next');
  }

  private get petraModal() {
    return $('~modal');
  }

  private get savedRecoveryPhraseButton() {
    return $('~button-recovery-phrase-modal-saved');
  }

  private get showAgainRecoveryPhraseButton() {
    return $('~button-recovery-phrase-modal-show-again');
  }

  async isPetraModalDisplayed() {
    return this.petraModal.isDisplayed();
  }

  async titleText() {
    return this.title.getText();
  }

  async subtextText() {
    return this.subtext.getText();
  }

  async enterPhrases({ phraseList }: { phraseList: string }) {
    const wordsArray = phraseList.split(' ');

    const firstWord = await $(`~mnemonic-${wordsArray[0]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(firstWord, 3);
    await firstWord.isDisplayed();
    await firstWord.click();

    const secondWord = await $(`~mnemonic-${wordsArray[1]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(secondWord, 3);
    await secondWord.isDisplayed();
    await secondWord.click();

    const thirdWord = await $(`~mnemonic-${wordsArray[2]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(thirdWord, 3);
    await thirdWord.isDisplayed();
    await thirdWord.click();

    const forthWord = await $(`~mnemonic-${wordsArray[3]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(forthWord, 3);
    await forthWord.isDisplayed();
    await forthWord.click();

    const fifthWord = await $(`~mnemonic-${wordsArray[4]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(fifthWord, 3);
    await fifthWord.isDisplayed();
    await fifthWord.click();

    const sixthWord = await $(`~mnemonic-${wordsArray[5]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(sixthWord, 3);
    await sixthWord.isDisplayed();
    await sixthWord.click();

    const seventhWord = await $(`~mnemonic-${wordsArray[6]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(seventhWord, 3);
    await seventhWord.isDisplayed();
    await seventhWord.click();

    const eighthWord = await $(`~mnemonic-${wordsArray[7]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(eighthWord, 3);
    await eighthWord.isDisplayed();
    await eighthWord.click();

    const ninthWord = await $(`~mnemonic-${wordsArray[8]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(ninthWord, 3);
    await ninthWord.isDisplayed();
    await ninthWord.click();

    const tenthWord = await $(`~mnemonic-${wordsArray[9]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(tenthWord, 3);
    await tenthWord.isDisplayed();
    await tenthWord.click();

    const eleventhWord = await $(`~mnemonic-${wordsArray[10]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(eleventhWord, 3);
    await eleventhWord.isDisplayed();
    await eleventhWord.click();

    const twelthWord = await $(`~mnemonic-${wordsArray[11]}`);
    await Gestures.checkIfDisplayedWithSwipeUp(twelthWord, 3);
    await twelthWord.isDisplayed();
    await twelthWord.click();
  }

  async tapNextButton() {
    return this.nextButton.click();
  }

  async tapShowRecoveryPhraseAgain() {
    return this.showAgainRecoveryPhraseButton.click();
  }

  async tapSavedRecoveryPhrase() {
    return this.savedRecoveryPhraseButton.click();
  }
}

export default new SignUpMnemonicEntryScreen();
