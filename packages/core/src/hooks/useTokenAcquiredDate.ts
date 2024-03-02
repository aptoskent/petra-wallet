// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import useTokenActivities from '../queries/useTokenActivities';
import { TokenData, TokenEvent } from '../types';
import { useActiveAccount } from './useAccounts';
import { normalizeTimestamp } from '../transactions';

/**
 * useAcquiredDate
 * Given a token, this function returns the date as a string that
 * token was deposited into the active account
 */
export default function useTokenAcquiredDate(nft: TokenData): Date | null {
  const account = useActiveAccount();

  const nftActivities = useTokenActivities(nft.idHash);
  const nftActivitiesFlattened = useMemo(
    () => nftActivities.data?.pages.flatMap((page) => page.items),
    [nftActivities.data],
  );

  const acquiredEvent = nftActivitiesFlattened?.find((e) => {
    const isCurrentAccount = e.toAddress === account.activeAccountAddress;
    const isDeposited = e.transferType === TokenEvent.Deposit;
    return isCurrentAccount && isDeposited;
  });

  if (!acquiredEvent) return null;

  return new Date(normalizeTimestamp(acquiredEvent.transactionTimestamp));
}
