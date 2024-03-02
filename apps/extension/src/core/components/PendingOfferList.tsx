// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Flex,
  Icon,
  Center,
  Button,
  Text,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import NextPageLoader from 'core/components/NextPageLoader';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import { BsBoxArrowUpRight } from '@react-icons/all-files/bs/BsBoxArrowUpRight';
import { useLocation, useNavigate } from 'react-router-dom';
import GalleryItem from 'core/components/GalleryItem';
import { ExtendedTokenData } from '@petra/core/types';
import usePendingOffersForToken from '@petra/core/queries/usePendingOffersForToken';
import { TokenClaim } from '@petra/core/types/token';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import {
  checkCircleSuccessBg,
  networkListItemSecondaryBorderColor,
  borderColor,
  secondaryBgColor,
} from '@petra/core/colors';
import { useTokenOfferClaim } from '@petra/core/hooks/useTokenOfferClaim';
import Routes from 'core/routes';
import { normalizeTimestamp } from '@petra/core/transactions';
import CreatorTag from './CreatorTag';

export function PendingOfferList() {
  const { state } = useLocation();
  const { activeAccountAddress } = useActiveAccount();
  const navigate = useNavigate();
  const tokenData = state as ExtendedTokenData;
  const { setAcceptingPendingTokenOffer, setCancelingPendingTokenOffer } =
    useTokenOfferClaim();
  const { colorMode } = useColorMode();
  const pendingOffersForToken = usePendingOffersForToken(tokenData.idHash);
  const getExplorerAddress = useExplorerAddress();

  const items = useMemo(
    () => pendingOffersForToken.data?.pages.flatMap((page) => page.items) || [],
    [pendingOffersForToken.data],
  );

  const handleClickReviewOffer = (pendingClaim: TokenClaim) => {
    setAcceptingPendingTokenOffer(pendingClaim);
    navigate(Routes.review_token_accept_offer.path);
  };

  const handleClickCancelOffer = (pendingClaim: TokenClaim) => {
    setCancelingPendingTokenOffer(pendingClaim);
    navigate(Routes.review_token_cancel_offer.path);
  };

  if (pendingOffersForToken.isError) {
    return (
      <Center width="100%" height="100%">
        <Flex
          border="1px"
          borderColor={networkListItemSecondaryBorderColor[colorMode]}
          width="100%"
          height="80px"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="18px" color="navy.600">
            <FormattedMessage
              defaultMessage="Error fetching pending offers for token {tokenName}"
              values={{ tokenName: tokenData.name }}
            />
          </Text>
        </Flex>
      </Center>
    );
  }

  if (pendingOffersForToken.isSuccess && items.length === 0) {
    return (
      <Center width="100%" height="100%">
        <Flex
          border="1px"
          borderColor={networkListItemSecondaryBorderColor[colorMode]}
          width="100%"
          height="80px"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="18px" color="navy.600">
            <FormattedMessage defaultMessage="No pending offers" />
          </Text>
        </Flex>
      </Center>
    );
  }

  return pendingOffersForToken.isSuccess ? (
    <VStack width="100%" justifyContent="flex-start" spacing="18px">
      {items.map((pendingClaim: TokenClaim) => {
        const normalizedTimestamp = normalizeTimestamp(
          pendingClaim.lastTransactionTimestamp,
        );
        const lastTransactionTimestamp = new Date(
          normalizedTimestamp,
        ).toLocaleString();

        return (
          <Flex
            key={pendingClaim.tokenData.lastTxnVersion.toString()}
            width="100%"
            gap="12px"
            alignItems="center"
            justifyContent="center"
          >
            <VStack height="100%" alignItems="center" justifyContent="center">
              <Box width="64px" height="64px">
                <GalleryItem tokenData={pendingClaim.tokenData} />
              </Box>
            </VStack>
            <VStack width="100%" alignItems="flex-start" spacing="0.1rem">
              <Box>
                <Text fontWeight={700} fontSize="14px">
                  {pendingClaim.tokenData.name}
                </Text>
              </Box>
              <Box>
                {pendingClaim.fromAddress === activeAccountAddress ? (
                  <Flex
                    fontWeight={700}
                    fontSize="10px"
                    color="navy.600"
                    gap="4px"
                  >
                    <Flex justifyContent="center" alignItems="center" gap={1}>
                      <Icon
                        as={BsBoxArrowUpRight}
                        color={checkCircleSuccessBg[colorMode]}
                        w={3}
                        h={3}
                        cursor="pointer"
                        onClick={() =>
                          window.open(
                            getExplorerAddress(
                              `txn/${pendingClaim.lastTransactionVersion}`,
                            ),
                            '_blank',
                          )
                        }
                      />
                      <Text fontSize="10px">
                        <FormattedMessage defaultMessage="Offered to:" />
                      </Text>
                      <CreatorTag
                        address={pendingClaim.toAddress}
                        size="10px"
                      />
                    </Flex>
                  </Flex>
                ) : (
                  <Flex
                    fontWeight={700}
                    fontSize="10px"
                    color="navy.600"
                    alignItems="center"
                    gap={2}
                  >
                    <FormattedMessage
                      defaultMessage="From: {sender}"
                      values={{
                        sender: (
                          <CreatorTag
                            address={pendingClaim.fromAddress}
                            size="8px"
                          />
                        ),
                      }}
                    />
                  </Flex>
                )}
              </Box>
              <Box>
                <Text fontSize="10px" color="navy.600">
                  <FormattedMessage
                    defaultMessage="Time: {timestamp}"
                    values={{ timestamp: lastTransactionTimestamp }}
                  />
                </Text>
              </Box>
            </VStack>
            {pendingClaim.fromAddress === activeAccountAddress ? (
              <Button
                fontSize="sm"
                width="120px"
                height="36px"
                border="1px"
                borderColor={borderColor[colorMode]}
                bgColor={secondaryBgColor[colorMode]}
                onClick={() => handleClickCancelOffer(pendingClaim)}
              >
                <FormattedMessage defaultMessage="Cancel" />
              </Button>
            ) : (
              <Button
                colorScheme="salmon"
                fontSize="sm"
                width="120px"
                height="36px"
                onClick={() => handleClickReviewOffer(pendingClaim)}
              >
                <FormattedMessage defaultMessage="Review" />
              </Button>
            )}
          </Flex>
        );
      })}
      <NextPageLoader query={pendingOffersForToken} />
    </VStack>
  ) : null;
}

export default PendingOfferList;
