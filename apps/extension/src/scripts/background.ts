// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import PetraApiServer from '@petra/core/api/server';
import { PetraApiResponse, isPetraApiRequest } from '@petra/core/api/types';

import { DappInfo } from '@petra/core/types';
import { isMobile } from '@petra/core/utils/browser';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import axios from 'axios';

import { makeBrowserPersistentStorage } from 'core/storage/browser';
import { SessionStorage, PersistentStorage } from 'core/storage';
import {
  ExtensionPromptConnection,
  PromptApprovalClient,
} from 'shared/approval';

type SendProxiedResult = (result: PetraApiResponse) => void;

// The fetch adapter is necessary to use axios from a service worker
axios.defaults.adapter = fetchAdapter;

const persistentStorage = makeBrowserPersistentStorage();
const promptApprovalClient = new PromptApprovalClient(
  persistentStorage,
  ExtensionPromptConnection.open,
);

const server = new PetraApiServer(persistentStorage, promptApprovalClient);

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse: SendProxiedResult) => {
    if (request && request.type === 'popupOpened') {
      // clear all pending alarm in case there's any pending alarm that is inflight
      void chrome.alarms.clearAll();
      return false;
    }

    // Only accept Petra API requests with transparent origin
    if (!isPetraApiRequest(request) || sender.origin === undefined) {
      return false;
    }

    const dappInfo: DappInfo = {
      domain: sender.origin,
      imageURI: sender.tab?.favIconUrl,
      name: sender.tab?.title,
    };

    server
      .handleRequest(dappInfo, request)
      .then((response) => sendResponse(response));

    // Return true to indicate the response is asynchronous
    return true;
  },
);

// lock account as soon as alarm timer elapsed
chrome.alarms.onAlarm.addListener(async () => {
  await SessionStorage.set({
    accounts: undefined,
    encryptionKey: undefined,
  });
});

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(async () => {
    const { autolockTimer } = await PersistentStorage.get(['autolockTimer']);

    // if autolock timer not yet set when wallet closes, default timer to 15 mins
    // starts timer as soon as user close the wallet and become 'inactive'
    // to satisfy security compliance requirement
    chrome.alarms.create('autolockTimer', {
      delayInMinutes: autolockTimer ?? 15,
    });
  });
});

// Opening an extension page in a new tab
// https://developer.chrome.com/docs/extensions/reference/tabs/
chrome.runtime.onInstalled.addListener(
  (detail: chrome.runtime.InstalledDetails) => {
    // only open desktop onboarding tab if user is in desptop
    if (
      !isMobile() &&
      detail.reason === chrome.runtime.OnInstalledReason.INSTALL
    ) {
      chrome.tabs.create({
        url: 'onboarding.html',
      });
    }
  },
);
