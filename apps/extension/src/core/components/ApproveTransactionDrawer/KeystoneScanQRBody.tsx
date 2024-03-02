// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Box, Button, Heading, VStack, useColorMode } from '@chakra-ui/react';
import { buttonBorderColor } from '@petra/core/colors';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { KeystoneScanQR, useKeystoneRequestContext } from 'modules/keystone';

export default function KeystoneScanQRBody() {
  const { colorMode } = useColorMode();
  const { setKeystoneStep } = useKeystoneRequestContext();

  const onBack = () => {
    setKeystoneStep('generate');
  };

  return (
    <VStack width="100%" height="100%" pt={4} spacing={6}>
      <Heading fontSize="2xl">Scan the QR Code</Heading>
      <Box px={4}>
        <KeystoneScanQR />
      </Box>
      <Box
        width="100%"
        borderTop="1px"
        p={4}
        borderColor={buttonBorderColor[colorMode]}
      >
        <Button width="100%" height="48px" onClick={onBack}>
          <FormattedMessage
            defaultMessage="Back to QR code"
            description="Button for going back to the keystone signature request step"
          />
        </Button>
      </Box>
    </VStack>
  );
}
