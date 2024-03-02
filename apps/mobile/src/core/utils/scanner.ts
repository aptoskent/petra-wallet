// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line import/no-extraneous-dependencies
import { useAccountCoinResources } from 'pages/Send/hooks/useAccountCoinResources';
import { CoinInfoData } from '@petra/core/types';
import { RootAuthenticatedStackParamList } from 'navigation/types';
import { APTOS_COIN_INFO } from 'shared/constants';
import { QrDataProps } from './scannerHelper';

export const encodeQRCode = (
  accountAddress: string,
  coinSym?: string,
  amount?: string,
): string => {
  let urlBase = `https://petra.app/receive?address=${accountAddress}`;

  if (amount) {
    if (coinSym) {
      urlBase += '&sym=APT';
    }
    urlBase += `&amount=${amount}`;
  } else if (coinSym) {
    urlBase += `&sym=${coinSym}`;
  }
  return urlBase.toLocaleUpperCase();
};

export enum ScannerRouteName {
  'SendFlow1' = 'SendFlow1',
  'SendFlow2' = 'SendFlow2',
  'SendFlow3' = 'SendFlow3',
  'SendFlow4' = 'SendFlow4',
}

export type ScannerRouteNameAndParamsProps =
  | [
      ScannerRouteName.SendFlow1,
      RootAuthenticatedStackParamList[ScannerRouteName.SendFlow1],
    ]
  | [
      ScannerRouteName.SendFlow2,
      RootAuthenticatedStackParamList[ScannerRouteName.SendFlow2],
    ]
  | [
      ScannerRouteName.SendFlow3,
      RootAuthenticatedStackParamList[ScannerRouteName.SendFlow3],
    ]
  | [
      ScannerRouteName.SendFlow4,
      RootAuthenticatedStackParamList[ScannerRouteName.SendFlow4],
    ];

export const useScanner = () => {
  const useRedirectWithQRData = (
    qrExtractedData: QrDataProps,
  ): ScannerRouteNameAndParamsProps => {
    const { address, amount, sym } = qrExtractedData;
    const coinResources = useAccountCoinResources(address).data;
    const coinInfo: CoinInfoData =
      (coinResources || []).find(
        (coinResource) => coinResource.info.symbol === sym?.toUpperCase(),
      )?.info || APTOS_COIN_INFO;

    if (amount || sym) {
      if (address && amount) {
        return [
          ScannerRouteName.SendFlow4,
          { amount, coinInfo, contact: { address } },
        ];
      }
      if (address) {
        return [ScannerRouteName.SendFlow3, { coinInfo, contact: { address } }];
      }
    }
    if (address) {
      return [ScannerRouteName.SendFlow2, { contact: { address } }];
    }
    return [ScannerRouteName.SendFlow1, undefined];
  };

  return {
    encodeQRCode,
    useRedirectWithQRData,
  };
};
