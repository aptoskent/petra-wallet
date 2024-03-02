// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// Doesn't have sense to have caption for QR scanner
/* eslint-disable jsx-a11y/media-has-caption */

import { Box, Image, StyleProps } from '@chakra-ui/react';
import React, { useMemo, useRef } from 'react';
import toast, { renderErrorToast } from 'core/components/Toast';
import { imgScannerBg } from '../assets';
import { useQRScanner } from '../hooks';
import { AptosURType, SerializedUR } from '../types';

export function qrScanErrorToast(error: Error) {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: error.message,
        onClose,
        title: 'Scan error',
      }),
  });
}

export type KeystoneQRScannerProps = {
  onScan: (ur: SerializedUR) => void;
  urType: AptosURType;
} & Omit<StyleProps, 'position'>;

export default function KeystoneQRScanner({
  boxSize = '240px',
  onScan,
  urType,
  ...props
}: KeystoneQRScannerProps) {
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const urTypes = useMemo(() => [urType], [urType]);

  useQRScanner({
    onError: qrScanErrorToast,
    onScan,
    urTypes,
    videoElementRef,
  });

  return (
    <Box position="relative" boxSize={boxSize} {...props}>
      <Image src={imgScannerBg} boxSize="100%" position="absolute" />
      <video
        ref={videoElementRef}
        style={{
          display: 'block',
          height: '100%',
          objectFit: 'cover',
          transform: 'rotateY(180deg)',
          width: '100%',
        }}
      />
    </Box>
  );
}
