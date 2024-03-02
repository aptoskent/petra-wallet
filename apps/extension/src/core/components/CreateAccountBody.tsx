// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { zxcvbnOptions } from '@zxcvbn-ts/core';
import { Button, useColorMode, VStack, Box } from '@chakra-ui/react';
import { passwordOptions } from './CreatePasswordBody';
import SecretRecoveryPhraseBody from './SecretRecoveryPhraseBody';
import Copyable from './Copyable';

zxcvbnOptions.setOptions(passwordOptions);

interface Props {
  isLoading: boolean;
  mnemonic: string;
}

const buttonBorderColor = {
  dark: 'gray.700',
  light: 'gray.200',
};

export const buttonBgColor = {
  dark: 'gray.800',
  light: 'white',
};

export default function CreateAccountBody({ isLoading, mnemonic }: Props) {
  const { colorMode } = useColorMode();
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <Box width="100%">
      <Box display="flex" width="100%" height="100%" px={4}>
        <SecretRecoveryPhraseBody />
      </Box>
      <VStack
        width="100%"
        spacing={2}
        pb={4}
        borderTop="1px"
        pt={4}
        px={4}
        borderColor={buttonBorderColor[colorMode]}
      >
        <Copyable value={mnemonic} width="100%" copiedPrompt="">
          <Button
            width="100%"
            type="submit"
            border="1px"
            bgColor={buttonBgColor[colorMode]}
            borderColor="navy.300"
            isLoading={isLoading}
            px={8}
            onClick={() => setCopied(true)}
          >
            {copied ? (
              <FormattedMessage defaultMessage="Copied" />
            ) : (
              <FormattedMessage defaultMessage="Copy" />
            )}
          </Button>
        </Copyable>
        <Button
          width="100%"
          colorScheme="salmon"
          type="submit"
          isLoading={isLoading}
          px={8}
        >
          <FormattedMessage defaultMessage="Create" />
        </Button>
      </VStack>
    </Box>
  );
}
