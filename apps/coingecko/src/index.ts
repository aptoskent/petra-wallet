// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import type { CoingeckoResponseType } from './coinsIdResponse';

export interface GetCurrentCoingeckoDataParams {
  community_data?: boolean;
  developer_data?: boolean;
  market_data?: boolean;
  sparkline?: boolean;
  ticker?: string;
  tickers?: boolean;
}

export const getCurrentCoingeckoData = async ({
  community_data = true,
  developer_data = true,
  market_data = true,
  sparkline = true,
  ticker = 'aptos',
  tickers = true,
}: GetCurrentCoingeckoDataParams) => {
  const coingeckoUrl = `https://api.coingecko.com/api/v3/coins/${ticker}?tickers=${tickers}&market_data=${market_data}&community_data=${community_data}&developer_data=${developer_data}&sparkline=${sparkline}`;
  const response = await fetch(coingeckoUrl, {
    cf: {
      // Always cache this fetch for 4 minutes before revalidating
      cacheEverything: true,
      cacheTtlByStatus: {
        200: 60 * 4,
      },
    },
  });
  const data: CoingeckoResponseType = await response.json();
  return data;
};

interface GetCurrentPriceParams {
  currency_code?: keyof CoingeckoResponseType['market_data']['current_price'];
}

export const getCurrentPrice = async ({
  currency_code = 'usd',
}: GetCurrentPriceParams) => {
  const data = await getCurrentCoingeckoData({});
  const currPrice = data.market_data.current_price[currency_code];
  return currPrice;
};

interface GetHomeInformationParams {
  currency_code?: keyof CoingeckoResponseType['market_data']['current_price'];
}

export const getHomeInformation = async ({
  currency_code = 'usd',
}: GetHomeInformationParams) => {
  const data = await getCurrentCoingeckoData({});
  const { image, market_data: marketData, symbol } = data;
  const currPrice = marketData.current_price[currency_code];
  const twentyFourHourChange =
    marketData.price_change_percentage_24h_in_currency[currency_code];

  return {
    image,
    price: currPrice,
    price_change_percent_24hr: twentyFourHourChange,
    symbol,
  };
};

export enum WorkerURLPaths {
  CURRENT_DATA = '/current_data',
  DEFAULT = '/',
  HOME_DATA = '/home_data',
  PRICE = '/price',
}

export const handleRequestCore = async (requestUrl: string) => {
  const { pathname, searchParams } = new URL(requestUrl);

  switch (pathname) {
    case WorkerURLPaths.DEFAULT:
    case WorkerURLPaths.PRICE: {
      const currencyCode = searchParams.get(
        'currency_code',
      ) as GetCurrentPriceParams['currency_code'];
      const price = await getCurrentPrice({
        currency_code: currencyCode ?? 'usd',
      });
      return new Response(JSON.stringify({ price }), { status: 200 });
    }
    case WorkerURLPaths.HOME_DATA: {
      const currencyCode = searchParams.get(
        'currency_code',
      ) as GetHomeInformationParams['currency_code'];
      const data = await getHomeInformation({
        currency_code: currencyCode ?? 'usd',
      });
      return new Response(JSON.stringify(data), { status: 200 });
    }
    case WorkerURLPaths.CURRENT_DATA: {
      const data = await getCurrentCoingeckoData({});
      return new Response(JSON.stringify(data), { status: 200 });
    }
    default: {
      return new Response(null, { status: 404 });
    }
  }
};

async function handleRequest(request: Request) {
  const response = await handleRequestCore(request.url);
  response.headers.set('Cache-Control', `max-age=${60 * 4}`);
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  return response;
}

export default {
  async fetch(
    request: Request,
    // env: Env,
    // ctx: ExecutionContext,
  ): Promise<Response> {
    return handleRequest(request);
  },
};
