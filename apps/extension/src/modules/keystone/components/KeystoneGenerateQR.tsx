// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Link, Text, useColorMode, VStack } from '@chakra-ui/react';
import { AnimatedQRCode } from '@keystonehq/animated-qr';
import { secondaryTextColor } from '@petra/core/colors';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { keystonePetraSignTutorialUrl } from '../constants';
import { useKeystoneRequestContext } from '../contexts/KeystoneRequestContext';

export default function KeystoneGenerateQR() {
  const { colorMode } = useColorMode();
  const { keystoneRequestUR } = useKeystoneRequestContext();

  return (
    <VStack spacing={4} alignItems="center">
      {keystoneRequestUR && (
        <AnimatedQRCode
          type={keystoneRequestUR.type}
          cbor={keystoneRequestUR.cbor}
          options={{
            size: 240,
          }}
        />
      )}
      <Text
        color={secondaryTextColor[colorMode]}
        fontSize="sm"
        textAlign="center"
      >
        <FormattedMessage
          defaultMessage="Proceed after signing the transaction with your Keystone device. <a>See how</a>"
          description="Brief description placed below a Keystone signature request QR
                       which includes a link to the full tutorial"
          values={{
            a: (chunks) => (
              <Link
                href={keystonePetraSignTutorialUrl}
                color="salmon.500"
                target="_blank"
              >
                {chunks}
              </Link>
            ),
          }}
        />
      </Text>
    </VStack>
  );
}
