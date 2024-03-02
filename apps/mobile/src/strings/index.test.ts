// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as mock from 'strings/files.mock';
import { i18nmock } from './index';

jest.mock('./files', () => mock);

describe('i18nmock', () => {
  it('returns the proper string for assets', () => {
    expect(i18nmock('mock:assets.nfts')).toBe('NFTs');
  });

  it('returns the proper string for activity', () => {
    expect(i18nmock('mock:activity.nullState.title')).toBe('No Activity Yet');
    expect(i18nmock('mock:activity.nullState.message')).toBe(
      'All of your transactions and dApp interactions will show up here.',
    );
    expect(i18nmock('mock:activity.successStatus')).toBe('Success');
    expect(i18nmock('mock:activity.failedStatus')).toBe('Failed');
  });

  it('returns the proper string for general', () => {
    expect(i18nmock('mock:general.submit')).toBe('Submit');
    expect(i18nmock('mock:general.forgotPassword')).toBe('Forgot Password?');
  });

  it('returns the proper string for onboarding', () => {
    expect(i18nmock('mock:onboarding.importWallet.title')).toBe(
      'Import Account',
    );
    expect(i18nmock('mock:onboarding.importWallet.subtext')).toBe(
      "you'll do something",
    );
    expect(i18nmock('mock:onboarding.importWallet.addPrivateKey.title')).toBe(
      'Enter Private Key',
    );
  });

  it('returns the proper string for send', () => {
    expect(i18nmock('mock:send.confirmation.newAccountWarningTitle')).toBe(
      'Account Not Yet Found',
    );
  });

  it('returns the proper string for settings', () => {
    expect(i18nmock('mock:settings.manageAccount.title')).toBe(
      'Manage Account',
    );
  });
});
