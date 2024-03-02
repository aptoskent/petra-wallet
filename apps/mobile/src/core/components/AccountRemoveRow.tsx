// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { Account } from '@petra/core/types';
import React from 'react';
import { XCirlceSVG } from 'shared/assets/svgs';
import { accountNameDisplay } from 'shared/utils';
import AccountRowDisplay from './AccountRowDisplay';

// SPDX-License-Identifier: Apache-2.0
interface AccountRemoveRowProps {
  account: Account;
  idx: number;
  isSelected: boolean;
  onPress: (address: string) => void;
}

// eslint-disable-next-line import/prefer-default-export
export default function AccountRemoveRow({
  account,
  idx,
  isSelected,
  onPress,
}: AccountRemoveRowProps) {
  const handleOnPress = () => {
    onPress?.(account.address);
  };

  return (
    <AccountRowDisplay
      account={account}
      icon={isSelected ? <XCirlceSVG color={customColors.error} /> : null}
      nameDisplay={accountNameDisplay(account?.name, idx)}
      onPress={handleOnPress}
    />
  );
}
