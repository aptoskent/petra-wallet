// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import createHmac from 'create-hmac';
import url from 'url';
import { generateOnRampURL } from '@coinbase/cbpay-js';

export enum RequestErr {
  MISSING_REQUIRED_PARAMS = 'All required request params not found',
  WRONG_API_KEY = 'Wrong API Key was passed in request',
}

export interface Env {
  MOONPAY_API_KEY: string;
  MOONPAY_SECRET_KEY: string;
  BUY_URL: string;
  COINBASE_APP_ID: string;
}

export const defaultCurrencyCode = 'apt';
interface DeriveUrlParams {
  apiKey: string;
  baseUrl?: string;
  currencyCode: string;
  env: Env;
  walletAddress: string;
}

interface DeriveCoinbaeUrlParams {
  apiKey: string;
  env: Env;
  walletAddress: string;
}

const deriveMoonpayUrl = ({
  walletAddress,
  apiKey,
  env,
  baseUrl = env.BUY_URL,
  currencyCode = defaultCurrencyCode,
}: DeriveUrlParams) => {
  const searchParamsDict: Record<string, string> = {
    apiKey,
    currencyCode,
    walletAddress,
  };
  const resUrl = new URL(baseUrl);
  let searchParams = new URLSearchParams(searchParamsDict);
  resUrl.search = searchParams.toString();
  const signature = createHmac('sha256', env.MOONPAY_SECRET_KEY)
    .update(resUrl.search)
    .digest('base64');

  searchParamsDict.signature = signature;
  searchParams = new URLSearchParams(searchParamsDict);
  resUrl.search = searchParams.toString();
  return resUrl.toString();
};

const deriveCoinbaseUrl = ({ walletAddress, env }: DeriveCoinbaeUrlParams) => {
  const onRampURL = generateOnRampURL({
    appId: env.COINBASE_APP_ID,
    destinationWallets: [
      { address: walletAddress, blockchains: ['aptos'], assets: ['APT'] },
    ],
  });

  return onRampURL;
};

const parseRequestParams = (requestUrl: string, env: Env) => {
  const queryObj = url.parse(requestUrl, true).query;
  if (queryObj.walletAddress && queryObj.apiKey) {
    if (queryObj.apiKey === env.MOONPAY_API_KEY) {
      return queryObj as unknown as DeriveUrlParams;
    }
    throw new Error(RequestErr.WRONG_API_KEY);
  }
  throw new Error(RequestErr.MISSING_REQUIRED_PARAMS);
};

export const handleRequestCore = (requestUrl: string, env: Env) => {
  const requestQueryParams = parseRequestParams(requestUrl, env);
  const moonpayUrl = deriveMoonpayUrl({ ...requestQueryParams, env });
  const coinbaseUrl = deriveCoinbaseUrl({ ...requestQueryParams, env });
  return {
    moonpayUrl,
    coinbaseUrl,
  };
};

/* istanbul ignore next */
async function handleRequest(request: Request, env: Env) {
  const response = new Response(
    JSON.stringify(handleRequestCore(request.url, env)),
  );
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET');
  return response;
}

/* istanbul ignore next */
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    return handleRequest(request, env);
  },
};
