// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  Button,
  Center,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import {
  secondaryAddressFontColor,
  secondaryBorderColor,
  secondaryWalletHomeCardBgColor,
} from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import {
  type StakeInfo,
  useAccountStakeInfo,
} from '@petra/core/queries/account';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import format from 'date-fns/format';
import { collapseHexString } from '@petra/core/utils/hex';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { APTOS_UNIT, formatCoin } from '@petra/core/utils/coin';
import { PetraLogo } from './PetraLogo';
import ChakraLink from './ChakraLink';
import Copyable from './Copyable';

interface NoStakeProps {
  isLoading: boolean;
}

function NoStake({ isLoading }: NoStakeProps) {
  const { colorMode } = useColorMode();
  return (
    <Box
      w="100%"
      borderWidth="1px"
      borderRadius=".5rem"
      borderColor={secondaryBorderColor[colorMode]}
    >
      <Center height="100%" p={4}>
        {isLoading ? (
          <Spinner />
        ) : (
          <Text fontSize="md" textAlign="center">
            <FormattedMessage defaultMessage="No stake yet!" />
          </Text>
        )}
      </Center>
    </Box>
  );
}
interface StakeBodyContentProps {
  stakeInfo: StakeInfo;
}

function StakeBodyContent({ stakeInfo }: StakeBodyContentProps) {
  const { colorMode } = useColorMode();
  const {
    delegatedVoter,
    lockedUntilSecs,
    operatorAddress,
    value: stakeAmount,
  } = stakeInfo;

  const stakeAmountString = formatCoin(stakeAmount, { includeUnit: false });

  const lockedUntilDateString = useMemo(() => {
    const lockedUntilDate = new Date(Number(lockedUntilSecs) * 1000);
    // TODO(i18n): Use the global locale to format this string.
    return format(lockedUntilDate, "MMM dd yyyy 'at' hh:mm aa");
  }, [lockedUntilSecs]);

  const stakingAmount = (
    <VStack
      py={4}
      width="100%"
      px={4}
      borderRadius=".5rem"
      bgColor={secondaryWalletHomeCardBgColor[colorMode]}
      alignItems="flex-start"
    >
      <SimpleGrid columns={2} width="100%">
        <Box width="72px" height="72px">
          <PetraLogo />
        </Box>
      </SimpleGrid>
      <Text pt={4} fontSize="sm" color={secondaryAddressFontColor[colorMode]}>
        <FormattedMessage defaultMessage="Stake balance" />
      </Text>
      <span>
        <Heading as="span" wordBreak="break-word" maxW="100%">
          {stakeAmountString}
        </Heading>
        <Text pl={2} pb="2px" as="span" fontSize="xl" fontWeight={600}>
          {APTOS_UNIT}
        </Text>
      </span>
      <Text color={secondaryAddressFontColor[colorMode]} fontSize="sm">
        <FormattedMessage
          defaultMessage="Locked until {unlockDate}"
          values={{ unlockDate: lockedUntilDateString }}
        />
      </Text>
    </VStack>
  );

  const voter = (
    <ChakraLink to={`/accounts/${delegatedVoter}`} w="100%">
      <Button
        py={10}
        width="100%"
        rightIcon={<ChevronRightIcon />}
        justifyContent="space-between"
      >
        <VStack
          py={4}
          width="100%"
          borderRadius=".5rem"
          alignItems="flex-start"
        >
          <Text fontSize="sm" color={secondaryAddressFontColor[colorMode]}>
            <FormattedMessage defaultMessage="Voter" />
          </Text>
          <Copyable
            prompt={<FormattedMessage defaultMessage="Copy address" />}
            value={delegatedVoter}
          >
            <Text fontSize="md">{collapseHexString(delegatedVoter)}</Text>
          </Copyable>
        </VStack>
      </Button>
    </ChakraLink>
  );

  const operator = (
    <ChakraLink to={`/accounts/${operatorAddress}`} w="100%">
      <Button
        py={10}
        width="100%"
        rightIcon={<ChevronRightIcon />}
        justifyContent="space-between"
      >
        <VStack
          py={4}
          width="100%"
          borderRadius=".5rem"
          alignItems="flex-start"
        >
          <Text fontSize="sm" color={secondaryAddressFontColor[colorMode]}>
            <FormattedMessage defaultMessage="Operator" />
          </Text>
          <Copyable
            prompt={<FormattedMessage defaultMessage="Copy address" />}
            value={operatorAddress}
          >
            <Text fontSize="md">{collapseHexString(operatorAddress)}</Text>
          </Copyable>
        </VStack>
      </Button>
    </ChakraLink>
  );

  return (
    <VStack width="100%">
      {stakingAmount}
      {voter}
      {operator}
    </VStack>
  );
}

export default function StakeBody() {
  const { activeAccountAddress } = useActiveAccount();
  const {
    data: stakeInfo,
    isError,
    isLoading,
  } = useAccountStakeInfo(activeAccountAddress, {
    refetchInterval: 30000,
  });

  return (
    <VStack width="100%" paddingTop={stakeInfo ? 4 : 8} alignItems="start">
      {stakeInfo && !isLoading && !isError ? (
        <StakeBodyContent stakeInfo={stakeInfo} />
      ) : (
        <NoStake isLoading={isLoading} />
      )}
    </VStack>
  );
}
