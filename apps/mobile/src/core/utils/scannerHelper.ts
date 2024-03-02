// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export type QrDataProps = {
  address: string;
  amount?: string;
  sym?: string;
};

export const getUrlParamsFromPath = (path: string) => {
  const url = new URL(path);
  const params = new Map<string, string>();
  url.searchParams.forEach((value, key) => {
    params.set(key, value);
  });
  return { params, url };
};

export const getRecieveParams = (
  qrExtractedData: Map<string, string>,
): QrDataProps => {
  const address = qrExtractedData.get('address') ?? '';
  const amount = qrExtractedData.get('amount');
  const sym = qrExtractedData.get('sym');
  return { address, amount, sym };
};

export const isQrCodeValid = (path: string): boolean => path.includes('petra');
