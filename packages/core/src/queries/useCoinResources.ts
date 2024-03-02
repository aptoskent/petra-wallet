// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { useActiveAccount } from '../hooks/useAccounts';
import { AccountCoinResource, useAccountCoinResources } from './account';

const useCoinResources = () => {
  const { activeAccountAddress } = useActiveAccount();

  const coinResources = useAccountCoinResources(activeAccountAddress, {
    refetchInterval: 10000,
  });

  const registeredCoinHash = useMemo(() => {
    const hash = new Map();

    const recognizedCoins = coinResources?.data?.recognizedCoins || [];
    const unrecognizedCoins = coinResources?.data?.unrecognizedCoins || [];
    const allCoins = [...recognizedCoins, ...unrecognizedCoins];

    allCoins.forEach((coin: AccountCoinResource) => {
      hash.set(coin.info.type, true);
    });

    return hash;
  }, [coinResources]);

  return {
    coinsHash: registeredCoinHash,
    isError: coinResources.isError,
    isLoading: coinResources.isLoading,
    isSuccess: coinResources.isSuccess,
  };
};

export default useCoinResources;
