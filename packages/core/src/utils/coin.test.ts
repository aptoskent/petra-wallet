// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { aptToOcta, formatCoin, formatAmount, splitStringAmount } from './coin';

describe(aptToOcta, () => {
  test('converts apt to octa', () => {
    expect(aptToOcta(1)).toEqual(1e8);
    expect(aptToOcta(0.12345678)).toEqual(12345678);
  });
});

describe(formatCoin, () => {
  test('default behavior', () => {
    expect(formatCoin(undefined)).toEqual('0 APT');
    expect(formatCoin(0)).toEqual('0 APT');
    expect(formatCoin(1)).toEqual('0.00000001 APT');
    expect(formatCoin(9)).toEqual('0.00000009 APT');
    expect(formatCoin(10)).toEqual('0.0000001 APT');
    expect(formatCoin(1e8)).toEqual('1 APT');
    expect(formatCoin(2e16)).toEqual('200,000,000 APT');

    expect(formatCoin(-1)).toEqual('-0.00000001 APT');
    expect(formatCoin(-9)).toEqual('-0.00000009 APT');
    expect(formatCoin(-10)).toEqual('-0.0000001 APT');
    expect(formatCoin(-100)).toEqual('-0.000001 APT');
    expect(formatCoin(-1000)).toEqual('-0.00001 APT');
    expect(formatCoin(-10000)).toEqual('-0.0001 APT');
    expect(formatCoin(-100000)).toEqual('-0.001 APT');
    expect(formatCoin(-1000000)).toEqual('-0.01 APT');

    expect(formatCoin(-10000000)).toEqual('-0.1 APT');
    expect(formatCoin(-100000000)).toEqual('-1 APT');
    expect(formatCoin(-2e16)).toEqual('-200,000,000 APT');

    // Non-aptos coin
    // 1e12
    const coinOpts12 = {
      decimals: 12,
      multiplier: 1e-12,
      returnUnitType: 'K',
    };
    expect(formatCoin(undefined, coinOpts12)).toEqual('0 K');
    expect(formatCoin(0, coinOpts12)).toEqual('0 K');
    expect(formatCoin(1, coinOpts12)).toEqual('0.000000000001 K');
    expect(formatCoin(9, coinOpts12)).toEqual('0.000000000009 K');
    expect(formatCoin(10, coinOpts12)).toEqual('0.00000000001 K');
    // special case we were running into weird rounding
    expect(formatCoin(100000, coinOpts12)).toEqual('0.0000001 K');
    expect(formatCoin(1e12, coinOpts12)).toEqual('1 K');
    expect(formatCoin(2e16, coinOpts12)).toEqual('20,000 K');

    // 1e6
    const coinOpts6 = {
      decimals: 6,
      multiplier: 1e-6,
      returnUnitType: 'K',
    };
    expect(formatCoin(undefined, coinOpts6)).toEqual('0 K');
    expect(formatCoin(0, coinOpts6)).toEqual('0 K');
    expect(formatCoin(1, coinOpts6)).toEqual('0.000001 K');
    expect(formatCoin(9, coinOpts6)).toEqual('0.000009 K');
    expect(formatCoin(10, coinOpts6)).toEqual('0.00001 K');
    // special case we were running into weird rounding
    expect(formatCoin(100000, coinOpts12)).toEqual('0.0000001 K');
    expect(formatCoin(1e12, coinOpts6)).toEqual('1,000,000 K');
    expect(formatCoin(2e16, coinOpts6)).toEqual('20,000,000,000 K');
  });
});

describe(formatAmount, () => {
  test('default behavior', () => {
    expect(formatAmount(0)).toEqual('-0'); // FIXME?
    expect(formatAmount(1)).toEqual('+1');
    expect(formatAmount(1e4)).toEqual('+10,000');
    expect(formatAmount(1e8)).toEqual('+100,000,000');
    expect(formatAmount(-1e8)).toEqual('-100,000,000');
    expect(formatAmount(-1e4)).toEqual('-10,000');
  });
});

describe(splitStringAmount, () => {
  test('default behavior', () => {
    expect(splitStringAmount({ amount: '10', decimals: 0 })).toEqual({
      amountBigIntWithDecimals: 10n,
      amountString: '10',
    });
    expect(splitStringAmount({ amount: '10.001', decimals: 3 })).toEqual({
      amountBigIntWithDecimals: BigInt(10.001 * 1e3),
      amountString: '10.001',
    });
    expect(splitStringAmount({ amount: '10.00100000', decimals: 12 })).toEqual({
      amountBigIntWithDecimals: BigInt(10.001 * 1e12),
      amountString: '10.00100000',
    });
    expect(splitStringAmount({ amount: '0.00100000', decimals: 6 })).toEqual({
      amountBigIntWithDecimals: BigInt(0.001 * 1e6),
      amountString: '0.00100000',
    });
  });
});
