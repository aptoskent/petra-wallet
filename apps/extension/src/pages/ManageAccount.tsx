// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { HexString } from 'aptos';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import WalletLayout from 'core/layouts/WalletLayout';
import {
  VStack,
  Button,
  Text,
  Input,
  useColorMode,
  Box,
  HStack,
  Flex,
  Icon,
  ButtonGroup,
  Spinner,
} from '@chakra-ui/react';
import { RiRotateLockFill } from '@react-icons/all-files/ri/RiRotateLockFill';
import { RiFileCopyLine } from '@react-icons/all-files/ri/RiFileCopyLine';
import { RiCheckboxCircleLine } from '@react-icons/all-files/ri/RiCheckboxCircleLine';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import Copyable from 'core/components/Copyable';
import {
  secondaryTextColor,
  buttonBorderColor,
  secondaryButtonBgColor,
  customColors,
} from '@petra/core/colors';
import { useNavigate } from 'react-router-dom';
import Routes from 'core/routes';
import SensitiveText from 'core/components/SensitiveText';
import {
  ledgerVerifyErrorToast,
  ledgerVerifyPendingToast,
  ledgerVerifySuccessToast,
} from 'core/components/Toast';
import { makeLedgerClient } from 'shared/signer/ledger';

export function RotateKey() {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const handleRotateKey = async () => {
    navigate(Routes.rotate_key_onboarding.path);
  };
  return (
    <Button
      size="sm"
      onClick={handleRotateKey}
      bgColor={secondaryButtonBgColor[colorMode]}
      border="1px"
      borderColor={customColors.navy[200]}
      leftIcon={<RiRotateLockFill />}
    >
      Rotate key
    </Button>
  );
}

export default function ManageAccount() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { activeAccount } = useActiveAccount();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const isVerifiableAccount = activeAccount.type === 'ledger';

  const onVerifyClick = async () => {
    if (!isVerifiableAccount) {
      return;
    }

    ledgerVerifyPendingToast();
    setIsVerifying(true);

    let ledgerClient;
    try {
      ledgerClient = await makeLedgerClient(activeAccount.transport);
      const { publicKey } = await ledgerClient.getAccount(
        activeAccount.hdPath,
        true,
      );
      const publicKeyHex = HexString.fromUint8Array(publicKey).toString();
      if (publicKeyHex === activeAccount.publicKey) {
        ledgerVerifySuccessToast();
      } else {
        ledgerVerifyErrorToast();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      ledgerVerifyErrorToast();
    } finally {
      await ledgerClient?.transport.close();
    }
    setIsVerifying(false);
  };

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Manage Account" />}
      showBackButton
      showAccountCircle={false}
      hasWalletFooter={false}
    >
      <VStack py={4} height="100%" spacing={4} px={4}>
        {activeAccount.type === 'local' && activeAccount.mnemonic && (
          <VStack
            width="100%"
            borderBottom="1px"
            borderColor={buttonBorderColor[colorMode]}
            paddingBottom={4}
          >
            <HStack alignContent="center" width="100%">
              <Text fontSize="16" fontWeight={700} flex={1}>
                <FormattedMessage defaultMessage="Show secret recovery phrase" />
              </Text>
              <Button
                size="sm"
                bgColor={secondaryButtonBgColor[colorMode]}
                border="1px"
                borderColor={customColors.navy[200]}
                onClick={() =>
                  navigate(Routes.manage_account_show_recovery_phrase.path)
                }
              >
                <FormattedMessage defaultMessage="Show" />
              </Button>
            </HStack>
          </VStack>
        )}
        {activeAccount.type === 'local' ? (
          <Box
            width="100%"
            borderBottom="1px"
            borderColor={buttonBorderColor[colorMode]}
            paddingBottom={8}
          >
            <HStack alignItems="flex-start" width="100%">
              <Text fontSize={16} fontWeight={700} flex={1} minWidth={24}>
                <FormattedMessage defaultMessage="Private Key" />
              </Text>
              <Input
                marginTop={4}
                color={secondaryTextColor[colorMode]}
                bgColor={secondaryButtonBgColor[colorMode]}
                size="xs"
                type="password"
                readOnly
                variant="filled"
                fontSize={16}
                value={activeAccount.privateKey}
              />
            </HStack>
            <Flex marginTop={4} justifyContent="flex-end">
              <ButtonGroup>
                <Button
                  size="sm"
                  bgColor={secondaryButtonBgColor[colorMode]}
                  onClick={() =>
                    navigate(Routes.manage_account_show_private_key.path)
                  }
                >
                  <FormattedMessage defaultMessage="Show" />
                </Button>
              </ButtonGroup>
            </Flex>
          </Box>
        ) : null}
        <Box width="100%">
          <Flex>
            <Text fontSize="md" fontWeight={700} flex={1}>
              <FormattedMessage defaultMessage="Wallet Address" />
            </Text>
            <HStack>
              {isVerifiableAccount ? (
                <HStack
                  onClick={onVerifyClick}
                  alignItems="center"
                  cursor="pointer"
                >
                  <Text fontSize={13} fontWeight={500}>
                    <FormattedMessage defaultMessage="Verify" />
                  </Text>
                  {isVerifying ? (
                    <Spinner size="sm" />
                  ) : (
                    <Icon
                      as={RiCheckboxCircleLine}
                      my="auto"
                      w={4}
                      h={4}
                      margin="auto"
                    />
                  )}
                </HStack>
              ) : null}
              <Copyable
                prompt={<FormattedMessage defaultMessage="Copy address" />}
                value={activeAccount.address}
              >
                <HStack alignItems="center">
                  <Text fontSize={13} fontWeight={500}>
                    Copy
                  </Text>
                  <Icon
                    as={RiFileCopyLine}
                    my="auto"
                    w={4}
                    h={4}
                    margin="auto"
                  />
                </HStack>
              </Copyable>
            </HStack>
          </Flex>
          <SensitiveText height={12} value={activeAccount.address} />
          <Text
            py={2}
            textColor={secondaryTextColor[colorMode]}
            fontSize="xs"
            alignSelf="start"
          >
            <FormattedMessage defaultMessage="This is what you use to receive funds." />
          </Text>
        </Box>
      </VStack>
    </WalletLayout>
  );
}
