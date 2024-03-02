// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import {
  Box,
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Fade,
  HStack,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { secondaryDividerColor } from '@petra/core/colors';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTransferFlow } from 'core/hooks/useTransferFlow';
import {
  KeystoneGenerateQR,
  useKeystoneRequestContext,
} from 'modules/keystone';

export default function TransferDrawerGenerateQRCode() {
  const { goToConfirmation, goToScanQRCode } = useTransferFlow();
  const { cancelKeystoneRequest } = useKeystoneRequestContext();
  const { colorMode } = useColorMode();

  const onCancel = useCallback(() => {
    // Cancel pending request and return to confirmation page
    cancelKeystoneRequest();
    goToConfirmation();
  }, [cancelKeystoneRequest, goToConfirmation]);

  return (
    <>
      <DrawerHeader borderBottomWidth="1px" px={4} position="relative">
        <Box position="absolute" top="0px" width="100%">
          <Text
            fontSize="3xl"
            fontWeight={600}
            position="absolute"
            bottom="1rem"
            color="white"
          >
            <FormattedMessage defaultMessage="Scan QR with Keystone" />
          </Text>
        </Box>
        <HStack spacing={4}>
          <Fade in>
            <Text>
              <FormattedMessage defaultMessage="Signature request" />
            </Text>
          </Fade>
        </HStack>
      </DrawerHeader>
      <DrawerBody
        py={4}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <KeystoneGenerateQR />
      </DrawerBody>
      <DrawerFooter
        borderTopColor={secondaryDividerColor[colorMode]}
        borderTopWidth="1px"
        display="grid"
        gridTemplateColumns="1fr 1fr"
        px={4}
        gap={4}
      >
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button colorScheme="salmon" type="button" onClick={goToScanQRCode}>
          Next
        </Button>
      </DrawerFooter>
    </>
  );
}
