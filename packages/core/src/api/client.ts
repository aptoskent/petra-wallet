// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { HexString, TxnBuilderTypes } from 'aptos';
import { v4 as randomUUID } from 'uuid';

import {
  ensureMultiAgentPayloadSerialized,
  ensurePayloadSerialized,
  TransactionPayload,
} from '../serialization';
import type { TransactionOptions } from '../transactions';
import {
  SignMessagePayload,
  isPetraApiResponse,
  makePetraApiRequest,
} from './types';
import { PetraApiError, isPetraApiError } from './error';
import {
  AccountChangeEventArgs,
  NetworkChangeEventArgs,
  PetraEventArgs,
  PetraEventName,
  isPetraEvent,
} from './events';
import {
  HandlerMethodArgs,
  HandlerMethodName,
  HandlerMethodReturnType,
} from './handler';

type PetraEventCallback<EventName extends PetraEventName> = (
  args: PetraEventArgs<EventName>,
) => void;

type PetraEventCallbacksMap = {
  [EventName in PetraEventName]?: Set<(args: any) => void>;
};

// region Retro-compatibility

// The first version of PetraApiClient had a slightly different name for `maxGasAmount`.
// The following type and utility function will take care of normalizing to the latest format.

type RetroCompatTransactionOptions = TransactionOptions & {
  maxGasFee?: number;
};

function normalizeTransactionOptions({
  maxGasFee,
  ...options
}: RetroCompatTransactionOptions): TransactionOptions {
  return {
    maxGasAmount: maxGasFee,
    ...options,
  };
}

// endregion

// If the dapp is opened through Petra Mobile explorer, a ReactNativeWebView
// is automatically injected and can be used to send back messages to the mobile app.
// Here we create a Window-like interface that can be used by the PetraApiClient.
const reactNativeWebView = (window as any).ReactNativeWebView;
const reactNativeMockTargetWindow = reactNativeWebView
  ? ({
      postMessage: (message: any) => {
        reactNativeWebView.postMessage(JSON.stringify(message));
      },
    } as Window)
  : undefined;

export default class PetraApiClient {
  private readonly iframe?: HTMLIFrameElement;

  private readonly targetWindow: Window;

  private eventListener: any;

  private readonly eventCallbacks: PetraEventCallbacksMap = {};

  /**
   * @param petraOrigin optional origin of a web-hosted Petra
   */
  constructor(petraOrigin?: string) {
    if (reactNativeMockTargetWindow !== undefined) {
      this.targetWindow = reactNativeMockTargetWindow;
      return;
    }

    // When the origin of a web-hosted Petra is specified
    // create a hidden gateway iframe for sending requests to it
    if (petraOrigin !== undefined) {
      this.iframe = document.createElement('iframe');
      this.iframe.setAttribute('src', `${petraOrigin}/iframe.html`);
      this.iframe.setAttribute('style', 'display: none');
      document.body.appendChild(this.iframe);
    }
    this.targetWindow = this.iframe?.contentWindow ?? window;
  }

  private async sendRequest<TRequestName extends HandlerMethodName>(
    method: TRequestName,
    ...args: HandlerMethodArgs<TRequestName>
  ) {
    const currRequestId = randomUUID();

    return new Promise<HandlerMethodReturnType<TRequestName>>(
      (resolve, reject) => {
        const request = makePetraApiRequest(currRequestId, method, args);
        this.targetWindow.postMessage(request);

        function responseHandler(this: Window, event: MessageEvent) {
          const { data: response } = event;
          // Just ignore response from non-matching requests
          if (!isPetraApiResponse(response) || response.id !== currRequestId) {
            return;
          }
          this.removeEventListener('message', responseHandler);
          if (response.error !== undefined) {
            // Reconstruct api error so that it can be caught by the consumer
            if (isPetraApiError(response.error)) {
              const { code, message, name } = response.error;
              reject(new PetraApiError(code, name, message));
            } else {
              reject(response.error);
            }
          } else {
            resolve(response.result as HandlerMethodReturnType<TRequestName>);
          }
        }

        window.addEventListener('message', responseHandler);
      },
    );
  }

  // region API methods

  async connect() {
    return this.sendRequest('connect');
  }

  async disconnect() {
    return this.sendRequest('disconnect');
  }

  async isConnected() {
    return this.sendRequest('isConnected');
  }

  async account() {
    return this.sendRequest('getAccount');
  }

  async getAccount() {
    return this.sendRequest('getAccount');
  }

  async network() {
    const { name } = await this.sendRequest('getNetwork');
    return name;
  }

  async getNetwork() {
    return this.sendRequest('getNetwork');
  }

  async signTransaction(
    payload: TransactionPayload,
    options?: RetroCompatTransactionOptions,
  ) {
    const serializedPayload = ensurePayloadSerialized(payload);
    const serializedSignedTxn = await this.sendRequest(
      'signTransaction',
      serializedPayload,
      options ? normalizeTransactionOptions(options) : undefined,
    );
    // Note: returning a Uint8Array for compatibility
    return new HexString(serializedSignedTxn).toUint8Array();
  }

  async signMultiAgentTransaction(
    payload: TxnBuilderTypes.MultiAgentRawTransaction,
  ) {
    const serializedPayload = ensureMultiAgentPayloadSerialized(payload);
    return this.sendRequest('signMultiAgentTransaction', serializedPayload);
  }

  async signAndSubmitTransaction(payload: TransactionPayload) {
    const serializedPayload = ensurePayloadSerialized(payload);
    return this.sendRequest('signAndSubmitTransaction', serializedPayload);
  }

  async signMessage(payload: SignMessagePayload) {
    return this.sendRequest('signMessage', payload);
  }

  // endregion

  // region Events

  private ensureEventListener() {
    this.eventListener = (message: MessageEvent) => {
      const { data: event } = message;
      // Just ignore response from non-matching requests
      if (!isPetraEvent(event)) {
        return;
      }

      const handlers = this.eventCallbacks[event.name] ?? [];
      for (const handler of handlers) {
        handler(event.args);
      }
    };
    window.addEventListener('message', this.eventListener);
  }

  private maybeCleanupEventListener() {
    for (const handlers of Object.values(this.eventCallbacks)) {
      if (handlers.size > 0) {
        return;
      }
    }
    if (this.eventListener) {
      window.removeEventListener('message', this.eventListener);
    }
  }

  on<EventName extends PetraEventName>(
    name: EventName,
    handler?: PetraEventCallback<EventName>,
  ) {
    // For backward compatibility
    if (handler === undefined) {
      this.off(name);
      return;
    }

    this.ensureEventListener();
    if (this.eventCallbacks[name] === undefined) {
      this.eventCallbacks[name] = new Set() as any;
    }
    this.eventCallbacks[name]?.add(handler);
  }

  off<EventName extends PetraEventName>(
    name: EventName,
    handler?: PetraEventCallback<EventName>,
  ) {
    if (handler !== undefined) {
      this.eventCallbacks[name]?.delete(handler);
    } else {
      this.eventCallbacks[name]?.clear();
    }
    this.maybeCleanupEventListener();
  }

  onAccountChange(callback?: (args: AccountChangeEventArgs) => void) {
    this.on('accountChange', callback);
  }

  onNetworkChange(callback?: (args: NetworkChangeEventArgs) => void) {
    this.on('networkChange', callback);
  }

  onDisconnect(callback?: () => void) {
    this.on('disconnect', callback);
  }

  // endregion
}
