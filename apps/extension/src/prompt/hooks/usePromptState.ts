// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import constate from 'constate';
import { useEffect, useMemo, useState } from 'react';

import { ApprovalRequest } from '@petra/core/approval';
import { useAppStorage } from '@petra/core/hooks/useStorage';
import PromptApprovalServer from 'shared/approval/PromptApprovalServer';

export const [PromptStateProvider, usePromptState] = constate(() => {
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest>();
  const { persistentStorage } = useAppStorage();

  const approvalServer = useMemo(
    () => new PromptApprovalServer(persistentStorage),
    [persistentStorage],
  );

  useEffect(
    () =>
      approvalServer.listen((request) => {
        setApprovalRequest(request);
      }),
    [approvalServer],
  );

  return {
    approvalRequest,
    approvalServer,
  };
});
