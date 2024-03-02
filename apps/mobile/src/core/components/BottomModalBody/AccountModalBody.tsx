// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AccountAddRow from 'core/components/AccountAddRow';
import { Account, Accounts, PublicAccount } from '@petra/core/types';
import AccountRemoveRow from 'core/components/AccountRemoveRow';
import AddRemoveAccountRow from 'core/components/AddRemoveAccountRow';
import { testProps } from 'e2e/config/testProps';
import { View } from 'react-native';

interface RecieveModalBodyProps {
  accounts?: Accounts;
  activeAccount?: PublicAccount;
  handleBottomRowPress?: () => void;
  handleOnPress: (address: string) => void;
  isAddAccount: boolean;
  isSwitchingAccount?: boolean;
  selectedAccountAddresses?: Set<string>;
}

function RecieveModalBody({
  accounts,
  activeAccount,
  handleBottomRowPress,
  handleOnPress,
  isAddAccount,
  isSwitchingAccount,
  selectedAccountAddresses,
}: RecieveModalBodyProps) {
  const renderAccountRows = () => {
    if (accounts === undefined) {
      return null;
    }
    if (isAddAccount && activeAccount && handleOnPress) {
      return Object.values(accounts).map((account: Account, idx: number) => (
        <AccountAddRow
          account={account}
          currentActiveAccount={activeAccount}
          handleUpdateActiveAccount={handleOnPress}
          idx={idx + 1}
          isSwitchingAccount={isSwitchingAccount ?? false}
          key={account.address}
        />
      ));
    }

    // is removing account(s)
    return Object.values(accounts).map((account: Account, idx: number) => (
      <AccountRemoveRow
        account={account}
        idx={idx + 1}
        isSelected={selectedAccountAddresses?.has(account.address) ?? false}
        key={account.address}
        onPress={handleOnPress}
      />
    ));
  };

  return (
    <View {...testProps('AccountSwitcher-screen')}>
      {renderAccountRows()}
      {!!handleBottomRowPress && (
        <AddRemoveAccountRow
          isAddAccount={isAddAccount}
          onPress={handleBottomRowPress}
        />
      )}
    </View>
  );
}

export default RecieveModalBody;
