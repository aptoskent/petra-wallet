// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export interface ErrorBodyProps {
  error: Error;
  errorMessage: JSX.Element;
  onClose: () => void;
}

export default function ErrorBody({
  error,
  errorMessage,
  onClose,
}: ErrorBodyProps) {
  return (
    <VStack width="100%" height="100%" bgColor="navy.900">
      <VStack flex={1} justifyContent="center" gap={4}>
        <img
          src="./error-animated.webp"
          alt="logo"
          height="80px"
          width="80px"
        />
        <Text
          color="white"
          textAlign="center"
          fontWeight={700}
          as="div"
          fontSize="lg"
          px={8}
        >
          {errorMessage}
        </Text>
        <Text
          as="div"
          color="white"
          textAlign="center"
          fontSize="md"
          width="100%"
          overflow="auto"
        >
          {error.message}
        </Text>
      </VStack>
      <HStack width="full" p={4}>
        <Button
          width="100%"
          height="48px"
          size="md"
          color="white"
          _hover={{
            bgColor: 'salmon.300',
          }}
          bgColor="salmon.500"
          onClick={onClose}
        >
          <FormattedMessage defaultMessage="Close" />
        </Button>
      </HStack>
    </VStack>
  );
}
