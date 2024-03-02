// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { LocalSigner } from '@petra/core/signers';
import { Account } from '@petra/core/types';
import { KeystoneSigner } from 'modules/keystone';
import LedgerSigner from './ledger';

/**
 * Get signer from account
 */
export default async function getSigner(account: Account) {
  switch (account.type) {
    case 'ledger':
      return LedgerSigner.create(account);
    case 'keystone':
      return new KeystoneSigner(account);
    default:
      return new LocalSigner(account);
  }
}
