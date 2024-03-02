// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/no-extraneous-dependencies */

import { BrowserQRCodeReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser/esm/common/IScannerControls';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { type RefObject, useEffect } from 'react';

import makeQRScanCallback, { ScannerProps } from './makeQRScanCallback';
import { QRScanError, QRScanErrorType } from '../errors';

type HTMLVideoElementScanPreview = HTMLVideoElement & {
  pendingScanRequest?: Promise<IScannerControls | undefined>;
};

export type UseQRScannerProps = ScannerProps & {
  videoElementRef?: RefObject<HTMLVideoElement>;
};

export default function useQRScanner({
  onError,
  onScan,
  urTypes,
  videoElementRef,
}: UseQRScannerProps) {
  useEffect(() => {
    const videoElement = (videoElementRef?.current ?? undefined) as
      | HTMLVideoElementScanPreview
      | undefined;

    const scanCallback = makeQRScanCallback({
      onError,
      onScan,
      urTypes,
    });

    const hint = new Map();
    hint.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
    const qrCodeReader = new BrowserQRCodeReader(hint, {
      delayBetweenScanAttempts: 500,
      delayBetweenScanSuccess: 2000,
    });

    const pendingScanRequest =
      videoElement?.pendingScanRequest ?? Promise.resolve();
    const scanRequest = pendingScanRequest
      .then(() =>
        qrCodeReader.decodeFromVideoDevice(
          undefined,
          videoElementRef?.current ?? undefined,
          (result) => {
            if (result) {
              scanCallback(result.getText());
            }
          },
        ),
      )
      .catch((err) => {
        if (
          err instanceof DOMException &&
          err.message === 'Permission denied'
        ) {
          onError(new QRScanError(QRScanErrorType.CameraUnavailable));
        } else {
          onError(err);
        }
        return undefined;
      });

    if (videoElement !== undefined) {
      videoElement.pendingScanRequest = scanRequest;
    }

    return () => {
      scanRequest.then((controls) => controls?.stop());
    };
  }, [onError, onScan, urTypes, videoElementRef]);
}
