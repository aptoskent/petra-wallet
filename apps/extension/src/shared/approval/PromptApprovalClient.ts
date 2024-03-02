// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  ApprovalClient,
  ApprovalRequestArgs,
  ApprovalResponse,
  ApprovalResponseArgs,
} from '@petra/core/approval';
import ApprovalResponseError from '@petra/core/approval/error';

import { Storage } from '@petra/core/storage';
import { DappInfo, PersistentState } from '@petra/core/types';

import { v4 as randomUUID } from 'uuid';
import PromptConnection from './PromptConnection';

function handleApprovalResponse(response: ApprovalResponse) {
  switch (response.status) {
    case 'approved':
      return response.args;
    default:
      throw new ApprovalResponseError(response.status);
  }
}

type PromptConnectionFactory = (requestId: string) => Promise<PromptConnection>;

export default class PromptApprovalClient implements ApprovalClient {
  constructor(
    private readonly persistentStorage: Storage<PersistentState>,
    private readonly promptConnectionFactory: PromptConnectionFactory,
  ) {}

  async request<Args extends ApprovalRequestArgs>(
    dappInfo: DappInfo,
    args: Args,
  ): Promise<ApprovalResponseArgs> {
    const approvalRequest = {
      args,
      dappInfo,
      id: randomUUID(),
    };
    await this.persistentStorage.set({ approvalRequest });

    const connection = await this.promptConnectionFactory(approvalRequest.id);
    const response = await connection.waitForResponse();
    return handleApprovalResponse(response);
  }
}
