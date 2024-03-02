// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type { Types } from 'aptos';
import type { PublicAccount } from '../types';

export interface ConnectionResponseArgs {
  account: PublicAccount;
}

export interface SignTransactionResponseArgs {
  signedTxnHex: string;
}

export interface SignAndSubmitTransactionResponseArgs {
  userTxn: Types.UserTransaction;
}

export interface SignMessageResponseArgs {
  signature: string;
}

export type ApprovalResponseArgs =
  | ConnectionResponseArgs
  | SignTransactionResponseArgs
  | SignAndSubmitTransactionResponseArgs
  | SignMessageResponseArgs;

export enum ApprovalResponseStatus {
  Approved = 'approved',
  Rejected = 'rejected',
  Timeout = 'timeout',
}

export interface BaseApprovalResponse {
  id: string;
}

export type ApprovalSuccessResponse = {
  args: ApprovalResponseArgs;
  status: ApprovalResponseStatus.Approved;
} & BaseApprovalResponse;

export type ApprovalErrorResponse = {
  status: ApprovalResponseStatus.Rejected | ApprovalResponseStatus.Timeout;
} & BaseApprovalResponse;

export type ApprovalResponse = ApprovalSuccessResponse | ApprovalErrorResponse;

export function isApprovalResponse(
  response?: ApprovalResponse,
): response is ApprovalResponse {
  return (
    response !== undefined &&
    response.id !== undefined &&
    Object.values(ApprovalResponseStatus).includes(response.status)
  );
}
