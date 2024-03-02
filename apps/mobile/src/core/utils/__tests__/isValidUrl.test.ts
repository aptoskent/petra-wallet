// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import isValidUrl from 'core/utils/isValidUrl';

describe('isValidUrl', () => {
  it('returns true for valid urls', () => {
    expect(isValidUrl('https://test.lol')).toBe(true);
    expect(isValidUrl('http://test.lol')).toBe(true);
  });
  it('returns false for invalid urls', () => {
    expect(isValidUrl('test')).toBe(false);
    expect(isValidUrl('.test')).toBe(false);
    expect(isValidUrl('test.lol')).toBe(false);
    expect(isValidUrl('www.test.lol')).toBe(false);
  });
});
