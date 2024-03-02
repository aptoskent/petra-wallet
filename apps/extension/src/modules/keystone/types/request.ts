// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { SerializedUR } from './ur';

const keystoneSignatureRequestType = 'keystoneSignatureRequest';

export interface KeystoneSignatureRequest {
  type: typeof keystoneSignatureRequestType;
  ur: SerializedUR;
}

export function isKeystoneSignatureRequest(
  message: any,
): message is KeystoneSignatureRequest {
  return message?.type === keystoneSignatureRequestType;
}

export function makeKeystoneSignatureRequest(
  ur: SerializedUR,
): KeystoneSignatureRequest {
  return {
    type: keystoneSignatureRequestType,
    ur,
  };
}
