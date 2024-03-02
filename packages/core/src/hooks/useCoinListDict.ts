// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { type RawCoinInfo } from '@manahippo/coin-list';
import mainList from './coinsLists/mainnetList';
import testList from './coinsLists/testnetList';
import { useNetworks } from './useNetworks';
import { DefaultNetworks } from '../types';

export const COIN_LISTS: Record<DefaultNetworks, RawCoinInfo[]> = Object.freeze(
  {
    [DefaultNetworks.Mainnet]: mainList,
    [DefaultNetworks.Testnet]: testList,
    [DefaultNetworks.Devnet]: [],
    [DefaultNetworks.Localhost]: [],
  },
);

export const getCoinListQueryKey = (activeNetworkName: string) => [
  'getCoins',
  activeNetworkName,
];

export const useCoinListDict = () => {
  const { activeNetworkName } = useNetworks();
  const coinList = React.useMemo(
    () => COIN_LISTS[activeNetworkName as DefaultNetworks] || [],
    [activeNetworkName],
  );

  const coinListDict = useMemo(() => {
    const dict: Record<string, RawCoinInfo> = {};
    coinList.forEach((coin: RawCoinInfo) => {
      dict[coin.token_type.type] = coin;
    });
    return dict;
  }, [coinList]);

  const allCoinsLogoHash = useMemo(() => {
    const hash = new Map();

    Object.values(coinListDict).forEach((coin) => {
      hash.set(coin.token_type.type, coin.logo_url);
    });

    return hash;
  }, [coinListDict]);

  return { allCoinsLogoHash, coinListDict };
};

export default useCoinListDict;
