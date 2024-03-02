// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQuery, UseQueryOptions } from 'react-query';
import axios from 'axios';

const apiKey = process.env.REACT_APP_MOONPAY_API_KEY;

interface BuyProviderUrlResponse {
  coinbaseUrl: string | undefined;
  moonpayUrl: string | undefined;
}

export interface BuyProviderOptions {
  buttonText: string;
  infoText: string;
  providerName: string;
}

export async function getBuyProviderUrl(
  address: string,
): Promise<BuyProviderUrlResponse> {
  try {
    const requestUrl = `https://buy-production.petra-wallet.workers.dev/?walletAddress=${address}&apiKey=${apiKey}`;
    const response = await axios.get<BuyProviderUrlResponse>(requestUrl);

    return response.data;
  } catch {
    return {
      coinbaseUrl: undefined,
      moonpayUrl: undefined,
    };
  }
}

export default function useBuyProviderUrl(
  address: string,
  trackError: () => void,
  trackSuccess: () => void,
  options?: UseQueryOptions<BuyProviderUrlResponse>,
) {
  return useQuery<BuyProviderUrlResponse>(
    [address],
    async () => getBuyProviderUrl(address),
    { retry: 0, ...options },
  );
}
