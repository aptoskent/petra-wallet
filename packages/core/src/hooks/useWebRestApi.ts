// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Types } from 'aptos';
import { useNetworks } from './useNetworks';
import { useFetchAccountResource } from '../queries/useAccountResources';
import { TokenData } from '../types/token';
import {
  CoinInfoData,
  CoinInfoResource,
  Event,
  EventWithVersion,
} from '../types';
import {
  getTokenDataIdHash,
  getTokenMetadata as queryTokenMetadata,
} from '../utils/token';
import {
  AptosName,
  getAddressFromName as queryAddressFromName,
  getNameFromAddress as queryNameFromAddress,
} from '../utils/names';
import { RestApi } from './useRestApi';
import { useCoinListDict } from './useCoinListDict';
import { makeCoinInfoStructTag } from '../constants';

export type SdkTransaction =
  | Types.Transaction_UserTransaction
  | Types.Transaction_PendingTransaction;
export type SdkPendingTransaction = Types.Transaction_PendingTransaction;

export type CachedPendingTransaction = SdkPendingTransaction & {
  timestamp: number;
};

function parseRawEvent(event: EventWithVersion) {
  return {
    data: event.data,
    guid: {
      address: event.guid.account_address,
      creationNumber: Number(event.guid.creation_number),
    },
    sequenceNumber: Number(event.sequence_number),
    type: event.type,
    version: Number(event.version),
  } as Event;
}

/**
 * Reuse pending requests instead of running multiple identical queries
 * @param query the query function
 */
function shareRequests<TParam extends string | number, TResult>(
  query: (param: TParam) => Promise<TResult>,
) {
  const pendingRequests: { [key: string]: Promise<TResult> } = {};
  return async (param: TParam) => {
    if (param in pendingRequests) {
      return pendingRequests[param] as Promise<TResult>;
    }
    const pendingRequest = query(param);
    pendingRequests[param] = pendingRequest;
    const result = await pendingRequest;
    delete pendingRequests[param];
    return result;
  };
}

export function useWebRestApi(): RestApi {
  const { activeNetworkName, aptosClient, tokenClient } = useNetworks();
  const fetchAccountResource = useFetchAccountResource();
  const { coinListDict } = useCoinListDict();

  /**
   * Certain coins have duplicate names / symbols
   * This makes it very confusing for consumers to differentiate
   * The most common example is USDC, which has many variations
   * For now we are using offchain data to modify the name / symbol for USDC coins
   * @param coinType
   */
  const prettifyCoinInfo = (coinInfo: CoinInfoData) => {
    const prettyInfo = coinInfo;
    if (coinInfo.symbol === 'USDC') {
      const offChainCoinInfo = coinListDict[coinInfo.type];
      prettyInfo.name = offChainCoinInfo.name;
      prettyInfo.symbol = offChainCoinInfo.symbol;
    }
    return prettyInfo;
  };

  /**
   * Get info for the specified coin type.
   * If not available in cache, the value is fetched using the active AptosClient
   * and added to the cache.
   * @param coinType
   */
  const getCoinInfo = async (coinType: string) => {
    const coinAddress = coinType.split('::')[0];
    const coinInfoResourceType = makeCoinInfoStructTag(coinType) as any;
    const coinInfoResource = (await fetchAccountResource(
      coinAddress,
      coinInfoResourceType,
    )) as CoinInfoResource | undefined;
    if (coinInfoResource === undefined) {
      return undefined;
    }

    const coinInfo = coinInfoResource.data;
    coinInfo.type = coinType;
    delete coinInfo.supply;
    return prettifyCoinInfo(coinInfo) as CoinInfoData;
  };

  /**
   * Get transaction by version.
   * If not available in cache, the value is fetched using the active AptosClient
   * and added to the cache.
   * @param version
   */
  const getTransaction = shareRequests(
    async (version: number) =>
      (await aptosClient.getTransactionByVersion(version)) as SdkTransaction,
  );

  /**
   * Get events for a specific event key and range.
   * The event key is defined by [address, creationNumber].
   * @param address address of resource owner account
   * @param creationNumber creation number of the event table
   * @param start creation number from where to start querying events
   * @param limit number of events to query. Needs to be strictly greater than 0
   */
  const getEvents = async (
    address: string,
    creationNumber: number,
    start: number,
    limit: number,
  ) => {
    const rawEvents = (
      await aptosClient.getEventsByCreationNumber(address, creationNumber, {
        limit,
        start,
      })
    ).reverse() as EventWithVersion[];
    return rawEvents.map((e) => parseRawEvent(e));
  };

  const getAddressFromName = async (name: AptosName) =>
    queryAddressFromName(name, activeNetworkName);

  const getNameFromAddress = shareRequests(async (address: string) =>
    queryNameFromAddress(address, activeNetworkName),
  );

  const getTokenData = async (
    creator: string,
    collection: string,
    name: string,
  ) => {
    const idHash = await getTokenDataIdHash({ collection, creator, name });
    const { description, uri } = await tokenClient.getTokenData(
      creator,
      collection,
      name,
    );
    const tokenData: TokenData = {
      collection,
      creator,
      description,
      idHash,
      // Node queries don't support getting v2 soulbound nfts
      isSoulbound: false,
      metadataUri: uri,
      name,
      // Node queries don't support getting v2
      tokenStandard: 'v1',
    };
    return tokenData;
  };

  const getTokenMetadata = async (name: string, metadataUri: string) =>
    queryTokenMetadata(name, metadataUri);

  const addPendingTxn = async () => {};
  const getPendingTxns = async (): Promise<CachedPendingTransaction[]> => [];

  return {
    addPendingTxn,
    getAddressFromName,
    getCoinInfo,
    getEvents,
    getNameFromAddress,
    getPendingTxns,
    getTokenData,
    getTokenMetadata,
    getTransaction,
  };
}

export default useWebRestApi;
