// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { normalizeAddress } from './account';

const trimmedAddress =
  '0x100000000000000000000000000000000000000000000000000000000000001';
const unTrimmedAddress =
  '0x0100000000000000000000000000000000000000000000000000000000000001';

const shortAddress = '0x1';
const paddedShortAddress =
  '0x0000000000000000000000000000000000000000000000000000000000000001';

test('pad address with 0', async () => {
  expect(normalizeAddress(trimmedAddress)).toEqual(unTrimmedAddress);
});

test('pad short address with 0', async () => {
  expect(normalizeAddress(shortAddress)).toEqual(paddedShortAddress);
});

test('normalize a normalized address', async () => {
  expect(normalizeAddress(unTrimmedAddress)).toEqual(unTrimmedAddress);
});
