// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { HexString } from 'aptos';
import React from 'react';
import { useAccounts } from '../hooks/useAccounts';
import FlagProvider, { FlagProviderProps } from './FlagProvider';

export default function UserFlagProvider({
  ...props
}: Omit<FlagProviderProps, 'userId'>) {
  const { activeAccountAddress } = useAccounts();
  // Statsig user ids are at most 64 chars - remove 0x prefix.
  const userId = activeAccountAddress
    ? new HexString(activeAccountAddress).noPrefix()
    : undefined;
  return <FlagProvider userId={userId} {...props} />;
}
