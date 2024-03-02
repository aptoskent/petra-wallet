// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type {
  SerializedMultiAgentPayload,
  SerializedPayload,
} from '../serialization';
import type { TransactionOptions } from '../transactions';
import type { DappInfo } from '../types';

export interface ConnectionRequestArgs {
  type: 'connect';
}

export interface SignAndSubmitTransactionRequestArgs {
  payload: SerializedPayload;
  type: 'signAndSubmitTransaction';
}

export interface SignMessageRequestArgs {
  fullMessage: string;
  message: string;
  type: 'signMessage';
}

export interface SignTransactionRequestArgs {
  options?: TransactionOptions;
  payload: SerializedPayload;
  type: 'signTransaction';
}

export interface SignMultiAgentTransactionRequestArgs {
  payload: SerializedMultiAgentPayload;
  type: 'signMultiAgentTransaction';
}

export type ApprovalRequestArgs =
  | ConnectionRequestArgs
  | SignAndSubmitTransactionRequestArgs
  | SignMessageRequestArgs
  | SignTransactionRequestArgs
  | SignMultiAgentTransactionRequestArgs;

export interface ApprovalRequest {
  args: ApprovalRequestArgs;
  dappInfo: DappInfo;
  id: string;
}
