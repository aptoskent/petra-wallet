// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Center, Grid, IconButton, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { secondaryHeaderBgColor } from '@petra/core/colors';
import Routes from 'core/routes';
import ChakraLink from './ChakraLink';

export default function HelpHeader() {
  const { colorMode } = useColorMode();
  const intl = useIntl();

  return (
    <Center
      maxW="100%"
      width="100%"
      py={2}
      bgColor={secondaryHeaderBgColor[colorMode]}
    >
      <Grid templateColumns="32px 1fr 32px" px={4} width="100%" gap={4}>
        <ChakraLink to={Routes.wallet.path}>
          <IconButton
            size="xs"
            borderRadius="full"
            aria-label={intl.formatMessage({ defaultMessage: 'go back' })}
            icon={<ChevronLeftIcon fontSize="md" />}
          />
        </ChakraLink>
        <Text fontSize="md" textAlign="center">
          <FormattedMessage defaultMessage="Help" />
        </Text>
      </Grid>
    </Center>
  );
}
