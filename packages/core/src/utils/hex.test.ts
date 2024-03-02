// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { collapseHexString } from './hex';

describe(collapseHexString, () => {
  const address =
    '0x3a76a4cee5682ae7856c3ea6b622a0c3c564efa973f34b5f08cc720a1857de17';

  test('default behavior', () => {
    expect(collapseHexString(address)).toBe('0x3a76a..7de17');
  });
});
