// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Center,
  Heading,
  VStack,
  Image,
  Flex,
  Box,
  Text,
  useColorMode,
  Button,
} from '@chakra-ui/react';
import {
  secondaryBorderColor,
  zeroStateHeadingColor,
  zeroStateTextColor,
} from '@petra/core/colors';
import WalletLayout from 'core/layouts/WalletLayout';
import { App, useConnectedApps } from '@petra/core/hooks/useConnectedApps';

function ConnectedAppsListItem({
  app,
  onRevoke,
}: {
  app: App;
  onRevoke: () => void;
}) {
  const { colorMode } = useColorMode();
  const borderColor = secondaryBorderColor[colorMode];

  return (
    <Flex
      borderBottom="1px"
      borderColor={borderColor}
      padding={4}
      align="center"
    >
      <Box>
        <Image
          boxSize="40px"
          border="1px"
          borderColor={borderColor}
          borderRadius="md"
          src={app.favicon}
        />
      </Box>
      <Box flex="1" px={4} overflowX="hidden" textOverflow="ellipsis">
        <Text as="b" whiteSpace="nowrap" fontSize="16px">
          {app.domain}
        </Text>
      </Box>
      <Box>
        <Button colorScheme="salmon" onClick={onRevoke}>
          <FormattedMessage defaultMessage="Revoke" />
        </Button>
      </Box>
    </Flex>
  );
}

function ConnectedAppsList({
  apps,
  onRevoke,
}: {
  apps: App[];
  onRevoke: (app: App) => void;
}) {
  return (
    <Flex direction="column">
      {apps.map((app) => (
        <ConnectedAppsListItem
          key={app.url}
          app={app}
          onRevoke={() => onRevoke(app)}
        />
      ))}
    </Flex>
  );
}

function ZeroState() {
  const { colorMode } = useColorMode();
  const headingColor = zeroStateHeadingColor[colorMode];
  const textColor = zeroStateTextColor[colorMode];

  return (
    <Center pt={24}>
      <VStack px={16} textAlign="center">
        <Heading as="h2" fontSize="24px" color={headingColor}>
          <FormattedMessage defaultMessage="No connected apps" />
        </Heading>
        <Text fontSize="16px" color={textColor}>
          <FormattedMessage defaultMessage="Apps connected to your Petra wallet will show up here." />
        </Text>
      </VStack>
    </Center>
  );
}

function ConnectedApps() {
  const { connectedApps, revokeApp } = useConnectedApps();

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Connected Apps" />}
      showBackButton
      showAccountCircle={false}
      hasWalletFooter={false}
    >
      {connectedApps.length > 0 ? (
        <ConnectedAppsList apps={connectedApps} onRevoke={revokeApp} />
      ) : (
        <ZeroState />
      )}
    </WalletLayout>
  );
}

export default ConnectedApps;
