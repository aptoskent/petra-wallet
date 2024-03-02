// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import constate from 'constate';
import { useState } from 'react';
import { getServerTime } from '../utils/server-time';

export interface AptosPriceInfo {
  currentPrice: string;
  lastFetched: number;
  percentChange: number;
}

export const [CoinGeckoProvider, useCoinGecko] = constate(() => {
  const [aptosPriceInfo, setAptosPriceInfo] = useState<AptosPriceInfo | null>();
  const [isFetchingAptosCoinInfo, setIsFetchingAptosCoinInfo] =
    useState<boolean>(false);
  const [errorFetchingCoinGecko, setErrorFetchingCoinGecko] =
    useState<boolean>(false);

  const fetchAptosCoinInfo = async (handleTrackFailure: () => void) => {
    if (isFetchingAptosCoinInfo) {
      return;
    }
    const currency = 'usd';
    const coingeckoUrl = `https://api.coingecko.com/api/v3/simple/token_price/aptos?contract_addresses=0x1%3A%3Aaptos_coin%3A%3AAptosCoin&vs_currencies=${currency}&include_24hr_change=true`;
    setErrorFetchingCoinGecko(false);
    setIsFetchingAptosCoinInfo(true);
    try {
      const response = await fetch(coingeckoUrl);
      const data = await response.json();
      const priceInfo = data['0x1::aptos_coin::AptosCoin'];
      setIsFetchingAptosCoinInfo(false);
      setAptosPriceInfo({
        currentPrice: priceInfo[`${currency}`],
        lastFetched: getServerTime(),
        percentChange: priceInfo[`${currency}_24h_change`],
      });
    } catch {
      setErrorFetchingCoinGecko(true);
      handleTrackFailure();
    }
  };

  return {
    aptosPriceInfo,
    errorFetchingCoinGecko,
    fetchAptosCoinInfo,
    isFetchingAptosCoinInfo,
  };
});
