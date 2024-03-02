// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/no-extraneous-dependencies */

import { URDecoder } from '@ngraveio/bc-ur';
import { QRScanError, QRScanErrorType } from '../errors';
import { SerializedUR, serializeUR } from '../types';

export interface ScannerProps {
  onError: (error: Error) => void;
  onScan: (ur: SerializedUR) => void;
  urTypes?: string[];
}

export default function makeQRScanCallback({
  urTypes = [],
  onScan,
  onError,
}: ScannerProps) {
  let urDecoder = new URDecoder();
  return (data: string) => {
    try {
      urDecoder.receivePart(data);
      if (!urDecoder.isComplete()) {
        return;
      }

      if (urDecoder.isError()) {
        onError(new QRScanError(QRScanErrorType.InvalidQRCode));
      }

      if (urDecoder.isSuccess()) {
        const ur = urDecoder.resultUR();
        if (urTypes.includes(ur.type)) {
          onScan(serializeUR(ur));
        } else {
          onError(new QRScanError(QRScanErrorType.UnexpectedQRCode));
        }
      }
      urDecoder = new URDecoder();
    } catch (e) {
      onError(new QRScanError(QRScanErrorType.InvalidQRCode));
      urDecoder = new URDecoder();
    }
  };
}
