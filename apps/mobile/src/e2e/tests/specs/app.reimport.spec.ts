// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import AccountFixture from '../fixtures/AccountFixture';
import OnboardingFixture from '../fixtures/OnboardingFixture';
import AppScreen from '../screenobjects/AppScreen';
import AssetsScreen from '../screenobjects/AssetsScreen';
import SettingsScreen from '../screenobjects/SettingsScreen';

/**
 * We had a previous SEV where the account shown to the user
 * was not the same account that was created.
 * This test goes through both primary and secondary account creation.
 */
describe('reimport', () => {
  it('primary account', async () => {
    const { phrase } = await OnboardingFixture.createNewWallet();
    await AssetsScreen.waitForIsShown();
    const address1 = await AssetsScreen.addressValue();
    await AccountFixture.removeAccount();
    await OnboardingFixture.newAccountViaPhrase(phrase);
    await AssetsScreen.waitForIsShown();
    const address2 = await AssetsScreen.addressValue();
    expect(address1).toEqual(address2);
  });

  it('secondary account', async () => {
    // we start with an account, then add a secondary account
    // then promptly remove that second account
    const address1 = await AssetsScreen.addressValue();
    await AssetsScreen.waitForIsShown();
    await OnboardingFixture.addNewAccount('New Account');
    await AssetsScreen.waitForIsShown();
    await AccountFixture.removeAccount();
    await SettingsScreen.waitForIsShown();
    await AppScreen.clickBackButton();
    const address2 = await AssetsScreen.addressValue();
    expect(address1).toEqual(address2);
  });
});
