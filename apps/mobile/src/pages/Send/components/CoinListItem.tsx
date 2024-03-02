// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { formatAmount } from '@petra/core/utils/coin';
import CoinIcon from 'pages/Send/components/CoinIcon';
import React from 'react';
import RowItem from 'core/components/RowItem';
import { AccountCoinResource } from '../hooks/useAccountCoinResources';

export interface CoinListItemProps {
  coin: AccountCoinResource;
  onPress: () => void;
}

export default function CoinListItem({ coin, onPress }: CoinListItemProps) {
  const amount = formatAmount(coin.balance, coin.info, {
    decimals: 4,
    prefix: false,
  });
  const icon = <CoinIcon coin={coin.info} size={48} />;
  return (
    <RowItem
      onPress={onPress}
      text={coin.info.name}
      subtext={amount}
      icon={icon}
    />
  );
}
