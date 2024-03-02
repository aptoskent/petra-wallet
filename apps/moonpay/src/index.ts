// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import createHmac from 'create-hmac';
import url from 'url';

export enum RequestErr {
  MISSING_REQUIRED_PARAMS = 'All required request params not found',
  WRONG_API_KEY = 'Wrong API Key was passed in request',
}

export interface Env {
  MOONPAY_API_KEY: string;
  MOONPAY_SECRET_KEY: string;
  MOONPAY_URL: string;
}

export const defaultCurrencyCode = 'apt';
interface DeriveMoonpayUrlParams {
  apiKey: string;
  baseUrl?: string;
  currencyCode: string;
  env: Env;
  walletAddress: string;
}

function oldDeriveMoonpayUrl({
  walletAddress,
  env,
  apiKey,
  currencyCode = defaultCurrencyCode,
  baseUrl = env.MOONPAY_URL,
}: DeriveMoonpayUrlParams) {
  const resUrl = `${baseUrl}?apiKey=${apiKey}&currencyCode=${currencyCode}&walletAddress=${walletAddress}`;
  const signature = createHmac('sha256', env.MOONPAY_SECRET_KEY)
    .update(new URL(resUrl).search)
    .digest('base64');
  const result = `${resUrl}&signature=${encodeURIComponent(signature)}`;
  return result;
}

const deriveMoonpayUrl = ({
  walletAddress,
  apiKey,
  env,
  baseUrl = env.MOONPAY_URL,
  currencyCode = defaultCurrencyCode,
}: DeriveMoonpayUrlParams) => {
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

const parseRequestParams = (requestUrl: string, env: Env) => {
  const queryObj = url.parse(requestUrl, true).query;
  if (queryObj.walletAddress && queryObj.apiKey) {
    if (queryObj.apiKey === env.MOONPAY_API_KEY) {
      return queryObj as unknown as DeriveMoonpayUrlParams;
    }
    throw new Error(RequestErr.WRONG_API_KEY);
  }
  throw new Error(RequestErr.MISSING_REQUIRED_PARAMS);
};

export const oldHandleRequestCore = (requestUrl: string, env: Env) => {
  const requestQueryParams = parseRequestParams(requestUrl, env);
  const moonpayUrl = oldDeriveMoonpayUrl({ ...requestQueryParams, env });
  return moonpayUrl;
};

export const handleRequestCore = (requestUrl: string, env: Env) => {
  const requestQueryParams = parseRequestParams(requestUrl, env);
  const moonpayUrl = deriveMoonpayUrl({ ...requestQueryParams, env });
  return moonpayUrl;
};

/* istanbul ignore next */
async function handleRequest(request: Request, env: Env) {
  const response = new Response(handleRequestCore(request.url, env));
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  return response;
}

/* istanbul ignore next */
export default {
  async fetch(
    request: Request,
    env: Env,
    // ctx: ExecutionContext,
  ): Promise<Response> {
    return handleRequest(request, env);
  },
};
