// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type { TokenTypes } from 'aptos';
import { useQuery, UseQueryOptions } from 'react-query';
import type { TokenData } from '../types';
import useRestApi from '../hooks/useRestApi';

const tokenDataQueryKeys = {
  getTokenDataWithCachedRestApi: 'getTokenDataWithCachedRestApi',
};

interface UseTokenDataCachedRestApiQueryKeyProps {
  tokenDataId: TokenTypes.TokenDataId;
}

export const useTokenDataWithCachedRestApiQueryKey = ({
  tokenDataId,
}: UseTokenDataCachedRestApiQueryKeyProps) => [
  tokenDataQueryKeys.getTokenDataWithCachedRestApi,
  tokenDataId.collection,
  tokenDataId.creator,
  tokenDataId.name,
];

export const useTokenDataCachedRestApi = (
  tokenDataId: TokenTypes.TokenDataId,
  options?: UseQueryOptions<TokenData>,
) => {
  const { getTokenData } = useRestApi();

  return useQuery<TokenData>(
    useTokenDataWithCachedRestApiQueryKey({ tokenDataId }),
    async (): Promise<TokenData> =>
      getTokenData(
        tokenDataId.creator,
        tokenDataId.collection,
        tokenDataId.name,
      ),
    {
      ...options,
      enabled: options?.enabled,
    },
  );
};
