// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export enum KeystoneSignatureErrorType {
  Cancelled = 'cancelled',
  InvalidData = 'invalidData',
}

function getErrorMessage(type: KeystoneSignatureErrorType) {
  switch (type) {
    case KeystoneSignatureErrorType.Cancelled:
      return 'Signature request cancelled';
    case KeystoneSignatureErrorType.InvalidData:
      return 'Invalid signature data. Please make sure the signature matches the request.';
    default:
      return undefined;
  }
}

export class KeystoneSignatureError extends Error {
  constructor(readonly type: KeystoneSignatureErrorType) {
    super(getErrorMessage(type));
  }
}

export function isKeystoneSignatureError(
  error: any,
): error is KeystoneSignatureError {
  return (
    error?.type !== undefined &&
    Object.values(KeystoneSignatureErrorType).includes(error.type)
  );
}

export function isKeystoneSignatureCancel(
  error: any,
): error is KeystoneSignatureError {
  return (
    isKeystoneSignatureError(error) &&
    error.type === KeystoneSignatureErrorType.Cancelled
  );
}
