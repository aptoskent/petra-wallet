// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosAccount } from 'aptos';
import { useUnlockedAccounts } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { generateMnemonicObject, lookUpAndAddAccount } from 'core/utils';

export default function useImportWalletCreation() {
  const { aptosClient } = useNetworks();
  const { addAccount } = useUnlockedAccounts();
  const addAccountWithPrivateKey = async (
    privateKey: string,
    accountName?: string,
  ) => {
    const nonHexKey = privateKey.startsWith('0x')
      ? privateKey.substring(2)
      : privateKey;
    const encodedKey = Uint8Array.from(Buffer.from(nonHexKey, 'hex'));
    const aptosAccount = new AptosAccount(encodedKey);

    await lookUpAndAddAccount({
      accountName,
      addAccount,
      aptosAccount,
      aptosClient,
    });
  };

  const addAccountWithMnemonic = async (
    mnemonicString: string,
    accountName?: string,
  ) => {
    const { mnemonic, seed } = await generateMnemonicObject(mnemonicString);
    const aptosAccount = new AptosAccount(seed);
    await lookUpAndAddAccount({
      accountName,
      addAccount,
      aptosAccount,
      aptosClient,
      mnemonic,
    });
  };

  return {
    addAccountWithMnemonic,
    addAccountWithPrivateKey,
  };
}
