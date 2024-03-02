// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import CongratsFinish from './CongratsFinish';
import useImportWalletAddition from './ImportWalletAddition';

type Props =
  | RootAuthenticatedStackScreenProps<'ImportWalletCongratsFinish'>
  | RootAuthenticatedStackScreenProps<'SignUpCongratsFinish'>;
export default function CongratsFinishAddAccount({ ...props }: Props) {
  const { addAccountWithMnemonic, addAccountWithPrivateKey } =
    useImportWalletAddition();
  const { activeAccountAddress } = useActiveAccount();
  return (
    <CongratsFinish
      {...props}
      activeAccountAddress={activeAccountAddress}
      addAccountWithMnemonic={addAccountWithMnemonic}
      addAccountWithPrivateKey={addAccountWithPrivateKey}
    />
  );
}
