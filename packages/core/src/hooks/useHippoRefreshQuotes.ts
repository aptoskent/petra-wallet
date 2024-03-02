// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import type { AggregatorTypes } from '@manahippo/hippo-sdk';
import useHippoAggregator from './useHippoAggregator';
import { type RefreshRoutesConfig } from './useHippoQuotes';

const poolReloadMinInterval = 10_000;

export type HippoRefreshQuotes = {
  allRoutesCount?: number;
  hasRoutes: Boolean;
  routes?: AggregatorTypes.IApiRouteAndQuote[];
};

export const useHippoRefreshQuotes = (config: RefreshRoutesConfig) => {
  const {
    allowHighGas,
    fromAmount,
    fromToken,
    isFixedOutput,
    isReload,
    maxSteps,
    toAmount,
    toToken,
  } = config;
  const { hippoAggregator } = useHippoAggregator();

  const refreshQuotes = useCallback(async (): Promise<HippoRefreshQuotes> => {
    if (!hippoAggregator || !fromToken || !toToken) return { hasRoutes: false };

    // fromToken -> toToken
    if (!isFixedOutput && fromAmount) {
      const { allRoutesCount, routes } =
        await hippoAggregator.requestQuotesViaAPI(
          fromAmount,
          fromToken,
          toToken,
          isReload,
          maxSteps,
          allowHighGas,
        );

      routes.sort((a, b) => b.quote.outputUiAmt - a.quote.outputUiAmt);

      return {
        allRoutesCount,
        hasRoutes: routes.length !== 0,
        routes,
      };
    }

    // toToken -> fromToken
    if (isFixedOutput && toAmount) {
      const routeAndQuote =
        await hippoAggregator.getQuotesWithFixedOutputWithChange(
          toAmount,
          fromToken,
          toToken,
          isReload,
          false,
          poolReloadMinInterval,
        );

      const fixedOutputRoutes = [routeAndQuote].map((r) => ({
        ...r,
        route: r?.route?.toApiTradeRoute(),
      }));

      return {
        allRoutesCount: fixedOutputRoutes.length,
        hasRoutes: fixedOutputRoutes.length !== 0,
        routes: fixedOutputRoutes as any,
      };
    }

    const hasRoutes = await hippoAggregator.api.checkRoutesAndWarmUp(
      fromToken,
      toToken,
      maxSteps,
    );

    return { hasRoutes };
  }, [
    hippoAggregator,
    fromToken,
    toToken,
    isFixedOutput,
    fromAmount,
    toAmount,
    maxSteps,
    isReload,
    allowHighGas,
  ]);

  return refreshQuotes;
};
