// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { Text, useColorMode, VStack } from '@chakra-ui/react';
import { secondaryTextColor } from '@petra/core/colors';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import KeystoneQRScanner from './KeystoneQRScanner';
import { SerializedUR } from '../types';
import { useKeystoneRequestContext } from '../contexts/KeystoneRequestContext';

export interface KeystoneScanQRProps {
  onDone?: () => void;
}

export default function KeystoneScanQR({ onDone }: KeystoneScanQRProps) {
  const { colorMode } = useColorMode();
  const { sendKeystoneResponse, urType } = useKeystoneRequestContext();

  const onScan = useCallback(
    (ur: SerializedUR) => {
      sendKeystoneResponse(ur);
      if (onDone) {
        onDone();
      }
    },
    [onDone, sendKeystoneResponse],
  );

  return (
    <VStack spacing={4} alignItems="center">
      <KeystoneQRScanner urType={urType} onScan={onScan} />
      <Text
        color={secondaryTextColor[colorMode]}
        fontSize="sm"
        textAlign="center"
      >
        <FormattedMessage
          defaultMessage="Position the QR code in front of your camera."
          description="Prompt the user to scan the QR displayed on their
                       Keystone device when signing a transaction"
        />
      </Text>
    </VStack>
  );
}
