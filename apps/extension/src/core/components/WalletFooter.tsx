// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Center,
  IconButton,
  SimpleGrid,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { IoGrid } from '@react-icons/all-files/io5/IoGrid';
import { RiHome2Fill } from '@react-icons/all-files/ri/RiHome2Fill';
import { RiFlashlightFill } from '@react-icons/all-files/ri/RiFlashlightFill';
import { RiSettings4Fill } from '@react-icons/all-files/ri/RiSettings4Fill';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import Routes from 'core/routes';
import { secondaryBorderColor } from '@petra/core/colors';
import ChakraLink from './ChakraLink';

const secondaryIconColor = {
  dark: 'whiteAlpha.500',
  light: 'blackAlpha.500',
};

const secondaryIconUnpressedColor = {
  dark: 'salmon.500',
  light: 'salmon.500',
};

const iconSize = 24;

export default function WalletFooter() {
  const { colorMode } = useColorMode();
  const { pathname } = useLocation();
  const intl = useIntl();

  return (
    <Center
      height="60px"
      flexShrink={0}
      maxW="100%"
      width="100%"
      borderTopWidth="1px"
      borderTopColor={secondaryBorderColor[colorMode]}
    >
      <SimpleGrid width="100%" gap={0} columns={4}>
        <Center flexDir="column" width="100%">
          <ChakraLink
            display="flex"
            flexDir="column"
            alignItems="center"
            to={Routes.wallet.path}
          >
            <IconButton
              color={
                pathname.includes(Routes.wallet.path)
                  ? secondaryIconUnpressedColor[colorMode]
                  : secondaryIconColor[colorMode]
              }
              variant="unstyled"
              size="md"
              aria-label="Wallet"
              fontSize="xl"
              icon={<RiHome2Fill size={iconSize} />}
              display="flex"
              height="20px"
            />
            <Text
              fontWeight={600}
              color={
                pathname.includes(Routes.wallet.path)
                  ? secondaryIconUnpressedColor[colorMode]
                  : secondaryIconColor[colorMode]
              }
              pt={1}
              fontSize="10px"
            >
              <FormattedMessage defaultMessage="Home" />
            </Text>
          </ChakraLink>
        </Center>
        <Center flexDir="column" width="100%">
          <ChakraLink
            display="flex"
            flexDir="column"
            alignItems="center"
            to={Routes.gallery.path}
          >
            <IconButton
              color={
                pathname.includes(Routes.gallery.path) ||
                pathname.includes('/tokens')
                  ? secondaryIconUnpressedColor[colorMode]
                  : secondaryIconColor[colorMode]
              }
              variant="unstyled"
              size="md"
              aria-label={intl.formatMessage({ defaultMessage: 'Gallery' })}
              icon={<IoGrid size={iconSize} />}
              fontSize="xl"
              display="flex"
              height="20px"
            />
            <Text
              fontWeight={600}
              color={
                pathname.includes(Routes.gallery.path) ||
                pathname.includes('/tokens')
                  ? secondaryIconUnpressedColor[colorMode]
                  : secondaryIconColor[colorMode]
              }
              pt={1}
              fontSize="10px"
            >
              <FormattedMessage defaultMessage="Library" />
            </Text>
          </ChakraLink>
        </Center>
        <Center flexDir="column" width="100%">
          <ChakraLink
            display="flex"
            flexDir="column"
            alignItems="center"
            to={Routes.activity.path}
          >
            <IconButton
              color={
                pathname.includes(Routes.activity.path) ||
                pathname.includes('/transactions') ||
                pathname.includes('/accounts')
                  ? secondaryIconUnpressedColor[colorMode]
                  : secondaryIconColor[colorMode]
              }
              variant="unstyled"
              size="md"
              aria-label={intl.formatMessage({ defaultMessage: 'Activity' })}
              icon={<RiFlashlightFill size={iconSize} />}
              fontSize="xl"
              display="flex"
              height="20px"
            />
            <Text
              fontWeight={600}
              color={
                pathname.includes(Routes.activity.path) ||
                pathname.includes('/transactions') ||
                pathname.includes('/accounts')
                  ? secondaryIconUnpressedColor[colorMode]
                  : secondaryIconColor[colorMode]
              }
              pt={1}
              fontSize="10px"
            >
              <FormattedMessage defaultMessage="Activity" />
            </Text>
          </ChakraLink>
        </Center>
        <Center flexDir="column" width="100%">
          <ChakraLink
            display="flex"
            flexDir="column"
            alignItems="center"
            to={Routes.settings.path}
          >
            <IconButton
              color={
                pathname.includes(Routes.settings.path)
                  ? secondaryIconUnpressedColor[colorMode]
                  : secondaryIconColor[colorMode]
              }
              variant="unstyled"
              size="md"
              aria-label={intl.formatMessage({ defaultMessage: 'Account' })}
              icon={<RiSettings4Fill fontSize={iconSize} />}
              fontSize="xl"
              display="flex"
              height="20px"
            />
            <Text
              fontWeight={600}
              color={
                pathname.includes(Routes.settings.path)
                  ? secondaryIconUnpressedColor[colorMode]
                  : secondaryIconColor[colorMode]
              }
              pt={1}
              fontSize="10px"
            >
              <FormattedMessage defaultMessage="Settings" />
            </Text>
          </ChakraLink>
        </Center>
      </SimpleGrid>
    </Center>
  );
}
