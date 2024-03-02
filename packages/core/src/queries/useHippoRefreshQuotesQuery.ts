// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQuery, UseQueryOptions } from 'react-query';
import { type RefreshRoutesConfig } from '../hooks/useHippoQuotes';
import { useNetworks } from '../hooks/useNetworks';
import { useActiveAccount } from '../hooks/useAccounts';
import {
  type HippoRefreshQuotes,
  useHippoRefreshQuotes,
} from '../hooks/useHippoRefreshQuotes';

const getHippoRefreshQuotesQueryKey = (
  activeNetworkName: string,
  activeAccountAddress: string,
) => ['getHippoRefreshQuotes', activeNetworkName, activeAccountAddress];

const useHippoRefreshQuotesQuery = (
  config: RefreshRoutesConfig,
  options?: UseQueryOptions<HippoRefreshQuotes>,
) => {
  const { activeNetworkName } = useNetworks();
  const { activeAccountAddress } = useActiveAccount();
  const refreshQuotes = useHippoRefreshQuotes(config);

  return useQuery<HippoRefreshQuotes>(
    getHippoRefreshQuotesQueryKey(activeNetworkName, activeAccountAddress),
    async () => refreshQuotes(),
    {
      enabled: true,
      retry: 0,
      ...options,
    },
  );
};

export default useHippoRefreshQuotesQuery;
