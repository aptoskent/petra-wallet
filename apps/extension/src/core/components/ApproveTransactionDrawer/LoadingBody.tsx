// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function LoadingBody() {
  return (
    <VStack
      width="100%"
      height="100%"
      bgColor="navy.900"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <img src="./loader.webp" alt="logo" height="80px" width="80px" />
      <Text
        as="div"
        fontSize="2xl"
        fontWeight={700}
        textAlign="center"
        color="white"
      >
        <FormattedMessage defaultMessage="Waiting for confirmed details" />
      </Text>
      <Text as="div" fontSize="md" textAlign="center" color="white">
        <FormattedMessage defaultMessage="The transaction has been sent" />
      </Text>
    </VStack>
  );
}
