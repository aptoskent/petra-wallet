// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { OCTA } from 'shared/constants';
import {
  computeFiatDollarValue,
  fiatDollarValueExists,
  heroAptQuantity,
  roundWithDecimals,
  computeAptValue,
} from './utils';

describe('roundWithDecimals', () => {
  it('computes properly rounding down', () => {
    expect(roundWithDecimals(12.341111)).toEqual('12.34');
  });
  it('computes properly rounding up', () => {
    expect(roundWithDecimals(12.345)).toEqual('12.35');
  });
});

const APTOS_COIN = {
  balance: 800099277100n,
  info: {
    decimals: 8,
    name: 'Aptos Coin',
    symbol: 'APT',
    type: '0x1::aptos_coin::AptosCoin',
  },
  logoUrl:
    'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/APT.webp',
  type: '0x1::aptos_coin::AptosCoin',
};
describe('computeFiatDollarValue', () => {
  it('computes the accurate value', () => {
    // 12.341111 * 8000.992771 = 98741.1399
    expect(
      computeFiatDollarValue('12.341111', APTOS_COIN, APTOS_COIN.balance),
    ).toEqual('98741.14');
  });
});

describe('fiatDollarValueExists', () => {
  it('handles undefined', () => {
    expect(fiatDollarValueExists(undefined)).toEqual(false);
  });
  it('handles empty string', () => {
    expect(fiatDollarValueExists('')).toEqual(false);
  });
  it('handles truthy values as well', () => {
    expect(fiatDollarValueExists('123')).toEqual(true);
    expect(fiatDollarValueExists('123.456')).toEqual(true);
  });
});

describe('computeAptValue', () => {
  it('computes the accurate value', () => {
    // 21 / 7 = 3 APT
    expect(computeAptValue('7', APTOS_COIN, '21')).toEqual(3 * OCTA);
  });

  it('computes the accurate value', () => {
    // 45 / 7.2829 = 6.178857323319008 APT
    expect(computeAptValue('7.2829', APTOS_COIN, '45')).toEqual(
      6.178857323319008 * OCTA,
    );
  });
});

describe('heroAptQuantity', () => {
  it('handles undefined aptDipslay', () => {
    const aptDipslay = undefined;
    expect(heroAptQuantity(aptDipslay, '0')).toEqual('0');
    expect(heroAptQuantity(aptDipslay, '1.23')).toEqual('1.23');
  });

  it('handles aptDisplay of zero', () => {
    const aptDipslay = '0';
    expect(heroAptQuantity(aptDipslay, '0')).toEqual('0');
    expect(heroAptQuantity(aptDipslay, '1.23')).toEqual('1.23');
  });

  it('uses persisted aptDisplay when quantity display is zero', () => {
    const aptDipslay = '1.23';
    expect(heroAptQuantity(aptDipslay, '0')).toEqual('1.23');
  });

  it('uses persisted aptDisplay when quantity display is undefined', () => {
    const aptDipslay = '1.23';
    expect(heroAptQuantity(aptDipslay, undefined)).toEqual('1.23');
  });

  it('uses a non-zero and non-undefined quantity display over a persisted state value', () => {
    const aptDipslay = '1.23';
    expect(heroAptQuantity(aptDipslay, '1.5')).toEqual('1.5');
  });
});
