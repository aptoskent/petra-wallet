// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from 'react';
import { Signer } from '../signers';
import { Account } from '../types';

export type SignerGetter = (account: Account) => Promise<Signer>;

export const SignerContext = createContext<SignerGetter | undefined>(undefined);
SignerContext.displayName = 'SignerContext';

export default function useSigner() {
  const getSigner = useContext(SignerContext);
  if (getSigner === undefined) {
    throw new Error('No SignerContext was provided');
  }

  /**
   * Scoped usage of signer, to ensure automatic release
   * @param account account used to create the signer
   * @param callback callback that requires a signer
   */
  const withSigner = async <T>(
    account: Account,
    callback: (signer: Signer) => Promise<T>,
  ) => {
    const signer = await getSigner(account);
    try {
      return await callback(signer);
    } finally {
      await signer.close();
    }
  };

  return {
    getSigner,
    withSigner,
  };
}
