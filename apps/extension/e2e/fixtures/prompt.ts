// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { expect } from '@playwright/test';
import type { BrowserContext } from '@playwright/test';

export class PromptFixture {
  context: BrowserContext;
  extensionId: string;

  constructor(context: BrowserContext, extensionId: string) {
    this.context = context;
    this.extensionId = extensionId;
  }

  async runAndApprove<T>(promptFn: () => Promise<T>): Promise<T> {
    const { context, extensionId } = this;

    const promptUrl = `chrome-extension://${extensionId}/prompt.html`;
    const promptPage = await context.newPage();
    await promptPage.goto(promptUrl);

    const promptFnPromise = promptFn();
    await promptPage.locator('button >> text=Approve').click();
    return promptFnPromise;
  }
}
