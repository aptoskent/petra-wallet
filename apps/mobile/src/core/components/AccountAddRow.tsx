// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { Account, PublicAccount } from '@petra/core/types';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import CheckIconSVG from 'shared/assets/svgs/check_icon';
import { accountNameDisplay } from 'shared/utils';
import AccountRowDisplay from './AccountRowDisplay';

// SPDX-License-Identifier: Apache-2.0
interface AccountRowProps {
  account: Account;
  currentActiveAccount: PublicAccount;
  handleUpdateActiveAccount: (address: string) => void;
  idx: number;
  isSwitchingAccount: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export default function AccountAddRow({
  account,
  currentActiveAccount,
  handleUpdateActiveAccount,
  idx,
  isSwitchingAccount,
}: AccountRowProps) {
  const isActive = currentActiveAccount.address === account.address;
  const checkOrLoadingDisplay = () => {
    if (isSwitchingAccount && isActive) {
      return <ActivityIndicator />;
    }

    return isActive ? <CheckIconSVG color={customColors.green['600']} /> : null;
  };

  const onPress = () => {
    if (!isActive) {
      handleUpdateActiveAccount(account.address);
    }
  };

  return (
    <AccountRowDisplay
      account={account}
      nameDisplay={accountNameDisplay(account?.name, idx)}
      icon={checkOrLoadingDisplay()}
      onPress={onPress}
    />
  );
}
