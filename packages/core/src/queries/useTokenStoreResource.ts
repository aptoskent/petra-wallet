// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQuery, UseQueryOptions } from 'react-query';
import { useActiveAccount } from '../hooks/useAccounts';
import { tokenStoreStructTag } from '../constants';
import { TokenStoreResource } from '../types';
import { useFetchAccountResource } from './useAccountResources';

export const getTokenStoreResourceQueryKey = (activeAccountAddress: string) => [
  'getTokenStoreResource',
  activeAccountAddress,
];

const useTokenStoreResource = (
  options?: UseQueryOptions<TokenStoreResource | undefined>,
) => {
  const { activeAccountAddress } = useActiveAccount();
  const fetchResource = useFetchAccountResource();

  return useQuery<TokenStoreResource | undefined>(
    getTokenStoreResourceQueryKey(activeAccountAddress),
    () => fetchResource(activeAccountAddress, tokenStoreStructTag),
    {
      retry: 0,
      ...options,
    },
  );
};

export default useTokenStoreResource;
