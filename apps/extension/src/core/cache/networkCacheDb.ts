// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosClient, Types } from 'aptos';
import { DBSchema, openDB, deleteDB } from 'idb';

import {
  Event,
  CoinInfoData,
  TokenData,
  MetadataJson,
} from '@petra/core/types';
import getMetaDb from './metaDb';

export type SdkTransaction =
  | Types.Transaction_UserTransaction
  | Types.Transaction_PendingTransaction;
export type SdkPendingTransaction = Types.Transaction_PendingTransaction;

interface CachedAccount {
  address: string;
  name?: string;
  updatedAt: Date;
}

interface CachedAptosName {
  address: string;
  name: string;
  updatedAt: Date;
}

type CachedTokenData = TokenData & {
  updatedAt: Date;
};

type CachedMetadataJson = MetadataJson & {
  updatedAt: Date;
};

export type CachedPendingTransaction = SdkPendingTransaction & {
  timestamp: number;
};

interface RestCacheDbSchema extends DBSchema {
  accounts: {
    key: string;
    value: CachedAccount;
  };
  coins: {
    key: string;
    value: CoinInfoData;
  };
  events: {
    indexes: { byEventKey: [string, number, number] };
    key: string;
    value: Event;
  };
  names: {
    key: string;
    value: CachedAptosName;
  };
  pendingTransactions: {
    indexes: { byTimestamp: [string, number] };
    key: string;
    value: CachedPendingTransaction;
  };
  tokenData: {
    key: string;
    value: CachedTokenData;
  };
  tokenMetadata: {
    key: string;
    value: CachedMetadataJson;
  };
  transactions: {
    key: number;
    value: SdkTransaction;
  };
}

/**
 * Opens a connection to the cache IndexedDB
 */
export default async function getNetworkCacheDbConnection(
  aptosClient: AptosClient,
) {
  const chainId = await aptosClient.getChainId();
  const chainKey = `${aptosClient.nodeUrl}_${chainId}`;
  const dbName = `restCache_${chainKey}`;

  const currDbVersion = 4;

  const openConnection = async () =>
    openDB<RestCacheDbSchema>(dbName, currDbVersion, {
      upgrade: async (conn, oldVersion) => {
        if (oldVersion < 1 && currDbVersion >= 1) {
          conn.createObjectStore('transactions');
          const eventsStore = conn.createObjectStore('events');
          eventsStore.createIndex('byEventKey', [
            'guid.address',
            'guid.creationNumber',
            'sequenceNumber',
          ]);
          conn.createObjectStore('coins');
        }
        if (oldVersion < 2) {
          conn.createObjectStore('accounts', { keyPath: 'address' });
          conn.createObjectStore('names', { keyPath: 'name' });
        }
        if (oldVersion < 3) {
          const pendingTxnStore = conn.createObjectStore(
            'pendingTransactions',
            { keyPath: 'hash' },
          );
          pendingTxnStore.createIndex('byTimestamp', ['sender', 'timestamp']);
        }
        if (oldVersion < 4) {
          conn.createObjectStore('tokenData');
          conn.createObjectStore('tokenMetadata');
        }

        const metaDb = await getMetaDb();
        let restCacheDbMeta = await metaDb.get('restCacheDbs', dbName);
        if (restCacheDbMeta) {
          restCacheDbMeta.dbVersion = currDbVersion;
        } else {
          restCacheDbMeta = {
            chainId,
            dbVersion: currDbVersion,
            nodeUrl: aptosClient.nodeUrl,
          };
        }
        await metaDb.put('restCacheDbs', restCacheDbMeta, dbName);
      },
    });

  try {
    return await openConnection();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'VersionError') {
      // eslint-disable-next-line no-console
      console.error('Error opening connection to REST cache DB, ');
      await deleteDB(dbName);
      return await openConnection();
    }
    throw err;
  }
}
