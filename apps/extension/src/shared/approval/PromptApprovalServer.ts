// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  ApprovalRequest,
  ApprovalResponse,
  ApprovalResponseStatus,
} from '@petra/core/approval';
import { Storage } from '@petra/core/storage';
import { PersistentState } from '@petra/core/types';

async function sendResponseToExtension(response: ApprovalResponse) {
  await chrome.runtime.sendMessage(response);
}

async function sendResponseToWindow(response: ApprovalResponse) {
  const parentWindow = window.opener as Window;
  parentWindow.postMessage(response);
}

const isExtensionEnv = chrome.runtime !== undefined;
const responseCallback = isExtensionEnv
  ? sendResponseToExtension
  : sendResponseToWindow;

export default class PromptApprovalServer {
  private currRequestId?: string;

  constructor(private readonly persistentStorage: Storage<PersistentState>) {}

  listen(callback: (request?: ApprovalRequest) => void) {
    this.persistentStorage
      .get(['approvalRequest'])
      .then(({ approvalRequest }) => {
        this.currRequestId = approvalRequest?.id;
        callback(approvalRequest);
      });

    return this.persistentStorage.onChange((changes) => {
      if (changes.approvalRequest) {
        const currRequest = changes.approvalRequest.newValue;
        callback(currRequest);

        const prevRequestId = this.currRequestId;
        this.currRequestId = currRequest?.id;

        // Timeout prev request, if any
        if (prevRequestId !== undefined) {
          void responseCallback({
            id: prevRequestId,
            status: ApprovalResponseStatus.Timeout,
          });
        }
      }
    });
  }

  /**
   * Send a response to the prompt client
   * @param response
   */
  async sendResponse(response: ApprovalResponse) {
    // Fulfill current request
    if (response.id === this.currRequestId) {
      this.currRequestId = undefined;
      await this.persistentStorage.set({ approvalRequest: undefined });
    }
    await responseCallback(response);
  }
}
