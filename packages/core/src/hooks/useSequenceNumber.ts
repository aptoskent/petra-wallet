// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQueryClient } from 'react-query';
import { getSequenceNumber } from '../queries/account';
import { useActiveAccount } from './useAccounts';
import { useNetworks } from './useNetworks';

/**
 * Query sequence number for current account,
 * which is required to BCS-encode a transaction locally.
 * The value is queried lazily the first time `get` is called, and is
 * refetched only when an error occurs, by invalidating the cache
 */
export default function useSequenceNumber() {
  const { activeAccountAddress } = useActiveAccount();
  const { aptosClient } = useNetworks();
  const queryClient = useQueryClient();

  const queryKey = ['getSequenceNumber', activeAccountAddress];

  const fetchSeqNumber = async () =>
    queryClient.fetchQuery(
      queryKey,
      async () => {
        const sequenceNumber = await getSequenceNumber({
          address: activeAccountAddress,
          aptosClient,
        });
        return sequenceNumber;
      },
      {
        staleTime: Infinity,
      },
    );

  return {
    get: fetchSeqNumber,
    increment: async () => {
      const currSeqNumber =
        queryClient.getQueryData<bigint>(queryKey) ?? (await fetchSeqNumber());
      return queryClient.setQueryData<bigint>(
        queryKey,
        currSeqNumber + BigInt(1),
      );
    },
    invalidate: () => {
      // eslint-disable-next-line no-console
      console.warn('Invalidating sequence number');
      return queryClient.invalidateQueries(queryKey);
    },
  };
}
