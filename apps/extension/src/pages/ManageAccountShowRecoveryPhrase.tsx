// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, VStack, Button, useColorMode } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import WalletLayout from 'core/layouts/WalletLayout';
import SecretRecoveryPhraseBody from 'core/components/SecretRecoveryPhraseBody';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import Copyable from 'core/components/Copyable';
import {
  buttonBorderColor,
  secondaryButtonBgColor,
  customColors,
} from '@petra/core/colors';
import { Routes } from 'core/routes';

interface LocationState {
  hasRotatedKey: boolean;
}

export default function ManageAccountShowRecoveryPhrase() {
  const { colorMode } = useColorMode();
  const { state } = useLocation();
  const { activeAccount } = useActiveAccount();
  const isLocalAccount = activeAccount.type === 'local';

  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: isLocalAccount
      ? {
          mnemonic: activeAccount?.mnemonic?.split(' '),
          mnemonicString: activeAccount?.mnemonic,
          showSecretRecoveryPhrase: false,
        }
      : {},
  });

  const hasRotatedKey = useMemo(
    () => (state as LocationState)?.hasRotatedKey,
    [state],
  );

  // This page is only available when the account is local
  if (!isLocalAccount) {
    return null;
  }

  return (
    <WalletLayout hasWalletFooter={false} showBackButton>
      <Box width="100%" height="100%" display="flex" flexDirection="column">
        <Box display="flex" width="100%" height="100%" px={4} flex={1}>
          <FormProvider {...methods}>
            <SecretRecoveryPhraseBody />
          </FormProvider>
        </Box>
        <VStack
          width="100%"
          spacing={2}
          borderTop="1px"
          p={4}
          borderColor={buttonBorderColor[colorMode]}
        >
          <Copyable
            prompt={
              <FormattedMessage defaultMessage="Copy secret recovery phrase" />
            }
            value={activeAccount.mnemonic}
            width="100%"
          >
            <Button
              width="100%"
              bgColor={secondaryButtonBgColor[colorMode]}
              border="1px"
              height="48px"
              borderColor={customColors.navy[200]}
            >
              <FormattedMessage defaultMessage="Copy" />
            </Button>
          </Copyable>
          {hasRotatedKey ? (
            <Box width="100%" display="flex" gap={2} flexDirection="column">
              <Button
                width="100%"
                colorScheme="salmon"
                height="48px"
                color="white"
                onClick={() => navigate(Routes.settings.path)}
              >
                <FormattedMessage defaultMessage="Back to settings" />
              </Button>
            </Box>
          ) : (
            <Box width="100%" display="flex" gap={2} flexDirection="column">
              <Button
                width="100%"
                type="submit"
                onClick={() => navigate(-1)}
                px={8}
                py={6}
                height="48px"
                border="1px"
                colorScheme="salmon"
              >
                <FormattedMessage defaultMessage="Done" />
              </Button>
            </Box>
          )}
        </VStack>
      </Box>
    </WalletLayout>
  );
}
