// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import type { Page } from '@playwright/test';

export class KeyboardFixture {
  page: Page;
  isMac: boolean;

  constructor(page: Page) {
    this.page = page;
    this.isMac = process.platform === 'darwin';
  }

  clipboardCopy() {
    return this.page.keyboard.press(this.isMac ? 'Meta+KeyC' : 'Control+KeyC');
  }

  clipboardPaste() {
    return this.page.keyboard.press(this.isMac ? 'Meta+KeyV' : 'Control+KeyV');
  }
}
