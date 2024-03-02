// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { SignupStackScreenProps } from 'navigation/types';
import PasswordEntry from 'pages/Onboarding/Shared/PasswordEntry';
import React from 'react';
import { i18nmock } from 'strings';

type SignUpPasswordEntryProps = SignupStackScreenProps<'Signup'>;

function SignUpPasswordEntry({ navigation }: SignUpPasswordEntryProps) {
  const onDone = (password: string) => {
    navigation.navigate('SignUpMnemonicDisplay', {
      confirmedPassword: password,
    });
  };

  return (
    <PasswordEntry
      onDone={onDone}
      accessibilityText={i18nmock('onboarding:accessibility.screen1')}
      buttonText={i18nmock('general:next')}
    />
  );
}

export default SignUpPasswordEntry;
