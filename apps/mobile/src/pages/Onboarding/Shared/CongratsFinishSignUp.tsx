// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  ImportStackScreenProps,
  SignupStackScreenProps,
} from 'navigation/types';
import { useAccounts } from '@petra/core/hooks/useAccounts';
import CongratsFinish from './CongratsFinish';
import useImportWalletCreation from './ImportWalletCreation';

type Props =
  | SignupStackScreenProps<'SignUpCongratsFinish'>
  | ImportStackScreenProps<'ImportWalletCongratsFinish'>;
export default function CongratsFinishSignUp({ ...props }: Props) {
  const { createAccountWithMnemonic, createAccountWithPrivateKey } =
    useImportWalletCreation();
  const { activeAccountAddress } = useAccounts();
  return (
    <CongratsFinish
      {...props}
      activeAccountAddress={activeAccountAddress}
      createAccountWithMnemonic={createAccountWithMnemonic}
      createAccountWithPrivateKey={createAccountWithPrivateKey}
    />
  );
}
