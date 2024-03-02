// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { HexString } from 'aptos';
import {
  useUnlockedAccounts,
  useActiveAccount,
} from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { generateMnemonic } from '@petra/core/utils/account';
import { collapseHexString } from '@petra/core/utils/hex';

import {
  rotateKeySuccessToast,
  rotateKeyErrorToast,
  rotateKeyInsufficientBalanceErrorToast,
  rotateKeySequenceNumberTooOldErrorToast,
} from 'core/components/Toast';
import useCreateAccount from './useCreateAccount';

interface RotateKeyProps {
  onRotateKeyComplete: () => void;
  onRotateKeySuccess: () => void;
}
const useRotateKey = () => {
  const { activeAccount, aptosAccount } = useActiveAccount();
  const { updateActiveAccount } = useUnlockedAccounts();
  const { aptosClient } = useNetworks();
  const { createAccount } = useCreateAccount({
    shouldAddAccount: false,
    shouldShowToast: false,
  });

  const rotateKey = async ({
    onRotateKeyComplete,
    onRotateKeySuccess,
  }: RotateKeyProps) => {
    if (!aptosAccount) {
      rotateKeyErrorToast({
        address: collapseHexString(activeAccount.address),
      });
      return;
    }

    try {
      const newMnemonic = generateMnemonic();
      const newAccount = await createAccount(newMnemonic);

      if (!newAccount) {
        return;
      }

      const transaction = await aptosClient.rotateAuthKeyEd25519(
        aptosAccount,
        HexString.ensure(newAccount.privateKey).toUint8Array(),
      );

      // if payload exists in transaction, it means the key rotation was successful
      if (transaction.payload) {
        newAccount.address = aptosAccount.address().hex();

        await updateActiveAccount(newAccount);

        rotateKeySuccessToast({
          address: collapseHexString(newAccount.address),
        });
        onRotateKeySuccess();
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE')) {
          rotateKeyInsufficientBalanceErrorToast({
            address: collapseHexString(activeAccount.address),
          });
          onRotateKeyComplete();
          return;
        }

        if (err.message.includes('SEQUENCE_NUMBER_TOO_OLD')) {
          rotateKeySequenceNumberTooOldErrorToast({
            address: collapseHexString(activeAccount.address),
          });
          onRotateKeyComplete();
          return;
        }

        rotateKeyErrorToast({
          address: collapseHexString(activeAccount.address),
        });
      }
    }
  };

  return {
    rotateKey,
  };
};

export default useRotateKey;
