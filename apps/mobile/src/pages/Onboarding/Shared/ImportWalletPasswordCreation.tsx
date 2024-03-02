// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ImportStackScreenProps } from 'navigation/types';
import React from 'react';
import { i18nmock } from 'strings';
import PasswordEntry from './PasswordEntry';

type ImportWalletPasswordCreationProps =
  ImportStackScreenProps<'ImportWalletPasswordCreation'>;

function ImportWalletPasswordCreation({
  navigation,
  route,
}: ImportWalletPasswordCreationProps) {
  const { mnemonic, privateKey } = route.params;

  const onDone = async (confirmedPassword: string) => {
    navigation.navigate('ImportWalletChooseAccountName', {
      confirmedPassword,
      fromRoute: 'ImportWalletPasswordCreation',
      isAddAccount: route.params?.isAddAccount,
      mnemonic,
      privateKey,
    });
  };

  return (
    <PasswordEntry
      onDone={onDone}
      accessibilityText={i18nmock('onboarding:accessibility.unlockAccount')}
      buttonText={i18nmock('general:continue')}
      returnKeyType="next"
    />
  );
}

export default ImportWalletPasswordCreation;
