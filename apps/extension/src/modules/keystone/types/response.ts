// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { SerializedUR } from './ur';
import { KeystoneSignatureError, KeystoneSignatureErrorType } from '../errors';

const keystoneSignatureResponseType = 'keystoneSignatureResponse';

interface KeystoneSignatureResponseSuccessArgs {
  error: undefined;
  ur: SerializedUR;
}

interface KeystoneSignatureResponseErrorArgs {
  error: Error;
  errorType?: KeystoneSignatureErrorType;
  ur: undefined;
}

type KeystoneSignatureResponseArgs =
  | KeystoneSignatureResponseSuccessArgs
  | KeystoneSignatureResponseErrorArgs;

export type KeystoneSignatureResponse = {
  type: typeof keystoneSignatureResponseType;
} & KeystoneSignatureResponseArgs;

export function isKeystoneSignatureResponse(
  message: any,
): message is KeystoneSignatureResponse {
  return message?.type === keystoneSignatureResponseType;
}

export function makeKeystoneSignatureResponse(
  urOrError: SerializedUR | Error,
): KeystoneSignatureResponse {
  // Note: in case of a KeystoneSignatureError we keep track of the type
  // so that it can be rebuilt on the receiver side.
  // This is necessary since custom errors are normalized by the structured clone algorithm.
  const isError = urOrError instanceof Error;
  const isKeystoneError = urOrError instanceof KeystoneSignatureError;
  return isError
    ? {
        error: urOrError,
        errorType: isKeystoneError ? urOrError.type : undefined,
        type: keystoneSignatureResponseType,
        ur: undefined,
      }
    : {
        error: undefined,
        type: keystoneSignatureResponseType,
        ur: urOrError,
      };
}
