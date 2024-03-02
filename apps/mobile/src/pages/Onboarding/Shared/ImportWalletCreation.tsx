// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosAccount } from 'aptos';
import { useAccounts } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { generateMnemonicObject, lookUpAndInitAccounts } from 'core/utils';

export default function useImportWalletCreation() {
  const { aptosClient } = useNetworks();
  const { initAccounts } = useAccounts();

  const createAccountWithMnemonic = async (
    mnemonicString: string,
    password: string,
    accountName?: string,
  ) => {
    const { mnemonic, seed } = await generateMnemonicObject(mnemonicString);
    const aptosAccount = new AptosAccount(seed);
    await lookUpAndInitAccounts({
      accountName,
      aptosAccount,
      aptosClient,
      confirmPassword: password,
      initAccounts,
      mnemonic,
    });
  };

  const createAccountWithPrivateKey = async (
    privateKey: string,
    password: string,
    accountName?: string,
  ) => {
    const nonHexKey = privateKey.startsWith('0x')
      ? privateKey.substring(2)
      : privateKey;
    const encodedKey = Uint8Array.from(Buffer.from(nonHexKey, 'hex'));
    const aptosAccount = new AptosAccount(encodedKey);

    // initialize password and wallet
    await lookUpAndInitAccounts({
      accountName,
      aptosAccount,
      aptosClient,
      confirmPassword: password,
      initAccounts,
    });
  };

  return {
    createAccountWithMnemonic,
    createAccountWithPrivateKey,
  };
}
