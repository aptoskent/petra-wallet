// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  ApprovalResponse,
  ApprovalResponseStatus,
  isApprovalResponse,
} from '@petra/core/approval';

import { PROMPT_PATHNAME, PROMPT_SIZE } from './constants';
import PromptConnection from './PromptConnection';

const PROMPT_POLLER_INTERVAL = 500;
let gCurrPromptRef: Window | undefined;

async function openPrompt() {
  const { height, width } = PROMPT_SIZE;
  const params = {
    height,
    left: window.screenLeft + window.outerWidth - width,
    popup: true,
    top: window.screenTop,
    width,
  };

  const strParams = Object.entries(params)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .reduce((acc, entry) => `${acc}, ${entry}`);

  const promptWindow = window.open(PROMPT_PATHNAME, 'prompt', strParams);
  if (promptWindow === null) {
    throw new Error("Couldn't open permission request popup");
  }

  gCurrPromptRef = promptWindow;
  return promptWindow;
}

function getCurrPrompt() {
  return gCurrPromptRef !== undefined && !gCurrPromptRef.closed
    ? gCurrPromptRef
    : undefined;
}

export default class WindowPromptConnection implements PromptConnection {
  private constructor(
    private readonly promptWindow: Window,
    private readonly requestId: string,
  ) {}

  static async open(requestId: string) {
    const promptWindow = getCurrPrompt() ?? (await openPrompt());
    promptWindow.focus();
    return new WindowPromptConnection(promptWindow, requestId);
  }

  async waitForResponse() {
    return new Promise<ApprovalResponse>((resolve) => {
      const listeners = {
        onMessage: (message: MessageEvent<any>) => {
          if (
            message.source === this.promptWindow &&
            isApprovalResponse(message.data) &&
            message.data.id === this.requestId
          ) {
            window.removeEventListener('message', listeners.onMessage);
            clearTimeout(listeners.promptPollerId);
            resolve(message.data);
          }
        },
        promptPollerId: setInterval(() => {
          const isPromptClosed = gCurrPromptRef?.closed !== false;
          if (isPromptClosed) {
            window.removeEventListener('message', listeners.onMessage);
            clearTimeout(listeners.promptPollerId);
            resolve({
              id: this.requestId,
              status: ApprovalResponseStatus.Rejected,
            });
          }
        }, PROMPT_POLLER_INTERVAL),
      };

      window.addEventListener('message', listeners.onMessage);
    });
  }
}
