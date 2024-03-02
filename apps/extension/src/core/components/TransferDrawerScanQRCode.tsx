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
import { KeystoneScanQR } from 'modules/keystone';

export default function TransferDrawerScanQRCode() {
  const { goToConfirmation, goToGenerateQRCode } = useTransferFlow();
  const { colorMode } = useColorMode();

  const onDone = useCallback(() => {
    goToConfirmation();
  }, [goToConfirmation]);

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
            <FormattedMessage defaultMessage="Scan QR from Keystone" />
          </Text>
        </Box>
        <HStack spacing={4}>
          <Fade in>
            <Text>
              <FormattedMessage defaultMessage="Signature retrieval" />
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
        <KeystoneScanQR onDone={onDone} />
      </DrawerBody>
      <DrawerFooter
        borderTopColor={secondaryDividerColor[colorMode]}
        borderTopWidth="1px"
        px={4}
      >
        <Button w="100%" variant="outline" onClick={goToGenerateQRCode}>
          Back
        </Button>
      </DrawerFooter>
    </>
  );
}
