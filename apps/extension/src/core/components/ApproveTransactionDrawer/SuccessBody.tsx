// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface SuccessBodyProps {
  onClose: () => void;
  successDescription: JSX.Element;
  txnHash: string;
}

export default function SuccessBody({
  onClose,
  successDescription,
  txnHash,
}: SuccessBodyProps) {
  const getExplorerAddress = useExplorerAddress();

  return (
    <VStack width="100%" height="100%" bgColor="navy.900">
      <VStack flex={1} justifyContent="center" gap={4}>
        <img
          src="./check-animated.webp"
          alt="logo"
          height="80px"
          width="80px"
        />
        <Text
          textAlign="center"
          fontWeight={700}
          as="div"
          fontSize="2xl"
          color="white"
          px={4}
        >
          {successDescription}
        </Text>
      </VStack>
      <HStack width="full" p={4}>
        <Button
          width="100%"
          height="48px"
          size="md"
          border="1px"
          fontWeight={700}
          bgColor="navy.900"
          _hover={{
            bgColor: 'navy.700',
          }}
          color="white"
          borderColor="white"
          rel="noreferrer"
          as="a"
          target="_blank"
          cursor="pointer"
          href={getExplorerAddress(`txn/${txnHash}`)}
        >
          <FormattedMessage defaultMessage="View Details" />
        </Button>
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
