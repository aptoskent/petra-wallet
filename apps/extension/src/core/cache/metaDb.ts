// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { DBSchema, openDB } from 'idb';

interface RestCacheDbMeta {
  chainId: number;
  dbVersion: number;
  nodeUrl: string;
}

interface MetaDbSchema extends DBSchema {
  restCacheDbs: {
    key: string;
    value: RestCacheDbMeta;
  };
}

/**
 * Opens a connection to the meta IndexedDB
 */
export default async function getMetaDb() {
  return openDB<MetaDbSchema>('meta', 1, {
    upgrade: (conn) => {
      conn.createObjectStore('restCacheDbs');
    },
  });
}
