// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Input, HStack, Button, useColorMode, VStack } from '@chakra-ui/react';
import {
  secondaryTextColor,
  secondaryErrorMessageColor,
} from '@petra/core/colors';
import { useAccountExists } from '@petra/core/queries/account';
import { useFormContext } from 'react-hook-form';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import { useAddressFromName } from '@petra/core/queries/useNameAddress';
import {
  isAptosName,
  isAddressValid,
  formatAddress,
} from '@petra/core/utils/address';
import { AptosName } from '@petra/core/utils/names';
import collapseHexString from '@petra/core/utils/hex';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import TransferAvatar from './TransferAvatar';

function TransferHeader() {
  const { register, setValue, watch } = useFormContext<any>();
  const recipient = watch('recipient');
  const { colorMode } = useColorMode();
  const intl = useIntl();

  const nameAddressEnabled = recipient !== undefined && isAptosName(recipient);
  const nameAddress = useAddressFromName(
    nameAddressEnabled ? new AptosName(recipient) : new AptosName(''),
    {
      enabled: nameAddressEnabled,
    },
  );

  let recipientAddress: string | undefined;
  if (!nameAddress.isLoading) {
    if (nameAddress.data) {
      recipientAddress = nameAddress.data;
    } else if (isAddressValid(recipient)) {
      recipientAddress = formatAddress(recipient);
    }
  }

  const { data: doesRecipientAccountExist } = useAccountExists({
    address: recipientAddress,
  });

  useEffect(() => {
    setValue('recipientAddress', recipientAddress);
    setValue('doesRecipientAccountExist', doesRecipientAccountExist);
  }, [setValue, recipientAddress, doesRecipientAccountExist]);

  const getExplorerAddress = useExplorerAddress();
  const explorerAddress = getExplorerAddress(`account/${recipientAddress}`);
  const explorerLinkText =
    recipientAddress !== undefined ? (
      collapseHexString(recipientAddress, 12)
    ) : (
      <FormattedMessage defaultMessage="View on explorer" />
    );
  return (
    <HStack spacing={4} width="100%">
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
            whiteSpace="nowrap"
            width="220px"
            overflow="auto"
            textOverflow="ellipsis"
            justifyContent="flex-start"
            display="flex"
          >
            {recipientAddress ? (
              <FormattedMessage defaultMessage="Account not found." />
            ) : (
              <FormattedMessage defaultMessage="Invalid address" />
            )}
          </Button>
        )}
      </VStack>
    </HStack>
  );
}

export default TransferHeader;
