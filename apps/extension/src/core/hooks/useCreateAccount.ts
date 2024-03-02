// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { AptosAccount } from 'aptos';

import { LocalAccount } from '@petra/core/types';
import { useUnlockedAccounts } from '@petra/core/hooks/useAccounts';
import {
  generateMnemonicObject,
  keysFromAptosAccount,
} from '@petra/core/utils/account';
import { accountEvents } from '@petra/core/utils/analytics/events';
import { useAnalytics } from './useAnalytics';
import {
  createAccountErrorToast,
  createAccountToast,
} from '../components/Toast';

interface UseCreateAccountProps {
  shouldAddAccount?: boolean;
  shouldFundAccount?: boolean;
  shouldShowToast?: boolean;
}
const useCreateAccount = ({
  shouldAddAccount = true,
  shouldShowToast = false,
}: UseCreateAccountProps) => {
  const { addAccount } = useUnlockedAccounts();
  const { trackEvent } = useAnalytics();

  const createAccount = async (
    newMnemonic: string,
  ): Promise<LocalAccount | undefined> => {
    let newAccount;
    try {
      const { mnemonic, seed } = await generateMnemonicObject(newMnemonic);
      const aptosAccount = new AptosAccount(seed);

      newAccount = {
        mnemonic,
        ...keysFromAptosAccount(aptosAccount),
      };

      if (shouldAddAccount) {
        await addAccount(newAccount);
      }

      if (shouldShowToast) {
        createAccountToast();
      }

      trackEvent({
        eventType: accountEvents.CREATE_ACCOUNT,
        params: {
          address: aptosAccount.address(),
        },
      });
    } catch (err) {
      if (shouldShowToast) {
        createAccountErrorToast();
      }
      trackEvent({
        eventType: accountEvents.ERROR_CREATE_ACCOUNT,
      });
    }

    return newAccount;
  };

  return { createAccount };
};

export default useCreateAccount;
