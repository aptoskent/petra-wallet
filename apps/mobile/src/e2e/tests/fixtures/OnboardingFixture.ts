// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import PasswordEntryScreen from '../screenobjects/PasswordEntryScreen';
import SignUpMnemonicDisplayScreen from '../screenobjects/SignUpMnemonicDisplayScreen';
import SignUpMnemonicEntryScreen from '../screenobjects/SignUpMnemonicEntryScreen';
import WelcomeScreen from '../screenobjects/WelcomeScreen';
import ChooseAccountNameScreen from '../screenobjects/ChooseAccountNameScreen';
import CongratsFinishScreen from '../screenobjects/CongratsFinishScreen';
import ImportWalletOptionsScreen from '../screenobjects/ImportWalletOptionsScreen';
import ImportPrivateKeyScreen from '../screenobjects/ImportPrivateKeyScreen';
import ImportMnemonicScreen from '../screenobjects/ImportMnemonicScreen';
import AssetsScreen from '../screenobjects/AssetsScreen';
import AccountSwitcherScreen from '../screenobjects/AccountSwitcherScreen';
import AddAccountOptionsScreen from '../screenobjects/AddAccountOptionsScreen';

export default class OnboardingFixture {
  private static async enterPassword(password: string) {
    await PasswordEntryScreen.waitForIsShown();
    await PasswordEntryScreen.isEnterPasswordInputDisplayed();
    await PasswordEntryScreen.isConfirmPasswordInputDisplayed();
    await PasswordEntryScreen.isContinueButtonDisplayed();
    await PasswordEntryScreen.submitPasswordEntry({ password });
  }

  private static async chooseAccountName(name: string) {
    await ChooseAccountNameScreen.waitForIsShown();
    await ChooseAccountNameScreen.submitAccountName({ name });
  }

  private static async finishOnboarding() {
    await CongratsFinishScreen.waitForIsShown();
    await CongratsFinishScreen.isMainTextDisplayed();
    await CongratsFinishScreen.tapDoneButton();
  }

  private static async goToAddAccount() {
    await AssetsScreen.waitForIsShown();
    await AssetsScreen.accountHeaderClick();
    await AccountSwitcherScreen.waitForIsShown();
    await AccountSwitcherScreen.addAccountClick();
    await AddAccountOptionsScreen.waitForIsShown();
  }

  private static async verifyNewPhase() {
    // Signup Mnemonic Display
    await SignUpMnemonicDisplayScreen.waitForIsShown();
    await SignUpMnemonicDisplayScreen.tapRevealPrase();
    await SignUpMnemonicDisplayScreen.isPhraseListDisplayed();
    const correctPhrases = await SignUpMnemonicDisplayScreen.phraseListText();

    await SignUpMnemonicDisplayScreen.tapHaveSavedRecoveryPhrase();

    // Signup Mnemonic Entry
    await SignUpMnemonicEntryScreen.waitForIsShown();
    await SignUpMnemonicEntryScreen.enterPhrases({
      phraseList: correctPhrases,
    });
    await SignUpMnemonicEntryScreen.tapNextButton();
    await SignUpMnemonicEntryScreen.isPetraModalDisplayed();
    await SignUpMnemonicEntryScreen.tapSavedRecoveryPhrase();
    return correctPhrases;
  }

  static async createNewWallet() {
    // Welcome screen
    await WelcomeScreen.waitForIsShown(true);
    await WelcomeScreen.tapOnCreateWalletButton();

    await this.enterPassword('Aptos123$');
    const phrase = await this.verifyNewPhase();
    await this.chooseAccountName('Main Account');
    await this.finishOnboarding();
    return { phrase };
  }

  static async newAccountViaPrivateKey(key: string) {
    // Welcome screen
    await WelcomeScreen.waitForIsShown(true);
    await WelcomeScreen.tapOnImportWalletButton();

    // Import Wallet Options
    await ImportWalletOptionsScreen.waitForIsShown();
    await ImportWalletOptionsScreen.tapPrivateKeyButton();

    // Enter Private Key
    await ImportPrivateKeyScreen.waitForIsShown();
    await ImportPrivateKeyScreen.submitPrivateKey(key);

    await this.enterPassword('Aptos123$');
    await this.chooseAccountName('Main Account');
    await this.finishOnboarding();
  }

  static async newAccountViaPhrase(phrase: string) {
    // Welcome screen
    await WelcomeScreen.waitForIsShown(true);
    await WelcomeScreen.tapOnImportWalletButton();

    // Import Wallet Options
    await ImportWalletOptionsScreen.waitForIsShown();
    await ImportWalletOptionsScreen.tapPhraseButton();

    // Enter Phrase
    await ImportMnemonicScreen.waitForIsShown();
    await ImportMnemonicScreen.submitPhrase(phrase);

    await this.enterPassword('Aptos123$');
    await this.chooseAccountName('Main Account');
    await this.finishOnboarding();
  }

  static async addNewAccount(accountName: string) {
    await this.goToAddAccount();
    await AddAccountOptionsScreen.createNewAccountClick();

    const phrase = await this.verifyNewPhase();

    await this.chooseAccountName(accountName);
    await this.finishOnboarding();

    return { phrase };
  }

  static async importNewAccountViaKey(key: string, accountName: string) {
    await this.goToAddAccount();
    await AddAccountOptionsScreen.importPrivateKeyClick();

    // Enter Private Key
    await ImportPrivateKeyScreen.waitForIsShown();
    await ImportPrivateKeyScreen.submitPrivateKey(key);

    await this.chooseAccountName(accountName);
    await this.finishOnboarding();
  }

  static async importNewAccountViaPhrase(phrase: string, accountName: string) {
    await this.goToAddAccount();
    await AddAccountOptionsScreen.importPhraseClick();

    // Enter Phrase
    await ImportMnemonicScreen.waitForIsShown();
    await ImportMnemonicScreen.submitPhrase(phrase);

    await this.chooseAccountName(accountName);
    await this.finishOnboarding();
  }
}
