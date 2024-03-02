// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosAccount } from 'aptos';

import AssetsScreen from '../screenobjects/AssetsScreen';
import OnboardingFixture from '../fixtures/OnboardingFixture';
import AccountFixture from '../fixtures/AccountFixture';

describe('onboarding', () => {
  afterEach(async () => {
    if (await AssetsScreen.isDisplayed()) {
      await AccountFixture.removeAccount();
    }
  });

  it('create new wallet', async () => {
    await OnboardingFixture.createNewWallet();

    // Assets
    await AssetsScreen.waitForIsShown();
    await AssetsScreen.isBalanceDisplayed();
  });

  it('import wallet via private key', async () => {
    const account = new AptosAccount();
    await OnboardingFixture.newAccountViaPrivateKey(
      account.toPrivateKeyObject().privateKeyHex,
    );

    // Assets
    await AssetsScreen.waitForIsShown();
    await AssetsScreen.addressClick();
  });

  it('import wallet via phrase', async () => {
    const mnemonic =
      'shoot island position soft burden budget tooth cruel issue economy destroy above';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const expectedAddress =
      '0x07968dab936c1bad187c60ce4082f307d030d780e91e694ae03aef16aba73f30';

    await OnboardingFixture.newAccountViaPhrase(mnemonic);

    // Assets
    await AssetsScreen.waitForIsShown();
    await AssetsScreen.addressClick();
  });
});
