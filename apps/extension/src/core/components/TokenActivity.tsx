// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Flex,
  Icon,
  Text,
  VStack,
  useColorMode,
  Spinner,
} from '@chakra-ui/react';
import { RiExternalLinkLine } from '@react-icons/all-files/ri/RiExternalLinkLine';
import CreatorTag from 'core/components/CreatorTag';
import { useLocation } from 'react-router-dom';
import { TokenEvent, ExtendedTokenData } from '@petra/core/types/token';
import { normalizeTimestamp } from '@petra/core/transactions';
import NextPageLoader from 'core/components/NextPageLoader';
import useTokenActivities from '@petra/core/queries/useTokenActivities';
import type { TokenActivity as TokenActivityType } from '@petra/core/types/token';
import {
  textColorSecondary,
  tokenDetailsTextColor,
  assetSecondaryBgColor,
} from '@petra/core/colors';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';

function TokenActivity() {
  const { state } = useLocation();
  const tokenData = state as ExtendedTokenData;
  const getExplorerAddress = useExplorerAddress();

  const { colorMode } = useColorMode();
  const tokenActivities = useTokenActivities(tokenData.idHash);
  const items = useMemo(
    () => tokenActivities.data?.pages.flatMap((page) => page.items),
    [tokenActivities.data],
  );

  const TokenEventToString = {
    [TokenEvent.Deposit.toString()]: (
      <FormattedMessage defaultMessage="Deposited" />
    ),
    [TokenEvent.Claim.toString()]: (
      <FormattedMessage defaultMessage="Claimed" />
    ),
    [TokenEvent.CancelOffer.toString()]: (
      <FormattedMessage defaultMessage="Cancelled" />
    ),
    [TokenEvent.Mint.toString()]: <FormattedMessage defaultMessage="Minted" />,
    [TokenEvent.Offer.toString()]: (
      <FormattedMessage defaultMessage="Offered" />
    ),
    [TokenEvent.Withdraw.toString()]: (
      <FormattedMessage defaultMessage="Withdrew" />
    ),
    [TokenEvent.Mutate.toString()]: (
      <FormattedMessage defaultMessage="Mutated Token" />
    ),
  };

  if (tokenActivities.isError) {
    return (
      <VStack justifyContent="flex-start" spacing="18px" width="100%">
        <FormattedMessage defaultMessage="Error fetching token activity" />
      </VStack>
    );
  }

  if (tokenActivities.isLoading) {
    return (
      <VStack justifyContent="flex-start" spacing="18px" width="100%">
        <Spinner size="sm" />
      </VStack>
    );
  }

  return tokenActivities.isSuccess && items ? (
    <>
      <VStack justifyContent="flex-start" spacing={3} width="100%">
        {items.map((activity: TokenActivityType) => {
          const normalizedTimestamp = normalizeTimestamp(
            activity.transactionTimestamp,
          );

          const transactionTimestamp = new Date(
            normalizedTimestamp,
          ).toLocaleString();

          return (
            <VStack
              width="100%"
              bgColor={assetSecondaryBgColor[colorMode]}
              borderRadius="0.5rem"
              textColor={tokenDetailsTextColor[colorMode]}
              p={4}
              key={`${activity.accountAddress}
              _${activity.creationNumber}
              _${activity.sequenceNumber}`}
            >
              <Flex width="100%" alignItems="center">
                <Text fontWeight={700} display="block" flex={1} fontSize="14px">
                  {TokenEventToString[activity.transferType as any]}
                </Text>
                <Icon
                  cursor="pointer"
                  as={RiExternalLinkLine}
                  onClick={() =>
                    window.open(
                      getExplorerAddress(`txn/${activity.transactionVersion}`),
                      '_blank',
                    )
                  }
                />
              </Flex>
              {activity.fromAddress && (
                <Flex
                  width="100%"
                  fontSize="xs"
                  textColor={textColorSecondary[colorMode]}
                  alignItems="center"
                  gap="8px"
                >
                  <Text display="block">
                    <FormattedMessage defaultMessage="from" />
                  </Text>
                  <CreatorTag address={activity.fromAddress} size="12px" />
                </Flex>
              )}
              {activity.toAddress && (
                <Flex
                  width="100%"
                  fontSize="xs"
                  textColor={textColorSecondary[colorMode]}
                  alignItems="center"
                  gap="8px"
                >
                  <Text display="block">
                    <FormattedMessage defaultMessage="to" />
                  </Text>
                  <CreatorTag address={activity.toAddress} size="12px" />
                </Flex>
              )}
              <Flex width="100%" fontSize="xs" textColor="navy.600">
                {transactionTimestamp}
              </Flex>
            </VStack>
          );
        })}
      </VStack>
      <NextPageLoader query={tokenActivities} />
    </>
  ) : null;
}

export default TokenActivity;
