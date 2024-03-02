// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  type SerializedUR,
  type UR,
  deserializeUR,
  isKeystoneSignatureRequest,
  isKeystoneSignatureResponse,
  makeKeystoneSignatureRequest,
  makeKeystoneSignatureResponse,
  serializeUR,
} from './types';
import { KeystoneSignatureError } from './errors';

/**
 * Send a UR-encoded Keystone request to a handler flow.
 * The handler flow needs to:
 * - listen to the request (see {@link onKeystoneRequest})
 * - display the request as QR, so that it can be scanned by a Keystone device
 * - scan the response QR from the Keystone device
 * - send a response back (see {@link sendKeystoneResponse})
 * @param ur the UR-encoded request
 */
export async function sendKeystoneRequest(ur: UR) {
  return new Promise<UR>((resolve, reject) => {
    const request = makeKeystoneSignatureRequest(serializeUR(ur));
    window.postMessage(request);

    const handleResponse = ({ data: response }: MessageEvent) => {
      // Ignore unrelated messages
      if (!isKeystoneSignatureResponse(response)) {
        return;
      }
      window.removeEventListener('message', handleResponse);

      if (response.ur !== undefined) {
        resolve(deserializeUR(response.ur));
      } else if (response.errorType !== undefined) {
        // Recreate the original KeystoneSignatureError when a type is provided.
        // This is necessary since custom errors are normalized by the structured clone algorithm.
        const error = new KeystoneSignatureError(response.errorType);
        error.stack = response.error.stack;
        reject(error);
      } else {
        reject(response.error);
      }
    };
    window.addEventListener('message', handleResponse);
  });
}

/**
 * Listen to a UR-encoded Keystone request.
 * See {@link sendKeystoneResponse} for how to respond to the request
 */
export function onKeystoneRequest(callback: (ur: SerializedUR) => void) {
  function handleRequest({ data: request }: MessageEvent) {
    // Ignore unrelated messages
    if (!isKeystoneSignatureRequest(request)) {
      return;
    }
    callback(request.ur);
  }

  window.addEventListener('message', handleRequest);
  return () => window.removeEventListener('message', handleRequest);
}

/**
 * Send a Keystone response as UR-encoded payload or Error instance.
 * In order to cancel a request, pass an instance of {@link SignatureCancelError}
 */
export function sendKeystoneResponse(urOrError: SerializedUR | Error) {
  const response = makeKeystoneSignatureResponse(urOrError);
  window.postMessage(response);
}
