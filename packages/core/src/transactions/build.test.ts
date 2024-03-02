// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  buildCoinTransferPayload,
  buildRawTransactionFromBCSPayload,
  defaultExpirationSecondsFromNow,
} from './build';

jest.useFakeTimers();

describe('buildRawTransactionFromBCSPayload()', () => {
  beforeEach(() => {
    jest.setSystemTime(new Date('2022-10-17'));
  });

  const sender = '0x42';
  const recipient = '0x305';
  const payload = buildCoinTransferPayload({ amount: 717n, recipient });

  it('adds expirationTimestamp when expirationSecondsFromNow is not specified', () => {
    const rawTxn = buildRawTransactionFromBCSPayload(sender, 0, 0, payload);
    expect(rawTxn.expiration_timestamp_secs).toEqual(
      1665964800n + BigInt(defaultExpirationSecondsFromNow),
    );
  });

  it('adds expirationTimestamp when expirationSecondsFromNow is specified', () => {
    const options = {
      expirationSecondsFromNow: 1337,
    };
    const rawTxn = buildRawTransactionFromBCSPayload(
      sender,
      0,
      0,
      payload,
      options,
    );
    expect(rawTxn.expiration_timestamp_secs).toEqual(1665964800n + 1337n);
  });
});
