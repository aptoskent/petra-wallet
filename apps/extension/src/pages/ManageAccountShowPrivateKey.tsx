// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { VStack, Text, Flex, HStack, Box, Icon } from '@chakra-ui/react';
import { RiFileCopyLine } from '@react-icons/all-files/ri/RiFileCopyLine';
import Copyable from 'core/components/Copyable';
import WalletLayout from 'core/layouts/WalletLayout';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import SensitiveText from 'core/components/SensitiveText';

export default function ManageAccountShowPrivateKey() {
  const { activeAccount } = useActiveAccount();

  // This page is only available when the account is local
  if (activeAccount.type !== 'local') {
    return null;
  }

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Show Private Key" />}
      hasWalletFooter={false}
      showBackButton
    >
      <VStack width="100%" paddingTop={4} height="100%">
        <Flex
          px={4}
          pb={4}
          width="100%"
          flexDirection="column"
          gap={8}
          height="100%"
        >
          <Box width="100%" flex={1}>
            <Flex>
              <Text fontSize="lg" fontWeight={700} flex={1}>
                <FormattedMessage defaultMessage="Private Key" />
              </Text>
              <Copyable
                prompt={<FormattedMessage defaultMessage="Copy private key" />}
                value={activeAccount.privateKey}
              >
                <HStack alignItems="baseline">
                  <Box margin="auto">
                    <Icon
                      as={RiFileCopyLine}
                      my="auto"
                      w={4}
                      h={4}
                      margin="auto"
                    />
                  </Box>
                  <Text fontSize="sm" fontWeight={500}>
                    <FormattedMessage defaultMessage="Copy" />
                  </Text>
                </HStack>
              </Copyable>
            </Flex>
            <SensitiveText height={12} value={activeAccount.privateKey} />
          </Box>
        </Flex>
      </VStack>
    </WalletLayout>
  );
}
