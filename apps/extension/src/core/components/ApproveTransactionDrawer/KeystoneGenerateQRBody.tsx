// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  Button,
  Heading,
  HStack,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { buttonBorderColor } from '@petra/core/colors';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  KeystoneGenerateQR,
  useKeystoneRequestContext,
} from 'modules/keystone';

export default function KeystoneGenerateQRBody() {
  const { colorMode } = useColorMode();
  const { cancelKeystoneRequest, setKeystoneStep } =
    useKeystoneRequestContext();

  const onNext = () => {
    setKeystoneStep('scan');
  };

  return (
    <VStack width="100%" height="100%" pt={4} spacing={4}>
      <Heading fontSize="2xl">Generate the QR code</Heading>
      <Box px={4}>
        <KeystoneGenerateQR />
      </Box>
      <Box
        width="100%"
        borderTop="1px"
        py={4}
        borderColor={buttonBorderColor[colorMode]}
      >
        <HStack px={4} width="100%">
          <Button width="100%" height={12} onClick={cancelKeystoneRequest}>
            <FormattedMessage defaultMessage="Back" description="Back button" />
          </Button>
          <Button
            width="100%"
            height={12}
            bgColor="salmon.500"
            _hover={{
              bgColor: 'salmon.300',
            }}
            color="white"
            onClick={onNext}
          >
            <FormattedMessage
              defaultMessage="Get signature"
              description="Button for proceeding to the Keystone signature scan step"
            />
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
