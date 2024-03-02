// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { Button, Image, Text, useColorMode, VStack } from '@chakra-ui/react';
import { secondaryTextColor } from '@petra/core/colors';
import React from 'react';
import { imgKeystoneSuccess } from 'modules/keystone';
import {
  FullscreenExtensionContainer,
  FullscreenExtensionContainerBody,
} from '../layouts/ExtensionContainerLayout';

export default function KeystoneImportSuccess() {
  const { colorMode } = useColorMode();
  const onClose = () => {
    window.close();
  };

  return (
    <FullscreenExtensionContainer>
      <FullscreenExtensionContainerBody>
        <VStack
          height="100%"
          fontSize={18}
          lineHeight="26px"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
          spacing={8}
        >
          <Image src={imgKeystoneSuccess} w="96px" h="96px" />
          <Text fontWeight={600} fontSize={24}>
            Import Successful
          </Text>
          <Text
            fontSize={18}
            lineHeight="26px"
            color={secondaryTextColor[colorMode]}
          >
            Head over to the Petra Extension to manage your Keystone accounts
          </Text>
          <Button onClick={onClose}>Close window</Button>
        </VStack>
      </FullscreenExtensionContainerBody>
    </FullscreenExtensionContainer>
  );
}
