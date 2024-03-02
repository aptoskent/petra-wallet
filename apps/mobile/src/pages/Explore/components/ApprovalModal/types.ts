// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ApprovalRequestArgs } from '@petra/core/approval';

export type ApprovalRequestBodyProps<TRequestArgs extends ApprovalRequestArgs> =
  Omit<TRequestArgs, 'type'>;
