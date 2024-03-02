// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  Center,
  Grid,
  Heading,
  Spinner,
  Text,
  VStack,
  useColorMode,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import AvatarImage from 'core/AvatarImage';
import {
  assetSecondaryBgColor,
  assetSecondaryHoverBGColor,
  secondaryBorderColor,
  secondaryTextColor,
} from '@petra/core/colors';
import { aptosCoinStructTag } from '@petra/core/constants';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import {
  AccountCoinResource,
  useAccountCoinResources,
} from '@petra/core/queries/account';
import { APTOS_UNIT, OCTA_UNIT, formatCoin } from '@petra/core/utils/coin';
import { CoinInfoData } from '@petra/core/types';
import { Routes } from 'core/routes';
import RefetchInterval from '@petra/core/hooks/constants';
import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight';
import { useStaking } from '@petra/core/queries/useStaking';
import { StakeIcon } from 'core/svgs';
import { useFlag } from '@petra/core/flags';
import { AptosLogo } from './AptosLogo';
import ChakraLink from './ChakraLink';

function NoAssets() {
  const { colorMode } = useColorMode();
  return (
    <Center
      borderWidth="1px"
      borderRadius=".5rem"
      borderColor={secondaryBorderColor[colorMode]}
      p={4}
    >
      <Text fontSize="md">
        <FormattedMessage defaultMessage="No assets yet!" />
      </Text>
    </Center>
  );
}

interface AssetListItemProps {
  balance: bigint;
  info: CoinInfoData;
  type: string;
}

function AssetListItem({ balance, info, type }: AssetListItemProps) {
  const { colorMode } = useColorMode();

  // TODO: Will need to cache some logos and symbols for relevant
  //  coins since they don't appear in account resources
  const logo = useMemo(() => {
    switch (type) {
      case aptosCoinStructTag:
        return <AptosLogo />;
      default:
        return <AvatarImage size={32} address={type} />;
    }
  }, [type]);

  const amount = useMemo(() => {
    const multiplier = 10 ** -info.decimals;
    const amountString = formatCoin(balance, {
      includeUnit: false,
      multiplier,
    });
    return `${amountString} ${info.symbol}`;
  }, [balance, info]);

  return (
    <Grid
      templateColumns="32px 1fr 32px"
      width="100%"
      gap={4}
      p={4}
      borderRadius="0.5rem"
      bgColor={assetSecondaryBgColor[colorMode]}
    >
      <Center width="100%" height="100%">
        {logo}
      </Center>
      <VStack fontSize="md" alignItems="left" spacing={0}>
        <Text fontWeight={600}>{info.name}</Text>
        <Text color={secondaryTextColor[colorMode]}>{amount}</Text>
      </VStack>
      <Box />
    </Grid>
  );
}

function StakingSection({ rawTotal }: { rawTotal: number }) {
  const { colorMode } = useColorMode();
  const total = formatCoin(rawTotal, {
    paramUnitType: OCTA_UNIT,
    returnUnitType: APTOS_UNIT,
  });

  return (
    <VStack alignItems="stretch">
      <Heading py={2} fontSize="md" color={secondaryTextColor[colorMode]}>
        <FormattedMessage defaultMessage="STAKING" />
      </Heading>
      <VStack spacing={2}>
        <ChakraLink to={Routes.stakingList.path} w="100%" m={0}>
          <HStack
            width="100%"
            gap={4}
            p={4}
            borderRadius="0.5rem"
            justifyContent="space-between"
            bgColor={assetSecondaryBgColor[colorMode]}
            _hover={{ bgColor: assetSecondaryHoverBGColor[colorMode] }}
          >
            <HStack gap={2}>
              <StakeIcon />
              <VStack fontSize="md" spacing={0} alignItems="flex-start">
                <Text fontWeight={600}>
                  <FormattedMessage defaultMessage="Total Staked" />
                </Text>
                <Text color={secondaryTextColor[colorMode]}>{total}</Text>
              </VStack>
            </HStack>
            <HStack>
              <Box color={colorMode === 'dark' ? 'navy.700' : 'navy.500'}>
                <BiChevronRight size="24px" />
              </Box>
            </HStack>
          </HStack>
        </ChakraLink>
      </VStack>
    </VStack>
  );
}

interface WalletAssetSectionProps {
  coins: AccountCoinResource[];
  showManageAssets?: boolean;
  title: JSX.Element;
  tooltip?: JSX.Element;
}

function WalletAssetSection({
  coins,
  showManageAssets,
  title,
  tooltip,
}: WalletAssetSectionProps) {
  const { colorMode } = useColorMode();
  return (
    <VStack alignItems="stretch">
      <Tooltip label={tooltip} fontSize="md">
        <HStack justifyContent="space-between">
          <Heading py={2} fontSize="md" color={secondaryTextColor[colorMode]}>
            {title}
          </Heading>
          {showManageAssets ? (
            <ChakraLink
              textDecorationLine="underline"
              color="navy.600"
              to={Routes.manage_assets.path}
              fontSize="14px"
            >
              <FormattedMessage defaultMessage="Manage" />
            </ChakraLink>
          ) : null}
        </HStack>
      </Tooltip>
      <VStack spacing={2}>
        {coins.map((coinResource) => (
          <AssetListItem key={coinResource.type} {...coinResource} />
        ))}
      </VStack>
    </VStack>
  );
}

export default function WalletAssets() {
  const { activeAccountAddress } = useActiveAccount();
  const stakeResources = useStaking({ address: activeAccountAddress });
  const coinResources = useAccountCoinResources(activeAccountAddress, {
    keepPreviousData: true,
    refetchInterval: RefetchInterval.STANDARD,
  });
  const isLoading = coinResources.isLoading || stakeResources.isLoading;

  const isStakingEnabled = useFlag('extension-staking');
  const stakingExists = stakeResources && (stakeResources.data?.total || 0) > 0;
  const stakingTotal = stakeResources.data?.total || 0;

  return (
    <VStack px={4} spacing={2} alignItems="stretch">
      {isLoading ? (
        <Spinner alignSelf="center" />
      ) : (
        <>
          {coinResources.data &&
          coinResources.data.recognizedCoins.length > 0 ? (
            <WalletAssetSection
              title={<FormattedMessage defaultMessage="ASSETS" />}
              showManageAssets
              coins={coinResources.data?.recognizedCoins}
            />
          ) : null}
          {isStakingEnabled && stakingExists ? (
            <StakingSection rawTotal={stakingTotal} />
          ) : null}
          {coinResources.data &&
          coinResources.data.unrecognizedCoins.length > 0 ? (
            <WalletAssetSection
              title={<FormattedMessage defaultMessage="OTHER ASSETS" />}
              coins={coinResources.data?.unrecognizedCoins}
              tooltip={
                <FormattedMessage defaultMessage="Other assets are coins that we have not verified as legitimate" />
              }
            />
          ) : null}
          {coinResources.data &&
          coinResources.data.recognizedCoins.length === 0 &&
          coinResources.data.unrecognizedCoins.length === 0 ? (
            <NoAssets />
          ) : null}
        </>
      )}
    </VStack>
  );
}
