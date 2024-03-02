// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosAccount } from 'aptos';
import AssetsScreen from '../screenobjects/AssetsScreen';
import OnboardingFixture from '../fixtures/OnboardingFixture';

describe('multipleAccounts', () => {
  before(async () => {
    await OnboardingFixture.createNewWallet();
  });

  it('add second account', async () => {
    await OnboardingFixture.addNewAccount('New Account');
    await AssetsScreen.waitForIsShown();
  });

  it('import second account via key', async () => {
    const account = new AptosAccount();
    await OnboardingFixture.importNewAccountViaKey(
      account.toPrivateKeyObject().privateKeyHex,
      'Key Account',
    );
    await AssetsScreen.waitForIsShown();
  });

  it('import second account via phrase', async () => {
    const mnemonic =
      'shoot island position soft burden budget tooth cruel issue economy destroy above';
    await OnboardingFixture.importNewAccountViaPhrase(
      mnemonic,
      'Phrase Account',
    );
    await AssetsScreen.waitForIsShown();
  });
});
