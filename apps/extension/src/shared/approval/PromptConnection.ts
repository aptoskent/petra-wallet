// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ApprovalResponse } from '@petra/core/approval';

export default interface PromptConnection {
  waitForResponse(): Promise<ApprovalResponse>;
}
