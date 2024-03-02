// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQuery, UseQueryOptions } from 'react-query';
import { TokenData, MetadataJson } from '../types';
import useRestApi from '../hooks/useRestApi';

export const getTokenMetadataQueryKey = (metadataUri: string) => [
  'tokenMetadata',
  metadataUri,
];

export function useTokenMetadata(
  { metadataUri, name }: TokenData,
  options?: UseQueryOptions<MetadataJson>,
) {
  const { getTokenMetadata } = useRestApi();

  return useQuery<MetadataJson>(
    getTokenMetadataQueryKey(metadataUri),
    async () => getTokenMetadata(name, metadataUri),
    options,
  );
}
