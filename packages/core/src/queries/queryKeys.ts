// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { getAccountTokensTotalQueryKey } from '../hooks/useAccountTokensTotal';
import { accountQueryKeys } from './account';
import { gasQueryKeys } from './gas';
import { networkQueryKeys } from './network';
import { transactionQueryKeys } from './transaction';
import { getAccountResourcesQueryKey } from './useAccountResources';

export const queryKeys = {
  getAccountResources: getAccountResourcesQueryKey,
  getAccountTokensTotalQueryKey,
  ...accountQueryKeys,
  ...networkQueryKeys,
  ...transactionQueryKeys,
  ...gasQueryKeys,
};

export default queryKeys;
