// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  ApprovalClient,
  ApprovalRequestArgs,
  ApprovalResponseArgs,
} from '@petra/core/approval';
import { DappInfo } from '@petra/core/types';
import { RefObject, useMemo, useRef } from 'react';
import { ApprovalModalHandle } from '../components/ApprovalModal';

/**
 * Inject ApprovalModal and provide it as ApprovalClient
 */
export default function useModalApprovalClient(
  modalRef: RefObject<ApprovalModalHandle>,
): ApprovalClient {
  const pendingApproval = useRef<Promise<ApprovalResponseArgs>>();
  return useMemo(
    () => ({
      async request(dappInfo: DappInfo, args: ApprovalRequestArgs) {
        await pendingApproval.current?.catch(() => undefined);

        const requestPromise = new Promise<ApprovalResponseArgs>(
          (resolve, reject) => {
            modalRef.current?.request({ args, dappInfo, reject, resolve });
          },
        );

        pendingApproval.current = requestPromise;
        return requestPromise;
      },
    }),
    [modalRef],
  );
}
