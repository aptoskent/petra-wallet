// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Button, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { RiExternalLinkLine } from '@react-icons/all-files/ri/RiExternalLinkLine';
import React, { PropsWithChildren, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { keystonePetraSyncTutorialUrl } from 'modules/keystone';
import {
  FullscreenExtensionContainer,
  FullscreenExtensionContainerBody,
  FullscreenExtensionContainerFooter,
  FullscreenExtensionContainerHeader,
} from '../layouts/ExtensionContainerLayout';

type ListItemProps = PropsWithChildren<{
  number: number;
}>;

function ListItem({ children, number }: ListItemProps) {
  return (
    <HStack
      w="100%"
      p="10px"
      border="1px"
      borderColor="navy.200"
      borderRadius={6}
      px={2}
      py={4}
      pr={8}
      spacing={2}
    >
      <Text
        w={30}
        fontSize="18px"
        fontWeight={600}
        flexShrink={0}
        textAlign="center"
        color="salmon.500"
      >
        {number}
      </Text>
      {children}
    </HStack>
  );
}

function makeHighlight(children: ReactNode[]) {
  return (
    <Text as="span" color="navy.900" fontWeight={600}>
      {children}
    </Text>
  );
}

export default function KeystoneSyncDevice() {
  const navigate = useNavigate();

  const onSyncClick = () => {
    navigate('/keystone/import');
  };

  return (
    <FullscreenExtensionContainer>
      <FullscreenExtensionContainerHeader
        title={
          <FormattedMessage defaultMessage="Import account from Keystone" />
        }
        hideBackButton
      />
      <FullscreenExtensionContainerBody>
        <VStack
          spacing="20px"
          color="navy.600"
          fontSize="14px"
          lineHeight="26px"
        >
          <ListItem number={1}>
            <Text>
              <FormattedMessage
                defaultMessage="Tap “<b>Connect Software Wallet</b>” at the bottom of the left drawer
                                on your Keystone device"
                description="First step of the Keystone import tutorial"
                values={{ b: makeHighlight }}
              />
            </Text>
          </ListItem>
          <ListItem number={2}>
            <Text>
              <FormattedMessage
                defaultMessage="Select “<b>Petra Aptos Wallet</b>”"
                description="Second step of the Keystone import tutorial"
                values={{ b: makeHighlight }}
              />
            </Text>
          </ListItem>
          <ListItem number={3}>
            <Text>
              <FormattedMessage
                defaultMessage="Click on the “<b>Sync Keystone</b>” button below to scan
                                the QR code displayed on your Keystone device."
                description="Third step of the Keystone import tutorial"
                values={{ b: makeHighlight }}
              />
            </Text>
          </ListItem>
          <Link
            alignSelf="start"
            color="green.700"
            fontWeight={500}
            href={keystonePetraSyncTutorialUrl}
            target="_blank"
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={1}
          >
            <FormattedMessage
              defaultMessage="View full tutorial"
              description="Link that leads to a step-by-step tutorial on how to
                          import accounts from a Keystone device"
            />
            <RiExternalLinkLine />
          </Link>
        </VStack>
      </FullscreenExtensionContainerBody>
      <FullscreenExtensionContainerFooter>
        <Button colorScheme="salmon" onClick={onSyncClick}>
          <FormattedMessage defaultMessage="Sync Keystone" />
        </Button>
      </FullscreenExtensionContainerFooter>
    </FullscreenExtensionContainer>
  );
}
