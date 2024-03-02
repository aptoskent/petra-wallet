// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  VStack,
  Heading,
  Flex,
  Text,
  Button,
  useColorMode,
} from '@chakra-ui/react';
import Routes from 'core/routes';
import { newExtensionBgColor } from '@petra/core/colors';
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { DesktopOnboardingContext } from 'onboarding/components/DesktopOnboarding';
import { PetraLogo } from './PetraLogo';

export default function NewExtensionBody() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { setIsDesktopOnboarding } = useContext(DesktopOnboardingContext);
  const isInDesktopOnboarding = window.location.pathname.includes('onboarding');

  const handleClickCreateNewWallet = () => {
    navigate(Routes.createWallet.path);
    if (isInDesktopOnboarding) {
      setIsDesktopOnboarding(true);
    }
  };

  const handleClickImportWallet = () => {
    navigate(Routes.createWalletViaImportAccount.path);
    if (isInDesktopOnboarding) {
      setIsDesktopOnboarding(true);
    }
  };

  return (
    <VStack height="100%">
      <Flex w="100%" flexDir="column" height="100%">
        <Flex w="100%" flexDir="column" flex={1}>
          <VStack w="100%" margin="auto">
            <Box width="86px" pb={5}>
              <PetraLogo />
            </Box>
            <Heading size="lg" fontWeight={700} color="white">
              <FormattedMessage defaultMessage="Welcome to Petra" />
            </Heading>
            <Text pb={10} pt={2} fontSize="md" color="white">
              <FormattedMessage defaultMessage="Guiding your web3 journey." />
            </Text>
          </VStack>
        </Flex>
        <VStack spacing={4}>
          <Button
            colorScheme="salmon"
            color="white"
            variant="solid"
            width="100%"
            height={14}
            onClick={handleClickCreateNewWallet}
          >
            <Text fontSize="xl">
              <FormattedMessage defaultMessage="Create New Wallet" />
            </Text>
          </Button>
          <Button
            variant="solid"
            width="100%"
            height={14}
            bgColor={newExtensionBgColor[colorMode]}
            border="1px"
            borderColor="white"
            color="white"
            onClick={handleClickImportWallet}
          >
            <Text fontSize="xl">
              <FormattedMessage defaultMessage="Import Wallet" />
            </Text>
          </Button>
        </VStack>
      </Flex>
    </VStack>
  );
}
