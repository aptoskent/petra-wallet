// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Button,
  Flex,
  Text,
  useColorMode,
  Box,
  Icon,
  VStack,
} from '@chakra-ui/react';
import {
  useActiveAccount,
  useUnlockedAccounts,
} from '@petra/core/hooks/useAccounts';
import { collapseHexString } from '@petra/core/utils/hex';
import { RiErrorWarningFill } from '@react-icons/all-files/ri/RiErrorWarningFill';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  removeAccountErrorToast,
  removeAccountToast,
} from 'core/components/Toast';
import { Routes } from 'core/routes';
import WalletLayout from 'core/layouts/WalletLayout';
import { useAnalytics } from 'core/hooks/useAnalytics';
import { removeAccountEvents } from '@petra/core/utils/analytics/events';
import { customColors } from '@petra/core/colors';

const buttonBorderColor = {
  dark: 'gray.700',
  light: 'gray.200',
};

export default function RemoveAccount() {
  const activeAccount = useActiveAccount();
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { removeAccounts } = useUnlockedAccounts();
  const { trackEvent } = useAnalytics();
  const intl = useIntl();

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await removeAccounts([activeAccount.activeAccountAddress]);
      const removedAddress = `${activeAccount.activeAccountAddress.slice(
        0,
        4,
      )}...${activeAccount.activeAccountAddress.slice(62)}`;
      removeAccountToast(
        intl.formatMessage(
          { defaultMessage: 'Successfully removed account {account}' },
          { account: removedAddress },
        ),
      );
      trackEvent({ eventType: removeAccountEvents.REMOVE_ACCOUNT });
      navigate(Routes.wallet.path);
    } catch (err) {
      removeAccountErrorToast();
      trackEvent({
        eventType: removeAccountEvents.ERROR_REMOVE_ACCOUNT,
      });
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    navigate(Routes.settings.path);
  };

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Remove Account" />}
      showBackButton
      hasWalletFooter={false}
    >
      <VStack spacing={2} alignItems="center" height="100%">
        <VStack px={10} flex={1} justifyContent="center" minHeight="320px">
          <Box
            alignItems="center"
            justifyItems="center"
            borderRadius={200}
            bgColor="rgba(244, 169, 153, 0.2)"
            width={16}
            height={16}
            padding={2}
          >
            <Icon
              as={RiErrorWarningFill}
              width="100%"
              height="100%"
              color={customColors.salmon[500]}
              size={28}
            />
          </Box>
          <Text fontWeight={700} fontSize={18}>
            <FormattedMessage
              defaultMessage="Remove {account}  ?"
              values={{
                account: collapseHexString(activeAccount.activeAccountAddress),
              }}
            />
          </Text>
          <Text textAlign="center" fontSize={17}>
            <FormattedMessage defaultMessage="Although you are removing this from your Aptos wallet, you'll be able to retrieve if using your mnemonic phrase." />
          </Text>
        </VStack>
        <Flex
          width="100%"
          justify="flex-end"
          alignItems="center"
          px={4}
          py={4}
          borderTop="1px"
          borderColor={buttonBorderColor[colorMode]}
        >
          <VStack width="100%">
            <Button
              width="100%"
              height="48px"
              colorScheme="salmon"
              onClick={handleRemove}
            >
              <FormattedMessage defaultMessage="Remove" />
            </Button>
            <Button width="100%" height="48px" onClick={handleCancel}>
              <FormattedMessage defaultMessage="Cancel" />
            </Button>
          </VStack>
        </Flex>
      </VStack>
    </WalletLayout>
  );
}
