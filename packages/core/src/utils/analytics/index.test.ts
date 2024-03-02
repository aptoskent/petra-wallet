// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosAccount } from 'aptos';
import { generateMnemonic } from '../account';
import filterAnalyticsEvent from './index';

describe(filterAnalyticsEvent, () => {
  it('redacts hex keys', () => {
    const account = new AptosAccount();
    expect(filterAnalyticsEvent(account.toPrivateKeyObject())).toEqual({
      address: '[redacted]',
      privateKeyHex: '[redacted]',
      publicKeyHex: '[redacted]',
    });
  });

  it('redacts uint8 keys', () => {
    const account = new AptosAccount();
    expect(
      filterAnalyticsEvent({
        foo: 'bar',
        key: account.signingKey,
      }),
    ).toEqual({
      foo: 'bar',
      key: {
        publicKey: '[redacted]',
        secretKey: '[redacted]',
      },
    });
  });

  it('redacts mnemonic phrases', () => {
    const mnemonic = generateMnemonic();
    expect(
      filterAnalyticsEvent({
        foo: 'bar',
        mnemonic,
      }),
    ).toEqual({
      foo: 'bar',
      mnemonic: '[redacted]',
    });
  });

  it('redacts mnemonic phrases within other text', () => {
    const mnemonic = generateMnemonic();
    const message = `The mnemonic is ${mnemonic} lorem ipsum`;
    expect(filterAnalyticsEvent(message)).toEqual(
      'The mnemonic is [redacted] lorem ipsum',
    );
  });

  it('does not redact ordinary error messages', () => {
    const error =
      'The API key included in the script element that loads the API has expired or is not recognized by the system.';
    expect(
      filterAnalyticsEvent({
        error,
        foo: 'bar',
      }),
    ).toEqual({
      error,
      foo: 'bar',
    });
  });
});
