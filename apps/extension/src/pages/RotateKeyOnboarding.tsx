// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Routes } from 'core/routes';
import WalletLayout from 'core/layouts/WalletLayout';
import {
  VStack,
  Text,
  Flex,
  Link as ChakraLink,
  useColorMode,
  Button,
  Box,
} from '@chakra-ui/react';
import { collapseHexString } from '@petra/core/utils/hex';
import KeyIcon from 'core/svgs';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { secondaryTextColor, secondaryBorderColor } from '@petra/core/colors';

export default function RotateKeyOnboarding() {
  const { colorMode } = useColorMode();
  const { activeAccount } = useActiveAccount();
  const navigate = useNavigate();

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Rotate Key" />}
      showBackButton
      showAccountCircle={false}
      hasWalletFooter={false}
    >
      <Flex width="100%" height="100%" flexDirection="column">
        <VStack
          py={4}
          width="100%"
          spacing={4}
          px={4}
          alignContent="flex-start"
          flex={1}
        >
          <Flex width="100%" justifyContent="flex-start" pt={4}>
            <KeyIcon />
          </Flex>
          <Text width="100%" fontSize={20} fontWeight={700}>
            <FormattedMessage
              defaultMessage="Rotating Key for {account}"
              values={{ account: collapseHexString(activeAccount.address) }}
            />
          </Text>
          <Text width="100%" color={secondaryTextColor[colorMode]}>
            <FormattedMessage defaultMessage="On Aptos, you can rotate your private key while your account address stays the same. This increases the chances of keeping your assets safe." />
          </Text>
          <ChakraLink
            width="100%"
            onClick={() =>
              window.location.assign(
                'https://aptos.dev/concepts/basics-accounts/',
              )
            }
          >
            <Text
              as="u"
              color={secondaryTextColor[colorMode]}
              width="100%"
              textAlign="left"
            >
              <FormattedMessage defaultMessage="Learn more about key rotation" />
            </Text>
          </ChakraLink>
        </VStack>
        <Box
          width="100%"
          borderTop="1px"
          borderColor={secondaryBorderColor[colorMode]}
          px={4}
          paddingTop={4}
        >
          <Button
            py={6}
            color="white"
            colorScheme="salmon"
            width="100%"
            onClick={() => navigate(Routes.rotate_key_main.path)}
          >
            <FormattedMessage defaultMessage="Continue" />
          </Button>
        </Box>
      </Flex>
    </WalletLayout>
  );
}
