// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ExtendableError } from '@petra/core/types';

export enum QRScanErrorType {
  InvalidQRCode,
  UnexpectedQRCode,
  CameraUnavailable,
}

const qrErrorSuffix =
  'please ensure you have selected a valid QR code from your Keystone device.';

function getQRScanErrorMessage(type: QRScanErrorType) {
  switch (type) {
    case QRScanErrorType.InvalidQRCode:
      return `Invalid QR code, ${qrErrorSuffix}`;
    case QRScanErrorType.UnexpectedQRCode:
      return `Unexpected QR code, ${qrErrorSuffix}`;
    case QRScanErrorType.CameraUnavailable:
      return 'Please enable the camera permission on your browser';
    default:
      return undefined;
  }
}

export class QRScanError extends ExtendableError {
  constructor(readonly type: QRScanErrorType) {
    super(getQRScanErrorMessage(type));
  }
}
