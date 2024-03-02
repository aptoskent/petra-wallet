// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { getTokenMetadata as queryTokenMetadata } from '../utils/token';
import { TokenData } from '../types';
import { useTokenMetadata } from '../queries/useTokenMetadata';

export enum StorageProvider {
  Arweave = 'Arweave',
  Generic = 'storage provider',
  IPFS = 'IPFS',
}

export const getStorageProviderFromURI = (uri: string) => {
  if (uri.includes('arweave.net')) {
    return StorageProvider.Arweave;
  }
  if (uri.includes('ipfs.io')) {
    return StorageProvider.IPFS;
  }
  return StorageProvider.Generic;
};

interface UseStorageProviderReturn {
  collectionImgSrc: string | undefined;
  provider: StorageProvider;
  tokenImgSrc: string | undefined;
}

export default function useTokenStorageProvider(
  token: TokenData,
): UseStorageProviderReturn {
  const { data: tokenMetadata } = useTokenMetadata(token);
  const [collectionImageSrc, setCollectionImageSrc] = useState<
    string | undefined
  >();

  useEffect(() => {
    Promise.all([
      queryTokenMetadata(
        token.collectionData?.collectionName || '',
        token.collectionData?.metadataUri || '',
      ),
      queryTokenMetadata(token.name, token?.metadataUri || ''),
    ]).then(([{ image: collectionImage }, { image: tokenImage }]) => {
      setCollectionImageSrc(collectionImage || tokenImage);
    });
  }, [token]);

  return {
    collectionImgSrc: collectionImageSrc,
    provider: getStorageProviderFromURI(token.metadataUri),
    tokenImgSrc: tokenMetadata?.animation_url || tokenMetadata?.image,
  };
}
