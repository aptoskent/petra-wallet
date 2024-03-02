// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import WalletLayout from 'core/layouts/WalletLayout';
import {
  HStack,
  VStack,
  Text,
  useColorMode,
  Switch,
  useDisclosure,
} from '@chakra-ui/react';
import SetTokenDirectTransferDrawer from 'core/components/SetTokenDirectTransferDrawer';
import { secondaryTextColor } from '@petra/core/colors';
import useTokenStoreResource from '@petra/core/queries/useTokenStoreResource';

function DirectTransferTokenSettings() {
  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const tokenStoreQuery = useTokenStoreResource();

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Receiving NFTs" />}
      showBackButton
      showAccountCircle={false}
      hasWalletFooter={false}
    >
      {tokenStoreQuery.isError ? (
        <VStack width="100%" height="100%" justifyContent="center" p={4}>
          <img
            src="./error-animated.webp"
            alt="logo"
            height="80px"
            width="80px"
          />
          <Text as="div" color={secondaryTextColor[colorMode]} fontSize={16}>
            <FormattedMessage defaultMessage="Failed to fetch user's on-chain data. Please refresh and try again" />
          </Text>
        </VStack>
      ) : null}
      {tokenStoreQuery.isLoading ? (
        <VStack p={4} width="100%" height="100%" justifyContent="center">
          <img src="./loader.webp" alt="logo" height="80px" width="80px" />
          <Text as="div" color={secondaryTextColor[colorMode]} fontSize={16}>
            <FormattedMessage defaultMessage="Loading user's on-chain data. Please wait..." />
          </Text>
        </VStack>
      ) : (
        <VStack p={4} width="100%" alignItems="start">
          <HStack width="100%">
            <Text flex={1} as="div" fontWeight={700} fontSize={16}>
              <FormattedMessage defaultMessage="Allow anyone to send you NFTs" />
            </Text>
            <Switch
              size="md"
              colorScheme="green"
              isChecked={tokenStoreQuery.data?.data.direct_transfer}
              onChange={onOpen}
              isDisabled={tokenStoreQuery.isLoading}
            />
          </HStack>
          <Text as="div" color={secondaryTextColor[colorMode]} fontSize={12}>
            <FormattedMessage defaultMessage="Other people can automatically airdrop NFTs into your wallet without you needing to accept them." />
          </Text>
        </VStack>
      )}
      <SetTokenDirectTransferDrawer isOpen={isOpen} onClose={onClose} />
    </WalletLayout>
  );
}

export default DirectTransferTokenSettings;
