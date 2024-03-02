// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { test as base, chromium, BrowserContext } from '@playwright/test';
import path from 'path';
import { KeyboardFixture } from '../fixtures/keyboard';
import { PromptFixture } from '../fixtures/prompt';
import { OnboardingFixture } from '../fixtures/onboarding';
import { SharedFixture } from '../fixtures/shared';
import { ClipboardFixture, makeIsolatedClipboard } from '../fixtures/clipboard';
import { AptosClient, FaucetClient, TokenClient, Types } from 'aptos';
import { DefaultNetworks, defaultNetworks } from '@petra/core/types';

require('dotenv').config({ path: path.join(__dirname, '../../.env')});

const TESTNET = defaultNetworks[DefaultNetworks.Testnet];
const TESTNET_FAUCET_AUTH_TOKEN = process.env.TESTNET_FAUCET_AUTH_TOKEN;
const TESTNET_APTOS_CLIENT_AUTH_TOKEN = process.env.TESTNET_APTOS_CLIENT_AUTH_TOKEN

export interface Fixtures {
  context: BrowserContext;
  clipboard: ClipboardFixture;
  extensionId: string;
  keyboard: KeyboardFixture;
  onboarding: OnboardingFixture;
  prompt: PromptFixture;
  shared: SharedFixture;
  aptosClient: AptosClient;
  tokenClient: TokenClient;
  faucetClient: FaucetClient;
}

export const test = base.extend<Fixtures>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '../../build');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
  clipboard: async ({ page }, use) => {
    const clipboardFixture = await makeIsolatedClipboard(page);
    await use(clipboardFixture);
  },
  keyboard: async ({ page }, use) => {
    const keyboardFixture = new KeyboardFixture(page);
    await use(keyboardFixture);
  },
  prompt: async ({ context, extensionId }, use) => {
    const promptFixture = new PromptFixture(context, extensionId);
    await use(promptFixture);
  },
  onboarding: async ({ clipboard, page, shared, extensionId, keyboard }, use) => {
    const onboardingFixture = new OnboardingFixture(
      page,
      extensionId,
      shared,
      clipboard,
    );
    await use(onboardingFixture);
  },
  shared: async ({ clipboard, page, extensionId }, use) => {
    const sharedFixture = new SharedFixture(page, clipboard);
    await use(sharedFixture);
  },
  aptosClient: async ({}, use) => {
    const config: Partial<Types.OpenAPIConfig> = {};
    if (TESTNET_APTOS_CLIENT_AUTH_TOKEN) {
      config.HEADERS = { 'x-api-key': TESTNET_APTOS_CLIENT_AUTH_TOKEN }
    }
    use(new AptosClient(TESTNET.nodeUrl, config))
  },
  faucetClient: async ({}, use) => {
    const config: Partial<Types.OpenAPIConfig> = {};
    if (TESTNET_FAUCET_AUTH_TOKEN) {
      config.HEADERS = { Authorization: `Bearer ${TESTNET_FAUCET_AUTH_TOKEN}` };
    }
    const faucetClient = new FaucetClient(TESTNET.nodeUrl, TESTNET.faucetUrl, config);

    await use(faucetClient);
  },
  tokenClient: async ({ aptosClient }, use) =>
    use(new TokenClient(aptosClient)),
});
