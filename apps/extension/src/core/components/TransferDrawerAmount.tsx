// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Grid,
  HStack,
  Input,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  secondaryTextColor,
  secondaryErrorMessageColor,
  secondaryDividerColor,
} from '@petra/core/colors';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import collapseHexString from '@petra/core/utils/hex';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useTransferFlow } from 'core/hooks/useTransferFlow';
import TransferAvatar from './TransferAvatar';
import TransferInput from './TransferInput';

export default function TransferDrawerAmount() {
  const { colorMode } = useColorMode();
  const {
    canSubmitForm,
    closeDrawer,
    doesRecipientAccountExist,
    formMethods,
    goToConfirmation,
    isLoading,
    recipientAddress,
    recipientName,
  } = useTransferFlow();
  const getExplorerAddress = useExplorerAddress();
  const intl = useIntl();

  const {
    formState: { isSubmitting },
    register,
  } = formMethods;
  const explorerAddress = getExplorerAddress(`account/${recipientAddress}`);
  const explorerLinkText =
    recipientName !== undefined && recipientAddress !== undefined ? (
      collapseHexString(recipientAddress, 12)
    ) : (
      <FormattedMessage defaultMessage="View on explorer" />
    );

  return (
    <>
      <DrawerHeader borderBottomWidth="1px" px={4} position="relative">
        <Box position="absolute" top="0px" width="100%">
          <Text
            fontSize="3xl"
            fontWeight={600}
            position="absolute"
            bottom="1rem"
            color="white"
          >
            <FormattedMessage defaultMessage="Add an address and amount" />
          </Text>
        </Box>
        <HStack spacing={4}>
          <TransferAvatar
            doesRecipientAccountExist={doesRecipientAccountExist}
            recipient={recipientAddress}
          />
          <VStack
            boxSizing="border-box"
            spacing={0}
            alignItems="flex-start"
            flexGrow={1}
          >
            <Input
              pb={1}
              variant="unstyled"
              size="sm"
              fontWeight={600}
              autoComplete="off"
              spellCheck="false"
              placeholder={intl.formatMessage({
                defaultMessage: 'Please enter an address',
              })}
              {...register('recipient')}
            />
            {doesRecipientAccountExist ? (
              <Button
                color={secondaryTextColor[colorMode]}
                fontSize="sm"
                fontWeight={400}
                height="24px"
                as="a"
                target="_blank"
                rightIcon={<ExternalLinkIcon />}
                variant="unstyled"
                cursor="pointer"
                href={explorerAddress}
                tabIndex={-1}
              >
                {explorerLinkText}
              </Button>
            ) : (
              <Button
                color={
                  doesRecipientAccountExist
                    ? secondaryTextColor[colorMode]
                    : secondaryErrorMessageColor[colorMode]
                }
                fontSize="sm"
                fontWeight={400}
                height="24px"
                variant="unstyled"
                cursor="default"
              >
                {recipientAddress ? (
                  <FormattedMessage defaultMessage="Account not found, will be created" />
                ) : (
                  <FormattedMessage defaultMessage="Invalid address" />
                )}
              </Button>
            )}
          </VStack>
        </HStack>
      </DrawerHeader>
      <DrawerBody px={0} py={0}>
        <TransferInput />
      </DrawerBody>
      <DrawerFooter
        borderTopColor={secondaryDividerColor[colorMode]}
        borderTopWidth="1px"
        px={4}
      >
        <Grid gap={4} width="100%" templateColumns="1fr 1fr">
          <Button variant="outline" onClick={closeDrawer}>
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button
            isLoading={isLoading || isSubmitting}
            isDisabled={!canSubmitForm}
            colorScheme="salmon"
            onClick={goToConfirmation}
          >
            <FormattedMessage defaultMessage="Next" />
          </Button>
        </Grid>
      </DrawerFooter>
    </>
  );
}
