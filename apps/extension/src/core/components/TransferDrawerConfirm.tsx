// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  DrawerHeader,
  Box,
  HStack,
  Icon,
  Fade,
  DrawerBody,
  DrawerFooter,
  Grid,
  Button,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { secondaryDividerColor } from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { GiUsbKey } from '@react-icons/all-files/gi/GiUsbKey';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { transferAptFormId, useTransferFlow } from 'core/hooks/useTransferFlow';
import { QRIcon } from 'modules/keystone';
import TransferSummary from './TransferSummary';

export default function TransferDrawerConfirm() {
  const { colorMode } = useColorMode();
  const { canSubmitForm, formMethods, goToForm } = useTransferFlow();
  const { activeAccount } = useActiveAccount();
  const isLedger = activeAccount.type === 'ledger';
  const isKeystone = activeAccount.type === 'keystone';

  let rightIcon;
  if (isLedger) {
    rightIcon = <GiUsbKey />;
  } else if (isKeystone) {
    rightIcon = <Icon as={QRIcon} boxSize="14px" />;
  }

  const {
    formState: { isSubmitting },
  } = formMethods;

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
            <FormattedMessage defaultMessage="Confirm transaction" />
          </Text>
        </Box>
        <HStack spacing={4}>
          <Fade in>
            <Text>
              <FormattedMessage defaultMessage="Summary" />
            </Text>
          </Fade>
        </HStack>
      </DrawerHeader>
      <DrawerBody px={0} py={0}>
        <TransferSummary />
      </DrawerBody>
      <DrawerFooter
        borderTopColor={secondaryDividerColor[colorMode]}
        borderTopWidth="1px"
        px={4}
      >
        <Grid gap={4} width="100%" templateColumns="1fr 1fr">
          <Button variant="outline" onClick={goToForm}>
            <FormattedMessage defaultMessage="Back" />
          </Button>
          <Button
            isLoading={isSubmitting}
            isDisabled={!canSubmitForm}
            colorScheme="salmon"
            type="submit"
            form={transferAptFormId}
            rightIcon={rightIcon}
          >
            {isLedger ? (
              <FormattedMessage defaultMessage="Request" />
            ) : (
              <FormattedMessage defaultMessage="Send" />
            )}
          </Button>
        </Grid>
      </DrawerFooter>
    </>
  );
}
