// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ActivityGroup } from '@petra/core/activity/group';
import { AptosIdentity } from '@petra/core/activity/types';
import { CoinInfoData } from '@petra/core/types';
import { formatAmount } from '@petra/core/utils/coin';
import collapseHexString from '@petra/core/utils/hex';
import { i18nmock } from 'strings';

export default function addressTextFromIdentity(identity: AptosIdentity) {
  return (
    identity?.name?.toString() ??
    (identity?.address ? collapseHexString(identity.address, 6) : '')
  );
}

export function formatCoin(amount: bigint, coinInfo: CoinInfoData | undefined) {
  if (!coinInfo) return undefined;

  const returnAmount = formatAmount(amount, coinInfo, {
    decimals: coinInfo.decimals,
    prefix: false,
  });
  // if the amount returned is 0, we don't want to show it
  return returnAmount.split(' ')[0] === '0' ? undefined : returnAmount;
}

export function symbolForCoin(
  coin: string,
  coinInfo: CoinInfoData | undefined,
) {
  return coinInfo?.symbol ?? coin.split(':').pop();
}

export const getGroupTitle = (group: ActivityGroup) => {
  switch (group.name) {
    case 'today':
      return i18nmock('activity:date.today');
    case 'yesterday':
      return i18nmock('activity:date.yesterday');
    case 'thisWeek':
      return i18nmock('activity:date.thisWeek');
    default:
      // TODO: Add locales
      return group.start.toLocaleString('en-us', {
        month: 'long',
        year: 'numeric',
      });
  }
};
