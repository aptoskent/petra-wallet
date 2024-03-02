// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosAccount } from 'aptos';
import {
  generateMnemonicObject,
  keysFromAptosAccount,
} from 'core/utils/mobileAccount';

export interface PublicAccount {
  address: string;
  publicKey: string;
}

export type Account = PublicAccount & {
  mnemonic?: string;
  name?: string;
  privateKey: string;
};

const createAccount = async (
  newMnemonic: string,
): Promise<Account | undefined> => {
  let newAccount;
  try {
    const { mnemonic, seed } = await generateMnemonicObject(newMnemonic);
    const aptosAccount = new AptosAccount(seed);

    newAccount = {
      mnemonic,
      ...keysFromAptosAccount(aptosAccount),
    };
  } catch (err) {
    // handle err
  }

  return newAccount;
};

export default createAccount;
