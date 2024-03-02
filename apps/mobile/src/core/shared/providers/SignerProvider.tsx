// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { SignerContext } from '@petra/core/hooks/useSigner';
import React, { PropsWithChildren } from 'react';
import { Account } from '@petra/core/types';
import { LocalSigner } from '@petra/core/signers';

async function getSigner(account: Account) {
  switch (account.type) {
    case 'ledger':
    case 'keystone':
      throw new Error('Account type not supported');
    default:
      return new LocalSigner(account);
  }
}

export default function SignerProvider({ children }: PropsWithChildren) {
  return (
    <SignerContext.Provider value={getSigner as any}>
      {children}
    </SignerContext.Provider>
  );
}
