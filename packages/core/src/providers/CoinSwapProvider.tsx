// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Outlet } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import type { AggregatorTypes } from '@manahippo/hippo-sdk';
import { type RawCoinInfo } from '@manahippo/coin-list';
import {
  aptStructType,
  usdcStructType,
  defaultSlippage,
  defaultTokenAmount,
} from '../hooks/constants';
import useCoinResources from '../queries/useCoinResources';
import useCoinsListDict from '../hooks/useCoinListDict';

interface FormProps {
  currencyFrom: {
    amount?: string;
    balance: number | bigint;
    isInvalid?: boolean;
    isUserEntered?: boolean;
    token: RawCoinInfo;
  };
  currencyTo: {
    amount?: string;
    balance: number | bigint;
    isInvalid?: boolean;
    isUserEntered?: boolean;
    token: RawCoinInfo;
  };
  isFixedOutput: boolean;
  routeQuoteSelected: AggregatorTypes.IApiRouteAndQuote | null;
  selectedSlippage: string;
}

interface CoinSwapProviderProps {
  children: React.ReactNode; // for testing
}

function CoinSwapProvider({ children }: CoinSwapProviderProps) {
  const coinListDict = useCoinsListDict() as Record<string, any>;
  const aptCoin = coinListDict?.[aptStructType];
  const { coinsHash: coinsResourceHash } = useCoinResources();
  const usdcCoin = coinListDict?.[usdcStructType];
  const fromTokenBalance = coinsResourceHash.get(
    aptCoin?.token_type.type,
  )?.balance;
  const toTokenBalance = coinsResourceHash.get(
    usdcCoin?.token_type.type,
  )?.balance;

  const form = useForm<FormProps>({
    defaultValues: {
      currencyFrom: {
        amount: defaultTokenAmount?.toString(),
        balance: fromTokenBalance,
        isInvalid: false,
        isUserEntered: false,
        token: aptCoin,
      },
      currencyTo: {
        amount: String(defaultTokenAmount),
        balance: toTokenBalance,
        isInvalid: false,
        isUserEntered: false,
        token: usdcCoin,
      },
      isFixedOutput: false,
      routeQuoteSelected: null,
      selectedSlippage: defaultSlippage?.toString(),
    },
  });

  return (
    <FormProvider {...form}>
      {children}
      <Outlet />
    </FormProvider>
  );
}

export default CoinSwapProvider;
