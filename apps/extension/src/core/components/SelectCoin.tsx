// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Avatar,
  Badge,
  Box,
  HStack,
  Image,
  Popover,
  PopoverContent,
  Tag,
  TagLabel,
  Text,
  useColorMode,
  useDisclosure,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  VStack,
} from '@chakra-ui/react';
import {
  secondaryHoverBgColor,
  secondaryButtonBgColor,
  secondaryDisabledNetworkBgColor,
  checkedBgColor,
  secondaryAddressFontColor,
} from '@petra/core/colors';
import { useTransferFlow } from 'core/hooks/useTransferFlow';
import { type AccountCoinResource } from '@petra/core/queries/account';
import { aptosCoinStructTag } from '@petra/core/constants/index';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { formatAmount } from '@petra/core/utils/coin';
import AvatarImage from 'core/AvatarImage';

export interface CoinSelectionUnit {
  imageUrl: string;
  label: string;
  symbol: string;
  value: string;
}
export type CoinSelectionType = CoinSelectionUnit[];

type CoinListItemProps = UseRadioProps & {
  coinMetadata: AccountCoinResource & {
    isRecognized: boolean;
    logoUrl: string;
  };
} & {
  index: number;
  onClose: () => void;
};

export function CoinListItem(props: CoinListItemProps) {
  const { coinMetadata, index, isChecked, isDisabled, onClose } = props;
  const { formMethods } = useTransferFlow();

  const { getCheckboxProps, getInputProps } = useRadio({
    ...props,
    isDisabled,
  });
  const { colorMode } = useColorMode();

  const enabledBoxProps = !isDisabled
    ? {
        _hover: {
          bg: isChecked ? 'navy.700' : secondaryHoverBgColor[colorMode],
        },
        cursor: 'pointer',
      }
    : {};

  const coinOnClick = useCallback(() => {
    formMethods.setValue('coinStructTag', coinMetadata.type);
    onClose();
  }, [formMethods, coinMetadata, onClose]);

  const formattedAmount = useMemo(
    () =>
      formatAmount(
        coinMetadata.balance,
        {
          decimals: coinMetadata.info.decimals,
          name: coinMetadata.info.name,
          symbol: coinMetadata.info.symbol,
          type: coinMetadata.type,
        },
        { prefix: false },
      ),
    [coinMetadata],
  );

  return (
    <Box width="100%" as="label" px={0} onClick={coinOnClick}>
      <input disabled={isDisabled} {...getInputProps()} />
      <Box
        {...getCheckboxProps()}
        {...enabledBoxProps}
        border="0px"
        bgColor={secondaryButtonBgColor[colorMode]}
        borderTopRadius={index === 0 ? 'md' : undefined}
        _disabled={{
          bg: secondaryDisabledNetworkBgColor[colorMode],
          color: 'navy.300',
        }}
        _checked={{
          bg: checkedBgColor[colorMode],
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={3}
        py={3}
      >
        <HStack w="100%" spacing={4}>
          <Image
            width="32px"
            height="32px"
            borderRadius="100%"
            bgColor="transparent"
            src={coinMetadata.logoUrl}
            fallback={
              <AvatarImage size={32} address={coinMetadata.info.symbol} />
            }
          />
          <VStack alignItems="flex-start" spacing={1}>
            <HStack>
              <Text fontSize="sm" fontWeight={600}>
                {coinMetadata.info.symbol}
              </Text>
              {coinMetadata.info.type === aptosCoinStructTag ? (
                <Badge colorScheme="salmon">
                  <FormattedMessage defaultMessage="Official" />
                </Badge>
              ) : null}
              {coinMetadata.isRecognized ? (
                <Badge>
                  <FormattedMessage defaultMessage="Verified" />
                </Badge>
              ) : null}
            </HStack>
            <HStack
              color={secondaryAddressFontColor[colorMode]}
              alignItems="stretch"
              fontSize="xs"
              justifyContent="space-around"
              divider={<>•</>}
              gap={2}
            >
              <Text flexGrow={5} noOfLines={1}>
                {coinMetadata.info.name}
              </Text>
              <Text
                flexGrow={1}
                maxW="150px"
                noOfLines={1}
                textOverflow="ellipsis"
              >
                {formattedAmount}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
}

function SelectCoin() {
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure();
  const initialRef = React.useRef(null);
  const {
    accountCoinResourcesFormatted,
    coinLogo,
    coinStructTag,
    coinSymbol: transferFlowCoinSymbol,
  } = useTransferFlow();

  const { getRadioProps } = useRadioGroup({ name: 'selectCoin' });

  const coinSymbol = coinStructTag
    ? accountCoinResourcesFormatted[coinStructTag]?.info.symbol
    : undefined;

  return (
    <Popover
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom"
    >
      <Tag
        onClick={onToggle}
        cursor="pointer"
        size="lg"
        borderRadius="full"
        bgColor="transparent"
        id="select-coin-tag"
      >
        {coinLogo ? (
          <Avatar src={coinLogo} size="sm" ml={-1} mr={2} />
        ) : (
          <Box ml={-1} mr={2}>
            <AvatarImage address={transferFlowCoinSymbol} size={32} />
          </Box>
        )}
        <TagLabel>{coinSymbol}</TagLabel>
        <ChevronDownIcon ml={1} fontSize="xl" />
      </Tag>
      <PopoverContent
        maxH="200px"
        zIndex={100}
        width="100%"
        mt={10}
        overflowY="auto"
      >
        <VStack width="100%" spacing={0}>
          {Object.values(accountCoinResourcesFormatted).map((value, index) => {
            const radio = getRadioProps({ value: value.info.symbol });
            return (
              <CoinListItem
                {...radio}
                coinMetadata={value}
                key={value.info.type}
                index={index}
                isChecked={coinStructTag === value.info.type}
                onClose={onClose}
              />
            );
          })}
        </VStack>
      </PopoverContent>
    </Popover>
  );
}

export default React.memo(SelectCoin, () => true);
