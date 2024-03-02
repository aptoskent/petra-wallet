// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import ExtendableError from '../types/error';
import { ApprovalResponseStatus } from './response';

export default class ApprovalResponseError extends ExtendableError {
  constructor(readonly status: ApprovalResponseStatus) {
    const keyIndex = Object.values(ApprovalResponseStatus).indexOf(status);
    const statusMessage = Object.keys(ApprovalResponseStatus).at(keyIndex);
    super(statusMessage);
    this.name = 'ApprovalResponseError';
    Object.setPrototypeOf(this, ApprovalResponseError.prototype);
  }
}
