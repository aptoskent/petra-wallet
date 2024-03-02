// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Types } from 'aptos';
import { createContext, useContext } from 'react';
import { CoinInfoData, Event, MetadataJson, TokenData } from '../types';
import { AptosName } from '../utils/names';

export const RestApiContext = createContext<RestApi | undefined>(undefined);
RestApiContext.displayName = 'RestApiContext';

export type SdkTransaction =
  | Types.Transaction_UserTransaction
  | Types.Transaction_PendingTransaction;
export type SdkPendingTransaction = Types.Transaction_PendingTransaction;

export type CachedPendingTransaction = SdkPendingTransaction & {
  timestamp: number;
};

export interface RestApi {
  addPendingTxn(txn: Types.PendingTransaction): Promise<void>;

  getAddressFromName(name: AptosName): Promise<string | undefined>;

  getCoinInfo(coinType: string): Promise<CoinInfoData | undefined>;

  getEvents(
    address: string,
    creationNumber: number,
    start: number,
    limit: number,
  ): Promise<Event[]>;

  getNameFromAddress(address: string): Promise<AptosName | undefined>;

  getPendingTxns(
    address: string,
    from?: number,
    to?: number,
  ): Promise<CachedPendingTransaction[]>;

  getTokenData(
    creator: string,
    collection: string,
    name: string,
  ): Promise<TokenData>;

  getTokenMetadata(name: string, metadataUri: string): Promise<MetadataJson>;

  getTransaction(version: number): Promise<SdkTransaction>;
}

export default function useRestApi() {
  const restApi = useContext(RestApiContext);
  if (restApi === undefined) {
    throw new Error('No RestApiContext was provided');
  }
  return restApi;
}
