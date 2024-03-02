// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { lookUpAndAddAccount } from '@petra/core/utils/rotateKey';
import { useUnlockedAccounts } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { AptosAccount } from 'aptos';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import Routes from 'core/routes';
import {
  ImportAccountPrivateKeyLayout,
  PrivateKeyFormValues,
} from 'core/layouts/AddAccountLayout';
import ImportAccountPrivateKeyBody from 'core/components/ImportAccountPrivateKeyBody';

import {
  importAccountErrorToast,
  importAccountToast,
} from 'core/components/Toast';
import { useAnalytics } from 'core/hooks/useAnalytics';
import { importAccountEvents } from '@petra/core/utils/analytics/events';

export default function ImportAccountPrivateKey() {
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const { addAccount } = useUnlockedAccounts();
  const { aptosClient } = useNetworks();

  const onSubmit = useCallback(
    async (data: PrivateKeyFormValues, event?: React.BaseSyntheticEvent) => {
      const { privateKey } = data;
      event?.preventDefault();
      try {
        const nonHexKey = privateKey.startsWith('0x')
          ? privateKey.substring(2)
          : privateKey;
        const encodedKey = Uint8Array.from(Buffer.from(nonHexKey, 'hex'));
        const aptosAccount = new AptosAccount(encodedKey);
        // TODO: prompt user for confirmation if account is not on chain

        await lookUpAndAddAccount({
          addAccount,
          aptosAccount,
          aptosClient,
        });

        importAccountToast();

        trackEvent({ eventType: importAccountEvents.IMPORT_PK_ACCOUNT });
        navigate(Routes.wallet.path);
      } catch (err) {
        trackEvent({
          eventType: importAccountEvents.ERROR_IMPORT_PK_ACCOUNT,
        });
        importAccountErrorToast(String(err));
      }
    },
    [aptosClient, addAccount, navigate, trackEvent],
  );

  return (
    <ImportAccountPrivateKeyLayout
      headerValue={<FormattedMessage defaultMessage="Import private key" />}
      backPage={Routes.addAccount.path}
      defaultValues={{
        privateKey: '',
      }}
      onSubmit={onSubmit}
    >
      <ImportAccountPrivateKeyBody hasSubmit />
    </ImportAccountPrivateKeyLayout>
  );
}
