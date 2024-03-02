// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQueryClient } from 'react-query';
import { useActiveAccount } from '../hooks/useAccounts';
import { getTokenStoreResourceQueryKey } from '../queries/useTokenStoreResource';
import { TransactionOptions } from '../transactions';
import useTransactionSubmit from '../queries/useTransactionSubmit';

export const optInDirectTransferSimulationQueryKey =
  'optInDirectTransferSimulation';

export function buildOptInDirectTransferPayload(value: boolean) {
  return {
    arguments: [value],
    function: '0x3::token::opt_in_direct_transfer',
    type_arguments: [],
  };
}

/**
 * Mutation for the `optInToTokenDirectTransfer` flag of the active account.
 * This flag is contained under the `TokenStore` resource and
 * allows users to directly transfer a token
 * to a recipient instead of creating a token offer.
 * If the recipient has the flag set to `true`,
 * the option to choose a direct transfer will appear when attempting
 * to send them a token.
 */
export default function useOptInToTokenDirectTransfer(
  txnOptions?: TransactionOptions,
) {
  const { activeAccountAddress } = useActiveAccount();
  const queryClient = useQueryClient();

  return useTransactionSubmit<boolean>(
    (value) => buildOptInDirectTransferPayload(value),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          getTokenStoreResourceQueryKey(activeAccountAddress),
        );
      },
      txnOptions,
    },
  );
}
