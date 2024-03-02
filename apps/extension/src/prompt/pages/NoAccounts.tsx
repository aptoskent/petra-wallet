// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Heading, Center, Box, Text, VStack } from '@chakra-ui/react';

import { PetraLogo } from 'core/components/PetraLogo';
import { useApprovalRequestContext } from '../hooks';

export default function NoAccounts() {
  const { reject } = useApprovalRequestContext();

  useEffect(() => {
    reject();
  }, [reject]);

  return (
    <VStack
      h="100%"
      w="100%"
      alignItems="center"
      justifyContent="center"
      padding={8}
    >
      <Center>
        <Box width="75px">
          <PetraLogo />
        </Box>
      </Center>
      <Heading textAlign="center">Petra</Heading>
      <Text textAlign="center" pb={8} fontSize="lg">
        <FormattedMessage defaultMessage="Please open the extension and create an account." />
      </Text>
    </VStack>
  );
}
