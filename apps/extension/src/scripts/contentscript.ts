// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  PetraApiResponse,
  PetraEventEmitter,
  isPetraApiRequest,
} from '@petra/core/api';
import { makeBrowserPersistentStorage } from 'core/storage/browser';

function injectScript() {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement('script');
    scriptTag.src = chrome.runtime.getURL('static/js/inpage.js');
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Aptos injection failed.', error);
  }
}

injectScript();

// Forward Petra API requests to service worker
window.addEventListener('message', (event) => {
  const { data: request, source: srcWindow } = event;
  if (srcWindow !== window || !isPetraApiRequest(request)) {
    return;
  }

  // contentscript -> background
  chrome.runtime.sendMessage(request, (response: PetraApiResponse) => {
    // contentscript -> dapp
    window.postMessage(response);
  });
});

const persistentStorage = makeBrowserPersistentStorage();

// Forward Petra events to the parent window
const eventEmitter = new PetraEventEmitter(
  window.origin,
  persistentStorage,
  (name, args) => window.postMessage({ args, name }),
);
eventEmitter.start();
