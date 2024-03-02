// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react-hooks/exhaustive-deps */

import { useAccountCoinResources } from '@petra/core/queries/account';
import RefetchInterval from '@petra/core/hooks/constants';
import { RawCoinInfoWithLogo } from 'pages/Assets/shared';
import React from 'react';
import { APTOS_COIN_TYPE } from 'shared/constants';
import useCoinListDict from '@petra/core/hooks/useCoinListDict';
import { useAccounts } from '@petra/core/hooks/useAccounts';
import { useAppState } from '@petra/core/hooks/useAppState';
import { useCoinGecko } from '@petra/core/hooks/useCoinGecko';
import { formatAmount } from '@petra/core/utils/coin';
import CoinRow, { CoinRowLimited } from 'pages/Assets/Coins/CoinRow';
import {
  computeFiatDollarValue,
  heroAptQuantity,
} from 'pages/Assets/Shared/utils';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { coinEvents } from '@petra/core/utils/analytics/events';

function getQuantityDisplay(aptosCoin: any): string {
  const { decimals, name, symbol, type } = aptosCoin.info;
  return formatAmount(
    aptosCoin?.balance ?? 0,
    {
      decimals,
      name,
      symbol,
      type,
    },
    {
      prefix: false,
      suffix: false,
    },
  );
}
export default function useCoinDisplay() {
  const [aptosCoin, setAptosCoin] = React.useState<any>(null);
  const { allCoinsLogoHash } = useCoinListDict();
  const { activeAccountAddress } = useAccounts();
  const { aptDisplayByAccount, updatePersistentState } = useAppState();
  const { aptosPriceInfo, fetchAptosCoinInfo } = useCoinGecko();
  const { trackEvent } = useTrackEvent();

  const { data: accountCoinResourcesRaw, isLoading } = useAccountCoinResources(
    activeAccountAddress,
    {
      refetchInterval: RefetchInterval.LONG,
    },
  );

  const handleTrackCoinGeckoFailure = () => {
    void trackEvent({
      eventType: coinEvents.ERROR_COIN_GECKO_FETCH,
    });
  };

  React.useEffect(() => {
    if (aptosCoin) {
      void fetchAptosCoinInfo(handleTrackCoinGeckoFailure);
    }
  }, [aptosCoin, activeAccountAddress]);

  const allCoins: RawCoinInfoWithLogo[] = React.useMemo(() => {
    let foundAptosCoin: null | RawCoinInfoWithLogo = null;
    const coins: RawCoinInfoWithLogo[] = [];
    (accountCoinResourcesRaw?.recognizedCoins ?? []).forEach((coin) => {
      const recognizedCoin = {
        ...coin,
        logoUrl: allCoinsLogoHash.get(coin.type),
      };
      if (coin.type === APTOS_COIN_TYPE) {
        foundAptosCoin = recognizedCoin;
        // if APT is found in the user's list of coins, update the persisted balance
        // to display.  persisted balance can not be updated to '0' with this block of
        // code - there's an assumption that if APT is found in the list of recognized coins
        // there is a positive balance (greater than zero)
        if (activeAccountAddress !== undefined) {
          const quantityToPersist = getQuantityDisplay(foundAptosCoin);
          if (quantityToPersist !== '0' && quantityToPersist !== undefined) {
            updatePersistentState({
              aptDisplayByAccount: {
                ...aptDisplayByAccount,
                [activeAccountAddress]: quantityToPersist,
              },
            });
          }
        }
      }
      coins.push(recognizedCoin);
    });
    (accountCoinResourcesRaw?.unrecognizedCoins ?? []).forEach((coin) =>
      coins.push({ ...coin, logoUrl: allCoinsLogoHash.get(coin.type) }),
    );

    // if a user does not have any APT in their accountCoinResources, make sure the
    // persisted aptDisplayByAccount is updated to properly show the zero balance.
    // note: accountCoinResourcesRaw is undefined before making a call - for an account
    // with no coins, the response from accountCoinResourcesRaw looks like:
    // {"recognizedCoins": [], "unrecognizedCoins": []}
    if (
      !foundAptosCoin &&
      accountCoinResourcesRaw !== undefined &&
      activeAccountAddress !== undefined
    ) {
      updatePersistentState({
        aptDisplayByAccount: {
          ...aptDisplayByAccount,
          [activeAccountAddress]: '0',
        },
      });
    }

    if (accountCoinResourcesRaw !== undefined) {
      // response from accountCoinResourcesRaw is undefined when there is not a
      // legit response.  a legit response indicating no coins looks like:
      // {"recognizedCoins": [], "unrecognizedCoins": []}
      setAptosCoin(foundAptosCoin);
    }

    return coins;
  }, [activeAccountAddress, accountCoinResourcesRaw, allCoinsLogoHash]);

  const aptosCoinLimitedDisplay = (
    handleNavigateToDetails?: (coinType: string) => void,
  ) => (
    <CoinRowLimited
      key="aptos-coin"
      coin={aptosCoin}
      handleOnPress={handleNavigateToDetails}
    />
  );

  const aptosCoinFullDisplay = (
    handleNavigateToDetails?: (coinType: string) => void,
  ) => (
    <CoinRow
      key="aptos-coin"
      coin={aptosCoin}
      extraData={priceDisplayValues}
      handleNavigateToDetails={handleNavigateToDetails}
    />
  );

  const aptosCoinDisplay = (
    handleNavigateToDetails?: (coinType: string) => void,
  ): JSX.Element => {
    if (aptosPriceInfo !== null) {
      return aptosCoinFullDisplay(handleNavigateToDetails);
    }
    return aptosCoinLimitedDisplay(handleNavigateToDetails);
  };

  const handleRenderCoin = (
    coin: RawCoinInfoWithLogo,
    handleNavigateToDetails?: (coinType: string) => void,
  ): JSX.Element =>
    coin.info.type === APTOS_COIN_TYPE ? (
      aptosCoinDisplay(handleNavigateToDetails)
    ) : (
      <CoinRowLimited
        key={coin.info.name}
        coin={coin}
        handleOnPress={handleNavigateToDetails}
      />
    );

  const priceDisplayValues = React.useMemo(() => {
    // no coin data has been fetched yet
    if (aptosCoin === null || aptosCoin === undefined) {
      return {};
    }

    const quantityDisplay = getQuantityDisplay(aptosCoin);

    // coin data has been fetched, but no coinGecko price info has been fetched/return/exists yet
    if (aptosPriceInfo === null || aptosPriceInfo === undefined) {
      return {
        quantityDisplay,
      };
    }

    // coingecko data successully returned
    const fiatDollarValue: string = computeFiatDollarValue(
      aptosPriceInfo.currentPrice,
      aptosCoin,
      aptosCoin?.balance ?? 0,
    );

    return {
      fiatDollarValue,
      percentChange: aptosPriceInfo?.percentChange,
      quantityDisplay,
    };
  }, [activeAccountAddress, aptosCoin, aptosPriceInfo]);

  let aptHeroValue: string;
  if (aptDisplayByAccount === undefined || activeAccountAddress === undefined) {
    aptHeroValue = '0';
  } else {
    aptHeroValue = heroAptQuantity(
      aptDisplayByAccount[activeAccountAddress],
      aptosCoin?.quantityDisplay ?? '0',
    );
  }

  return {
    allCoins,
    allCoinsLogoHash,
    aptHeroValue,
    aptosCoin: { ...aptosCoin, ...priceDisplayValues },
    handleRenderCoin,
    hasAptosCoin: !!aptosCoin,
    isLoading,
    totalCoins: allCoins.length,
  };
}
