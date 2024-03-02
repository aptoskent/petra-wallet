// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  ApprovalRequest,
  ApprovalResponseArgs,
  ApprovalResponseStatus,
} from '@petra/core/approval';
import constate from 'constate';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromptState } from 'prompt/hooks/usePromptState';
import { Routes } from 'prompt/routes';
import { onKeystoneRequest } from 'modules/keystone';

export interface ApprovalRequestProviderProps {
  approvalRequest: ApprovalRequest;
}

export const [ApprovalRequestContextProvider, useApprovalRequestContext] =
  constate(({ approvalRequest }: ApprovalRequestProviderProps) => {
    const { approvalServer } = usePromptState();
    const [isApproving, setIsApproving] = useState<boolean>(false);

    const navigate = useNavigate();

    const approve = async (args: ApprovalResponseArgs) => {
      await approvalServer.sendResponse({
        args,
        id: approvalRequest.id,
        status: ApprovalResponseStatus.Approved,
      });
    };

    const reject = async () => {
      await approvalServer.sendResponse({
        id: approvalRequest.id,
        status: ApprovalResponseStatus.Rejected,
      });
    };

    useEffect(
      () =>
        onKeystoneRequest((ur) => {
          navigate(Routes.keystoneGenerate.path, { state: ur });
        }),
      [navigate],
    );

    return {
      approvalRequest,
      approve,
      isApproving,
      reject,
      setIsApproving,
    };
  });
