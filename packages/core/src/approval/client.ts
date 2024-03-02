// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { DappInfo } from '../types';
import { ApprovalRequestArgs } from './request';
import { ApprovalResponseArgs } from './response';

export default interface ApprovalClient {
  request<Args extends ApprovalRequestArgs>(
    dappInfo: DappInfo,
    args: Args,
  ): Promise<ApprovalResponseArgs>;
}
