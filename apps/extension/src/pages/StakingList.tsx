// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Button,
  HStack,
  Heading,
  Text,
  Link as ChakraLink,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import WalletLayout from 'core/layouts/WalletLayout';
import {
  secondaryBorderColor,
  secondaryTextColor,
  textColor,
} from '@petra/core/colors';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { APTOS_UNIT, OCTA_UNIT, formatCoin } from '@petra/core/utils/coin';
import { useStaking } from '@petra/core/queries/useStaking';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import collapseHexString from '@petra/core/utils/hex';

interface StakingListItemProps {
  amount: number;
  poolAddress: string;
}

function StakingListItem({ amount, poolAddress }: StakingListItemProps) {
  const { colorMode } = useColorMode();
  const getExplorerAddress = useExplorerAddress();
  const explorerAddress = getExplorerAddress(`validator/${poolAddress}`);
  const total = formatCoin(amount, {
    paramUnitType: OCTA_UNIT,
    returnUnitType: APTOS_UNIT,
  });
  return (
    <ChakraLink
      onClick={() => window.open(explorerAddress, '_blank')}
      w="100%"
      _hover={{ textDecoration: 'none' }}
    >
      <HStack
        width="100%"
        gap="4"
        padding={4}
        borderRadius="0.5rem"
        borderWidth={1}
        borderColor={secondaryBorderColor[colorMode]}
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack flexGrow={1}>
          <VStack align="flex-start" spacing={0} py="12px">
            <Text fontSize="14px" fontWeight={500} color={textColor[colorMode]}>
              {collapseHexString(poolAddress)}
            </Text>
          </VStack>
        </HStack>
        <VStack fontSize="14px" spacing={0} alignItems="flex-end">
          <Text fontWeight={500} color={textColor[colorMode]}>
            {total}
          </Text>
        </VStack>
      </HStack>
    </ChakraLink>
  );
}

interface StakingSectionProps {
  stakes: StakingListItemProps[];
  title: string;
}

function StakingSection({ stakes, title }: StakingSectionProps) {
  const { colorMode } = useColorMode();
  return (
    <VStack w="100%" spacing={2} alignItems="stretch">
      <Heading color={secondaryTextColor[colorMode]} fontSize="14px">
        {title.toUpperCase()}
      </Heading>
      {stakes.map((stake) => (
        <StakingListItem key={stake.poolAddress} {...stake} />
      ))}
    </VStack>
  );
}

export default function StakingList() {
  const { colorMode } = useColorMode();
  const getExplorerAddress = useExplorerAddress();
  const explorerAddress = getExplorerAddress('validators/delegation');
  const { activeAccountAddress } = useActiveAccount();
  const stakeResult = useStaking({ address: activeAccountAddress });

  if (stakeResult.isError || stakeResult.isLoading || !stakeResult.data) {
    // TODO: Ask design about this case
    return null;
  }

  const { stakes } = stakeResult.data;
  const withdrawReady: StakingListItemProps[] = [];
  const active: StakingListItemProps[] = [];
  const withdrawPending: StakingListItemProps[] = [];

  stakes.forEach((stake) => {
    if (stake.active) {
      active.push({
        amount: stake.active,
        poolAddress: stake.poolAddress,
      });
    }
    if (stake.withdrawReady) {
      withdrawReady.push({
        amount: stake.withdrawReady,
        poolAddress: stake.poolAddress,
      });
    }
    if (stake.withdrawPending) {
      withdrawPending.push({
        amount: stake.withdrawPending,
        poolAddress: stake.poolAddress,
      });
    }
  });

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Staking" />}
      showBackButton
    >
      <VStack w="100%" p={4} spacing={4} alignItems="stretch">
        <Text
          fontSize={14}
          fontWeight={400}
          color={secondaryTextColor[colorMode]}
        >
          <FormattedMessage defaultMessage="When you unstake tokens, they are unavailable until the next unlock date. You continue to earn rewards until the funds are ready to withdraw." />
        </Text>

        <Button
          fontSize="14px"
          fontWeight={400}
          paddingBottom={2}
          color={secondaryTextColor[colorMode]}
          as="a"
          target="_blank"
          rightIcon={<ExternalLinkIcon />}
          variant="link"
          cursor="pointer"
          href={explorerAddress}
          alignSelf="center"
        >
          <FormattedMessage defaultMessage="Stake & View on Explorer" />
        </Button>

        <VStack gap={2}>
          {withdrawReady.length > 0 ? (
            <StakingSection title="Ready to withdraw" stakes={withdrawReady} />
          ) : null}

          {active.length > 0 ? (
            <StakingSection title="Active Stake" stakes={active} />
          ) : null}

          {withdrawPending.length > 0 ? (
            <StakingSection title="Withdraw Pending" stakes={withdrawPending} />
          ) : null}
        </VStack>
      </VStack>
    </WalletLayout>
  );
}
