// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Alert,
  AlertDescription,
  AlertIcon,
  HStack,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import WalletLayout from 'core/layouts/WalletLayout';
import WalletAccountBalance from 'core/components/WalletAccountBalance';
import Faucet from 'core/components/Faucet';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { walletBgColor, walletTextColor } from 'core/colorHelpers';
import { useNodeStatus } from '@petra/core/queries/network';
import TransferFlow from 'core/components/TransferFlow';
import { useLocation, useNavigate } from 'react-router-dom';
import WalletAssets from 'core/components/WalletAssets';
import WalletRecentTransactions from 'core/components/WalletRecentTransactions';
import UpDownArrowsIconSVG from 'core/components/UpDownArrowsIconSVG';
import { AiFillCreditCard } from '@react-icons/all-files/ai/AiFillCreditCard';
import Routes from 'core/routes';
import { useFlag } from '@petra/core/flags';
import { FormattedMessage } from 'react-intl';

function BuyButton() {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(Routes.buy.path);
  };

  return (
    <Button
      leftIcon={<AiFillCreditCard />}
      onClick={onClick}
      backgroundColor="whiteAlpha.200"
      width="100%"
      _hover={{
        backgroundColor: 'whiteAlpha.300',
      }}
      _active={{
        backgroundColor: 'whiteAlpha.400',
      }}
      color="white"
      variant="solid"
    >
      <FormattedMessage defaultMessage="Buy" />
    </Button>
  );
}

function SwapButton() {
  const onClick = () =>
    // to be implemented
    // navigate(Routes.swapCoins.path);
    null;

  return (
    <Button
      leftIcon={<UpDownArrowsIconSVG color="white" />}
      onClick={onClick}
      backgroundColor="whiteAlpha.200"
      width="100%"
      _hover={{
        backgroundColor: 'whiteAlpha.300',
      }}
      _active={{
        backgroundColor: 'whiteAlpha.400',
      }}
      color="white"
      variant="solid"
    >
      <FormattedMessage
        defaultMessage="Swap"
        description="Button label for coin swap in Wallet main screen"
      />
    </Button>
  );
}

function Wallet() {
  const { activeNetwork, hasFaucet } = useNetworks();
  const { pathname } = useLocation();
  const isCoinSwapEnabled = useFlag('coin-swap');

  const { isNodeAvailable } = useNodeStatus(activeNetwork.nodeUrl, {
    refetchInterval: 5000,
  });

  const bgColor = useMemo(() => walletBgColor(pathname), [pathname]);
  const textColor = useMemo(() => walletTextColor(pathname), [pathname]);

  return (
    <WalletLayout title={<FormattedMessage defaultMessage="Home" />}>
      <VStack pb={4} spacing={4} alignItems="stretch">
        <VStack
          py={4}
          px={4}
          color={textColor}
          bgColor={bgColor}
          alignItems="stretch"
        >
          <WalletAccountBalance />
          <HStack alignItems="stretch" spacing={1} pt={4}>
            {hasFaucet && <Faucet />}
            <TransferFlow />
            {activeNetwork.buyEnabled && <BuyButton />}
            {isCoinSwapEnabled ? <SwapButton /> : null}
          </HStack>
        </VStack>
        {isNodeAvailable === false ? (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription fontSize="md">
              <Text fontSize="md" fontWeight={700}>
                <FormattedMessage defaultMessage="Not connected" />
              </Text>
              <FormattedMessage defaultMessage="please check your connection" />
            </AlertDescription>
          </Alert>
        ) : null}
        <WalletAssets />
        <WalletRecentTransactions />
      </VStack>
    </WalletLayout>
  );
}

export default Wallet;
