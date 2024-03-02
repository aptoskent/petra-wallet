// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useNetworks } from '@petra/core/hooks/useNetworks';
import { useWebRestApi } from '@petra/core/hooks/useWebRestApi';
import { RestApi } from '@petra/core/hooks/useRestApi';
import { Event } from '@petra/core/types/event';
import { CoinInfoData } from '@petra/core/types/resource';
import { getTokenDataIdHash } from '@petra/core/utils/token';
import { AptosName } from '@petra/core/utils/names';
import { getServerTime, getServerDate } from '@petra/core/utils/server-time';
import { Types } from 'aptos';
import getNetworkCacheDbConnection, {
  CachedPendingTransaction,
  SdkTransaction,
} from '../cache/networkCacheDb';

const nameCacheDurationInMilliseconds = 5 * 60000;
const tokenCacheDurationInMilliseconds = 60000;
const tokenMetadataCacheDurationInMilliseconds = 60000;

function isExpired(timestamp: Date | undefined, ttl: number) {
  return timestamp === undefined || getServerTime() > timestamp.getTime() + ttl;
}

export function useCachedRestApi(): RestApi {
  const { aptosClient } = useNetworks();
  const restApi = useWebRestApi();

  /**
   * Get info for the specified coin type.
   * If not available in cache, the value is fetched using the active AptosClient
   * and added to the cache.
   * @param coinType
   */
  const getCoinInfo = async (coinType: string) => {
    const conn = await getNetworkCacheDbConnection(aptosClient);
    const cachedCoinInfo = (await conn.get('coins', coinType)) as CoinInfoData;
    if (cachedCoinInfo !== undefined) {
      return cachedCoinInfo;
    }

    const coinInfo = await restApi.getCoinInfo(coinType);
    if (coinInfo !== undefined) {
      await conn.put('coins', coinInfo, coinType);
    }
    return coinInfo;
  };

  /**
   * Get transaction by version.
   * If not available in cache, the value is fetched using the active AptosClient
   * and added to the cache.
   * @param version
   */
  const getTransaction = async (version: number) => {
    const conn = await getNetworkCacheDbConnection(aptosClient);
    const cachedTxn = await conn.get('transactions', version);
    if (cachedTxn !== undefined) {
      return cachedTxn as SdkTransaction;
    }

    const txn = await restApi.getTransaction(version);
    await conn.put('transactions', txn, version);
    return txn;
  };

  const addPendingTxn = async (txn: Types.PendingTransaction) => {
    const conn = await getNetworkCacheDbConnection(aptosClient);
    const timestamp = getServerTime();

    const normalized: Types.PendingTransaction = JSON.parse(
      JSON.stringify(txn),
    );

    await conn.put('pendingTransactions', {
      ...normalized,
      timestamp,
      type: 'pending_transaction',
    });
  };

  const getPendingTxns = async (
    address: string,
    from?: number,
    to?: number,
  ) => {
    const conn = await getNetworkCacheDbConnection(aptosClient);
    const upperBound = to !== undefined && from !== undefined && to !== from;
    const query = IDBKeyRange.bound(
      [address, from ?? 0],
      [address, to ?? Infinity],
      false,
      upperBound,
    );

    const prevPendingTxns = await conn.getAllFromIndex(
      'pendingTransactions',
      'byTimestamp',
      query,
    );

    const currPendingTxns: CachedPendingTransaction[] = [];
    await Promise.all(
      prevPendingTxns.map(async (pendingTxn) => {
        const expirationTimestamp =
          Number(pendingTxn.expiration_timestamp_secs) * 1000;
        const shouldCheck = pendingTxn.timestamp < expirationTimestamp;
        if (shouldCheck) {
          await aptosClient
            .getTransactionByHash(pendingTxn.hash)
            .catch(() => pendingTxn)
            .then(async ({ type }) => {
              if (type !== 'pending_transaction') {
                await conn.delete('pendingTransactions', pendingTxn.hash);
              } else {
                const newTimestamp = Math.min(
                  getServerTime(),
                  expirationTimestamp,
                );
                const newPendingTxn = {
                  ...pendingTxn,
                  timestamp: newTimestamp,
                };
                await conn.put('pendingTransactions', newPendingTxn);
                currPendingTxns.push(newPendingTxn);
              }
            });
        } else {
          currPendingTxns.push(pendingTxn);
        }
      }),
    );

    return currPendingTxns;
  };

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
    const conn = await getNetworkCacheDbConnection(aptosClient);

    // For now this is using cached values only for perfect matches
    // can be optimized
    const query = IDBKeyRange.bound(
      [address, creationNumber, start],
      [address, creationNumber, start + limit],
      false,
      true,
    );

    const cachedEvents = (
      await conn.getAllFromIndex('events', 'byEventKey', query)
    ).reverse();
    if (cachedEvents.length === limit) {
      return cachedEvents as Event[];
    }

    const nAvailable =
      cachedEvents.length > 0
        ? cachedEvents.findIndex(
            (e, i) => e.sequenceNumber !== start + limit - i - 1,
          )
        : 0;
    const adjustedLimit = limit - nAvailable;

    const newEvents = await restApi.getEvents(
      address,
      creationNumber,
      start,
      adjustedLimit,
    );

    const dbTxn = conn.transaction('events', 'readwrite');
    await Promise.all(
      newEvents.map(async (event) => {
        const key = `${address}_${creationNumber}_${event.sequenceNumber}`;
        await dbTxn.store.put(event, key);
      }),
    );
    await dbTxn.done;

    return [...cachedEvents.slice(0, nAvailable), ...newEvents];
  };

  const getAddressFromName = async (name: AptosName) => {
    const conn = await getNetworkCacheDbConnection(aptosClient);
    const cachedResult = await conn.get('names', name.noSuffix());
    if (
      cachedResult &&
      !isExpired(cachedResult.updatedAt, nameCacheDurationInMilliseconds)
    ) {
      return cachedResult.address;
    }

    const newAddress = await restApi.getAddressFromName(name);
    if (newAddress !== undefined) {
      await conn.put('names', {
        address: newAddress,
        name: name.noSuffix(),
        updatedAt: getServerDate(),
      });
    }

    return newAddress;
  };

  const getNameFromAddress = async (address: string) => {
    const conn = await getNetworkCacheDbConnection(aptosClient);
    const cachedResult = await conn.get('accounts', address);
    if (
      cachedResult &&
      !isExpired(cachedResult.updatedAt, nameCacheDurationInMilliseconds)
    ) {
      return cachedResult.name ? new AptosName(cachedResult.name) : undefined;
    }

    const newName = await restApi.getNameFromAddress(address);
    await conn.put('accounts', {
      address,
      name: newName?.noSuffix(),
      updatedAt: getServerDate(),
    });
    return newName;
  };

  const getTokenData = async (
    creator: string,
    collection: string,
    name: string,
  ) => {
    const conn = await getNetworkCacheDbConnection(aptosClient);
    const idHash = await getTokenDataIdHash({ collection, creator, name });
    const cachedResult = await conn.get('tokenData', idHash);
    if (
      cachedResult &&
      !isExpired(cachedResult.updatedAt, tokenCacheDurationInMilliseconds)
    ) {
      return cachedResult;
    }

    const tokenData = await restApi.getTokenData(creator, collection, name);
    await conn.put(
      'tokenData',
      { ...tokenData, updatedAt: getServerDate() },
      idHash,
    );
    return tokenData;
  };

  const getTokenMetadata = async (name: string, metadataUri: string) => {
    const conn = await getNetworkCacheDbConnection(aptosClient);
    const cachedResult = await conn.get('tokenMetadata', metadataUri);
    if (
      cachedResult &&
      !isExpired(
        cachedResult.updatedAt,
        tokenMetadataCacheDurationInMilliseconds,
      )
    ) {
      return cachedResult;
    }

    const metadata = await restApi.getTokenMetadata(name, metadataUri);
    await conn.put(
      'tokenMetadata',
      { ...metadata, updatedAt: getServerDate() },
      metadataUri,
    );
    return metadata;
  };

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

export default useCachedRestApi;
