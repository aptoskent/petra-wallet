// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { duplicatesExist } from 'core/utils/mobileAccount';

const mnemonicWithDupes = 'dog dog bird cat horse';
const mnemonicWithDupesAtEnd = 'dog cat bird dog';
const mnemonicWithOutDupes = 'dog bird cat horse pig goat etc';

describe('duplicatesExist', () => {
  it('returns true if there are duplicates', () => {
    expect(duplicatesExist(mnemonicWithDupes)).toBe(true);
  });
  it('returns true if there are duplicates and handles duplicate at the end of array', () => {
    expect(duplicatesExist(mnemonicWithDupesAtEnd)).toBe(true);
  });
  it('returns false if there are no duplicates', () => {
    expect(duplicatesExist(mnemonicWithOutDupes)).toBe(false);
  });
});
