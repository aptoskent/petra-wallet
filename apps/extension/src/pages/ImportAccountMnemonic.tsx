// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosAccount } from 'aptos';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useUnlockedAccounts } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { generateMnemonicObject } from '@petra/core/utils/account';
import { lookUpAndAddAccount } from '@petra/core/utils/rotateKey';

import ImportAccountMnemonicBody from 'core/components/ImportAccountMnemonicBody';
import {
  importAccountErrorToast,
  importAccountToast,
} from 'core/components/Toast';
import { useAnalytics } from 'core/hooks/useAnalytics';
import {
  ImportAccountMnemonicLayout,
  MnemonicFormValues,
} from 'core/layouts/AddAccountLayout';
import Routes from 'core/routes';
import { importAccountEvents } from '@petra/core/utils/analytics/events';

export default function ImportWalletMnemonic() {
  const navigate = useNavigate();
  const { addAccount } = useUnlockedAccounts();
  const { aptosClient } = useNetworks();
  const { trackEvent } = useAnalytics();

  const onSubmit = useCallback(
    async (
      mnemonicAll: MnemonicFormValues,
      event?: React.BaseSyntheticEvent,
    ) => {
      event?.preventDefault();
      let mnemonicString = '';
      Object.values(mnemonicAll).forEach((value) => {
        mnemonicString = `${mnemonicString + value} `;
      });
      mnemonicString = mnemonicString.trim();
      try {
        const { mnemonic, seed } = await generateMnemonicObject(mnemonicString);
        const aptosAccount = new AptosAccount(seed);
        // TODO: prompt user for confirmation if account is not on chain

        await lookUpAndAddAccount({
          addAccount,
          aptosAccount,
          aptosClient,
          mnemonic,
        });

        importAccountToast();
        trackEvent({ eventType: importAccountEvents.IMPORT_MNEMONIC_ACCOUNT });
        navigate(Routes.wallet.path);
      } catch (err) {
        importAccountErrorToast(String(err));
        trackEvent({
          eventType: importAccountEvents.ERROR_IMPORT_MNEMONIC_ACCOUNT,
        });
      }
    },
    [navigate, trackEvent, addAccount, aptosClient],
  );

  return (
    <ImportAccountMnemonicLayout
      headerValue={<FormattedMessage defaultMessage="Import mnemonic" />}
      backPage={Routes.addAccount.path}
      defaultValues={{}}
      onSubmit={onSubmit}
    >
      <ImportAccountMnemonicBody hasSubmit />
    </ImportAccountMnemonicLayout>
  );
}
