// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  VStack,
  Box,
  Center,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  Input,
  Text,
  Flex,
  Spinner,
  useColorMode,
  HStack,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import WalletLayout from 'core/layouts/WalletLayout';
import { BiSearch } from '@react-icons/all-files/bi/BiSearch';
import { AptosLogo } from 'core/components/AptosLogo';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import {
  AccountCoinResource,
  useAccountCoinResources,
} from '@petra/core/queries/account';
import { CoinInfoData } from '@petra/core/types';
import { aptosCoinStructTag } from '@petra/core/constants';
import { AiFillPlusCircle } from '@react-icons/all-files/ai/AiFillPlusCircle';
import {
  secondaryTextColor,
  assetSecondaryBgColor,
  secondaryButtonBgColor,
  buttonBorderColor,
  disabledButtonBgColor,
  searchInputBackground,
} from '@petra/core/colors';
import useCoinListDict from '@petra/core/hooks/useCoinListDict';
import { type RawCoinInfo } from '@manahippo/coin-list';

import ApproveAddCoinToWalletDrawer, {
  useAddCoinTransactionPayload,
} from 'core/components/ApproveAddCoinToWalletDrawer';
import RefetchInterval from '@petra/core/hooks/constants';
import ChakraLink from 'core/components/ChakraLink';
import { Routes } from 'core/routes';
import AvatarImage from 'core/AvatarImage';
import useCoinResources from '@petra/core/queries/useCoinResources';

interface AssetListItemProps {
  info: CoinInfoData;
  logoUrl: string;
  type: string;
}

type AssetListAddItemProps = RawCoinInfo & {
  hasAdded: boolean;
  onClickAdd: (coinStructType: string, coinName: string) => void;
};

interface ManageAssetsSearchProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
}

export function AssetListAddItem({
  hasAdded,
  logo_url,
  name,
  onClickAdd,
  project_url,
  symbol,
  token_type,
}: AssetListAddItemProps) {
  const { colorMode } = useColorMode();

  return (
    <HStack
      width="100%"
      gap={4}
      p={2}
      borderRadius="0.5rem"
      _hover={{
        bgColor: assetSecondaryBgColor[colorMode],
      }}
    >
      <HStack width="100%" gap={2}>
        <HStack width="100%" gap={4}>
          <Center height="40px" width="40px">
            <img src={logo_url} alt={project_url} />
          </Center>
          <VStack fontSize="md" alignItems="left" spacing={0}>
            <Text fontWeight={600}>{symbol}</Text>
            <Text color={secondaryTextColor[colorMode]} fontSize="md">
              {name}
            </Text>
          </VStack>
        </HStack>
        {hasAdded ? (
          <Button
            bgColor={disabledButtonBgColor[colorMode]}
            border="1px solid"
            borderColor={buttonBorderColor[colorMode]}
            isDisabled={hasAdded}
          >
            <FormattedMessage defaultMessage="Added" />
          </Button>
        ) : (
          <Button
            bgColor={secondaryButtonBgColor[colorMode]}
            border="1px solid"
            borderColor={buttonBorderColor[colorMode]}
            onClick={() => onClickAdd(token_type.type, name)}
          >
            <FormattedMessage defaultMessage="Add" />
          </Button>
        )}
      </HStack>
    </HStack>
  );
}

export function AssetListItem({ info, logoUrl, type }: AssetListItemProps) {
  const { colorMode } = useColorMode();

  const logo = useMemo(() => {
    switch (type) {
      case aptosCoinStructTag:
        return <AptosLogo />;
      default:
        return logoUrl ? (
          <img src={logoUrl} alt={info.name} />
        ) : (
          <AvatarImage size={32} address={type} />
        );
    }
  }, [logoUrl, type, info.name]);

  return (
    <HStack
      width="100%"
      gap={4}
      p={2}
      borderRadius="0.5rem"
      _hover={{
        bgColor: assetSecondaryBgColor[colorMode],
      }}
    >
      <Center minWidth="40px" minHeight="40px" maxHeight="40px" maxWidth="40px">
        {logo}
      </Center>
      <VStack fontSize="md" alignItems="left" spacing={0}>
        <Text fontWeight={600}>{info.symbol}</Text>
        <Text color={secondaryTextColor[colorMode]} fontSize="md">
          {info.name}
        </Text>
      </VStack>
      <Box />
    </HStack>
  );
}

function ManageAssetsSearch({ onChange, value }: ManageAssetsSearchProps) {
  const { colorMode } = useColorMode();
  const intl = useIntl();

  return (
    <Flex alignItems="center" gap={4}>
      <InputGroup
        bgColor={searchInputBackground[colorMode]}
        border="transparent"
      >
        <InputLeftElement pointerEvents="none">
          <BiSearch />
        </InputLeftElement>
        <Input
          placeholder={intl.formatMessage({ defaultMessage: 'Search' })}
          value={value}
          onChange={onChange}
        />
      </InputGroup>
      <Tooltip label={<FormattedMessage defaultMessage="Add custom coin" />}>
        <ChakraLink id="add-custom-coin" to={Routes.addCustomCoin.path}>
          <Flex justifyContent="center" alignItems="center">
            <Icon as={AiFillPlusCircle} width="32px" height="32px" />
          </Flex>
        </ChakraLink>
      </Tooltip>
    </Flex>
  );
}

interface ManageAllAssetsProps {
  onAddCoin: (coinStructType: string, coinName: string) => void;
  query: string;
  selectedCoinName?: string;
}

function ManageAllAssets({ onAddCoin, query }: ManageAllAssetsProps) {
  const { coinListDict } = useCoinListDict();

  const {
    coinsHash: registeredCoinHash,
    isLoading: coinResourcesIsLoading,
    isSuccess: coinResourcesIsSuccess,
  } = useCoinResources();

  const filterCoinData = (coin: RawCoinInfo) => {
    if (registeredCoinHash.get(coin.token_type.type)) return false;

    // if query string is empty, pass through all the coins
    if (query.length === 0) return true;

    const searchQuery = query.toLowerCase();

    // matched either name, symbol or type
    const matchedName = coin.name.toLowerCase().includes(searchQuery);
    const matchedSymbol = coin.symbol.toLowerCase().includes(searchQuery);
    const matchedType = coin.token_type.type
      .toLowerCase()
      .includes(searchQuery);

    return matchedName || matchedSymbol || matchedType;
  };

  if (
    !coinResourcesIsLoading &&
    coinResourcesIsSuccess &&
    Object.values(coinListDict).filter(filterCoinData).length === 0
  ) {
    return null;
  }

  return (
    <VStack width="100%" spacing={2} alignItems="stretch" pb={4}>
      <Text color="navy.600" fontWeight={700} fontSize="md">
        <FormattedMessage defaultMessage="ALL COINS" />
      </Text>
      {coinResourcesIsLoading ? <Spinner alignSelf="center" /> : undefined}
      {coinResourcesIsSuccess ? (
        <VStack spacing={2}>
          {Object.values(coinListDict)
            .filter(filterCoinData)
            .map((coinData) => (
              <AssetListAddItem
                key={coinData.token_type.type}
                hasAdded={registeredCoinHash.get(coinData.symbol)}
                onClickAdd={onAddCoin}
                {...coinData}
              />
            ))}
        </VStack>
      ) : null}
    </VStack>
  );
}

function ManageRegisteredAssets({ query }: { query: string }) {
  const { activeAccountAddress } = useActiveAccount();
  const coinResources = useAccountCoinResources(activeAccountAddress, {
    keepPreviousData: true,
    refetchInterval: RefetchInterval.STANDARD,
  });
  const { coinListDict } = useCoinListDict();

  const recognizedCoins = coinResources.data?.recognizedCoins || [];
  const unrecognizedCoins = coinResources.data?.unrecognizedCoins || [];
  const allCoins = [...recognizedCoins, ...unrecognizedCoins];

  const allCoinsLogoHash = useMemo(() => {
    const hash = new Map();

    Object.values(coinListDict).forEach((coin) => {
      hash.set(coin.token_type.type, coin.logo_url);
    });

    return hash;
  }, [coinListDict]);

  const filterCoin = (coin: AccountCoinResource) => {
    // if query string is empty, pass through all the coins
    if (query.length === 0) return true;

    const searchQuery = query.toLowerCase();

    // matched either name, symbol or type
    const matchedName = coin.info.name.toLowerCase().includes(searchQuery);
    const matchedSymbol = coin.info.symbol.toLowerCase().includes(searchQuery);
    const matchedType = coin.info.type.toLowerCase().includes(searchQuery);

    return matchedName || matchedSymbol || matchedType;
  };
  return (
    <VStack width="100%" spacing={2} alignItems="stretch">
      <Text color="navy.600" fontWeight={700} fontSize="md">
        <FormattedMessage defaultMessage="REGISTERED" />
      </Text>
      {coinResources.isLoading ? <Spinner alignSelf="center" /> : undefined}
      {allCoins.length > 0 ? (
        <VStack spacing={2}>
          {allCoins.filter(filterCoin).map((coinResource) => (
            <AssetListItem
              key={coinResource.type}
              {...coinResource}
              logoUrl={allCoinsLogoHash.get(coinResource.type)}
            />
          ))}
        </VStack>
      ) : null}
    </VStack>
  );
}

function ManageAssets() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoinStructType, setSelectedCoinStructType] =
    useState<string>();
  const [selectedCoinName, setSelectedCoinName] = useState<string>();

  const handleAddCoin = (coinStructType: string, coinName: string) => {
    setSelectedCoinStructType(coinStructType);
    setSelectedCoinName(coinName);
    onOpen();
  };

  const payload = useAddCoinTransactionPayload(selectedCoinStructType);

  const handleQueryChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setSearchQuery(e.target.value);

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Manage Assets" />}
      hasWalletFooter={false}
      showBackButton
    >
      <VStack
        width="100%"
        paddingTop={4}
        height="100%"
        p={4}
        spacing={8}
        alignItems="stretch"
      >
        <ManageAssetsSearch onChange={handleQueryChange} value={searchQuery} />
        <ManageRegisteredAssets query={searchQuery} />
        <ManageAllAssets onAddCoin={handleAddCoin} query={searchQuery} />
      </VStack>
      <ApproveAddCoinToWalletDrawer
        isOpen={isOpen}
        payload={payload}
        onClose={onClose}
        errorMessage={
          <FormattedMessage
            defaultMessage="Error occured when adding {coinName} to wallet"
            values={{ coinName: selectedCoinName }}
          />
        }
        approveDescription={
          <FormattedMessage
            defaultMessage="Registering {coinName} will submit an on-chain transaction and will require a gas fee."
            values={{ coinName: selectedCoinName }}
          />
        }
        successDescription={
          <FormattedMessage
            defaultMessage="Successfully added {coinName} to wallet"
            values={{ coinName: selectedCoinName }}
          />
        }
        approveHeading={
          <FormattedMessage defaultMessage="Add coin to wallet" />
        }
      />
    </WalletLayout>
  );
}

export default ManageAssets;
