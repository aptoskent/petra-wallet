// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { UseQueryOptions } from 'react-query';
import { RawCoinInfo } from '@manahippo/coin-list';
import type { AggregatorTypes } from '@manahippo/hippo-sdk';
import { defaultSlippage } from './constants';
import useHippoRefreshQuotesQuery from '../queries/useHippoRefreshQuotesQuery';
import coinFormatter from '../utils/coinFormatter';
import {
  HippoRefreshQuotes,
  useHippoRefreshQuotes,
} from './useHippoRefreshQuotes';

export type MaxSteps = 1 | 2 | 3;

export interface RefreshRoutesConfig {
  allowHighGas: boolean;
  fromAmount?: number;
  fromToken?: RawCoinInfo | null;
  isFixedOutput: boolean;
  isPriceYToX?: boolean;
  isReload: boolean;
  maxSteps: MaxSteps;
  routeQuoteSelected?: AggregatorTypes.IApiRouteAndQuote;
  toAmount?: number;
  toToken?: RawCoinInfo | null;
}

interface ExtraConfig {
  slippage: number;
}

export const useHippoQuotes = (
  config: RefreshRoutesConfig,
  options?: UseQueryOptions<HippoRefreshQuotes>,
  extraConfig?: ExtraConfig,
) => {
  const { data, ...rest } = useHippoRefreshQuotesQuery(config, options);

  const slippage = extraConfig?.slippage || defaultSlippage;
  const { fromToken, isPriceYToX, toToken } = config;

  const isLoadingRoutes =
    data?.hasRoutes === true && data?.allRoutesCount === 0;

  const bestRouteQuote = useMemo(() => {
    if (!data) return null;
    return data.routes?.[0];
  }, [data]);

  const selected = config.routeQuoteSelected || bestRouteQuote;

  const priceImpact = useMemo(() => {
    if (!selected) return null;

    return Math.abs(selected.quote.priceImpact || 0);
  }, [selected]);

  const priceImpactText = useMemo(() => {
    if (!priceImpact) return '-';

    return priceImpact >= 0.0001
      ? `${(priceImpact * 100).toFixed(2)}%`
      : '<0.01%';
  }, [priceImpact]);

  const minimumReceived = useMemo(() => {
    if (!selected || !config.toToken) return null;

    return `${coinFormatter(
      selected.quote.outputUiAmt * (1 - slippage / 100),
      config.toToken,
    )} ${config.toToken.symbol}`;
  }, [selected, config.toToken, slippage]);

  const avgPrice = useMemo(() => {
    if (!selected) return null;

    return selected.quote.outputUiAmt / selected.quote.inputUiAmt;
  }, [selected]);

  const rate = useMemo(() => {
    if (!avgPrice || avgPrice === Infinity) return 'n/a';

    return isPriceYToX
      ? `1 ${fromToken?.symbol} ≈ ${coinFormatter(avgPrice, toToken)} ${
          toToken?.symbol
        }`
      : `1 ${toToken?.symbol} ≈ ${coinFormatter(1 / avgPrice, fromToken)} ${
          fromToken?.symbol
        }`;
  }, [avgPrice, fromToken, isPriceYToX, toToken]);

  const output = useMemo(() => {
    if (!selected || !config.toToken) return null;

    return `${coinFormatter(selected.quote.outputUiAmt, config.toToken)} ${
      config.toToken?.symbol
    }`;
  }, [selected, config.toToken]);

  return {
    data: {
      ...data,
      bestRouteQuote,
      isLoadingRoutes,
      minimumReceived,
      output,
      priceImpact,
      priceImpactText,
      rate,
    },
    ...rest,
  };
};

export default useHippoRefreshQuotes;
