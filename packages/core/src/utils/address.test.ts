// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { isAptosName, isAddressValid, formatAddress } from './address';

describe(isAptosName, () => {
  test('when name ends with .apt', () => {
    expect(isAptosName('1337.apt')).toBe(true);
  });

  test('when name does not end with .apt', () => {
    expect(isAptosName('133.7apt')).toBe(false);
  });
});

describe(isAddressValid, () => {
  test('valid addresses', () => {
    [
      '0x3a76a4cee5682ae7856c3ea6b622a0c3c564efa973f34b5f08cc720a1857de17',
      '3a76a4cee5682ae7856c3ea6b622a0c3c564efa973f34b5f08cc720a1857de17',
    ].forEach((address) => {
      expect(isAddressValid(address)).toBe(true);
    });
  });

  test('invalid addresses', () => {
    [
      'a76a4cee5682ae7856c3ea6b622a0c3c564efa973f34b5f08cc720a1857de17',
      '0xa76a4cee5682ae7856c3ea6b622a0c3c564efa973f34b5f08cc720a1857de17',
      '0x3a76a4cee5682ae7856c3ea6b622a0c3c564ef',
      undefined,
    ].forEach((address) => {
      expect(isAddressValid(address)).toBe(false);
    });
  });
});

describe(formatAddress, () => {
  test('prefixed address', () => {
    expect(
      formatAddress(
        '0x3a76a4cee5682ae7856c3ea6b622a0c3c564efa973f34b5f08cc720a1857de17',
      ),
    ).toBe(
      '0x3a76a4cee5682ae7856c3ea6b622a0c3c564efa973f34b5f08cc720a1857de17',
    );
  });

  test('unprefixed address', () => {
    expect(
      formatAddress(
        '3a76a4cee5682ae7856c3ea6b622a0c3c564efa973f34b5f08cc720a1857de17',
      ),
    ).toBe(
      '0x3a76a4cee5682ae7856c3ea6b622a0c3c564efa973f34b5f08cc720a1857de17',
    );
  });
});
