// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  VStack,
  Flex,
  Tag,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Tooltip,
  useClipboard,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CredentialRow } from 'pages/Settings';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';

export interface CredentialHeaderAndBodyProps {
  body?: string;
  header: JSX.Element;
}

export function CredentialHeaderAndBody({
  body,
  header,
}: CredentialHeaderAndBodyProps) {
  const { hasCopied, onCopy } = useClipboard(body || '');
  return (
    <VStack spacing={2} maxW="100%" alignItems="flex-start">
      <Tag>{header}</Tag>
      <Tooltip
        label={
          hasCopied ? (
            <FormattedMessage defaultMessage="Copied!" />
          ) : (
            <FormattedMessage defaultMessage="Copy" />
          )
        }
        closeDelay={300}
      >
        <Text
          fontSize="sm"
          cursor="pointer"
          wordBreak="break-word"
          onClick={onCopy}
        >
          {body}
        </Text>
      </Tooltip>
    </VStack>
  );
}

export default function CredentialsBody() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { activeAccount } = useActiveAccount();
  const { address, publicKey } = activeAccount;
  const isLocalAccount = activeAccount.type === 'local';

  return (
    <>
      <Flex justifyContent="right">
        <Tag size="sm" onClick={onOpen} cursor="pointer">
          <FormattedMessage defaultMessage="View more" />
        </Tag>
        <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px" px={4}>
              <FormattedMessage defaultMessage="Credentials" />
            </DrawerHeader>
            <DrawerBody px={4}>
              <VStack mt={2} spacing={4} pb={8} alignItems="flex-start">
                {isLocalAccount ? (
                  <CredentialHeaderAndBody
                    header={<FormattedMessage defaultMessage="Private key" />}
                    body={activeAccount.privateKey}
                  />
                ) : null}
                <CredentialHeaderAndBody
                  header={<FormattedMessage defaultMessage="Public key" />}
                  body={publicKey}
                />
                <CredentialHeaderAndBody
                  header={<FormattedMessage defaultMessage="Address" />}
                  body={address}
                />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
      <VStack mt={2} spacing={2} alignItems="left">
        {isLocalAccount ? (
          <CredentialRow
            header={<FormattedMessage defaultMessage="Private key" />}
            body={activeAccount.privateKey}
          />
        ) : null}
        <CredentialRow
          header={<FormattedMessage defaultMessage="Public key" />}
          body={publicKey}
        />
        <CredentialRow
          header={<FormattedMessage defaultMessage="Address" />}
          body={address}
        />
      </VStack>
    </>
  );
}
