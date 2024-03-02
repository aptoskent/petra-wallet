// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { PairWithLedgerContext } from './usePairWithLedger';

export function getLedgerQueryKey() {
  return ['ledger'];
}

function getLedgerAccountInfoQueryKey(hdPath: string) {
  return [...getLedgerQueryKey(), hdPath, 'info'];
}

export default function useLedgerAccountInfo(hdPath: string) {
  const { ledgerClient } = useContext(PairWithLedgerContext);
  return useQuery(
    getLedgerAccountInfoQueryKey(hdPath),
    async () => ledgerClient?.getAccount(hdPath),
    { staleTime: Infinity },
  );
}
