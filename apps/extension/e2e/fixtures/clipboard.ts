// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import type { Page } from '@playwright/test';

export interface ClipboardFixture {
  read: () => string | Promise<string>;
}

/**
 * Create an isolated clipboard that intercepts copy calls withing the context
 * of the provided page. Copy events from other pages will not be intercepted.
 */
export async function makeIsolatedClipboard(page: Page) {
  let isolatedValue = '';

  // Exposed setter than can be called from the page's context
  await page.exposeFunction(
    'localClipboardSetValue',
    (value: string) => (isolatedValue = value),
  );

  // Add an init hook that replaces document native functions with custom code
  await page.addInitScript(() => {
    // `copy-to-clipboard` creates a throwaway HTML element, assigns a value to it as text and focuses it
    // before triggering a `document.execCommand('copy')` call.
    // We can intercept the copied value by spying on `document.execCommand` and reading the text content
    // of the current selection.
    const originalDocumentExecCommand = document.execCommand;
    document.execCommand = (...args) => {
      if (args[0] === 'copy') {
        const selection = document.getSelection();
        const lastRange = selection?.getRangeAt(selection.rangeCount - 1);
        const selectedNode = lastRange.commonAncestorContainer;
        const value = selectedNode.textContent;

        // @ts-expect-error Injected function
        localClipboardSetValue(value);
        return true;
      }
      return originalDocumentExecCommand(...args);
    };

    // Note: we might potentially need to intercept other copy events
  });

  const clipboard: ClipboardFixture = {
    read: () => isolatedValue,
  };

  return clipboard;
}
