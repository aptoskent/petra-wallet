// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useAccountCoinResources } from 'pages/Send/hooks/useAccountCoinResources';

export function useCoinBalance(coinType: string) {
  const { activeAccountAddress } = useActiveAccount();
  const coinResources = useAccountCoinResources(activeAccountAddress, {
    keepPreviousData: true,
  });

  const coinResource = coinResources.isSuccess
    ? coinResources.data.find((res) => res.type === coinType)
    : undefined;

  return coinResource?.balance;
}

export default useCoinBalance;
