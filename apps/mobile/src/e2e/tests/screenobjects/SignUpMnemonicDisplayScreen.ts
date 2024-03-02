// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable class-methods-use-this */
import AppScreen from './AppScreen';

class SignUpMnemonicDisplayScreen extends AppScreen {
  constructor() {
    super('~SignUpMnemonicDisplay-screen');
  }

  private get title() {
    return $('~onboarding-instruction-title');
  }

  private get subtext() {
    return $('~onboarding-instruction-subtext');
  }

  private get revealMnemonic() {
    return $('~reveal-mnemonic');
  }

  private get revealButton() {
    return $('~button-reveal');
  }

  private phraseListColumnOne() {
    return $('~phrase-list-column-1');
  }

  private phraseListColumnTwo() {
    return $('~phrase-list-column-2');
  }

  private phraseList() {
    return $('~phrase-list');
  }

  async titleText() {
    return this.title.getText();
  }

  async subtextText() {
    return this.subtext.getText();
  }

  async isPhraseListDisplayed() {
    return this.phraseList().isDisplayed();
  }

  async phraseListText() {
    if (driver.isAndroid) {
      const views = await $$("//*[@class='android.widget.TextView']");

      const textViews = views.slice(3, 27);

      return Promise.all(textViews.map((t) => t.getText())).then((arr) =>
        arr
          .map((t) => t.replace(/[0-9]+\./g, '').trim())
          .filter((t) => !!t)
          .join(' '),
      );
    }
    const phraseListTextOne = await this.phraseListColumnOne().getText();
    const phraseListTextTwo = await this.phraseListColumnTwo().getText();

    const phraseListTextOneSanitized = phraseListTextOne
      .replace(/[0-9]+\./g, '')
      .trim();
    const phraseListTextTwoSanitized = phraseListTextTwo
      .replace(/[0-9]+\./g, '')
      .trim();
    return phraseListTextOneSanitized
      .split(' ')
      .filter((t) => !!t)
      .concat(phraseListTextTwoSanitized.split(' ').filter((t) => !!t))
      .join(' ');
  }

  async tapRevealPrase() {
    await this.revealMnemonic.click();
  }

  async tapHaveSavedRecoveryPhrase() {
    await this.revealButton.click();
  }
}

export default new SignUpMnemonicDisplayScreen();
