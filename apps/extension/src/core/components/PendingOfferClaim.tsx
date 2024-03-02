// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  VStack,
  Box,
  Text,
  Flex,
  Button,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Routes } from 'core/routes';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { TokenClaim } from '@petra/core/types/token';
import CreatorTag from 'core/components/CreatorTag';
import {
  buttonBorderColor,
  customColors,
  secondaryButtonBgColor,
} from '@petra/core/colors';
import GalleryItem from 'core/components/GalleryItem';
import { useTokenOfferClaim } from '@petra/core/hooks/useTokenOfferClaim';
import { useNavigate } from 'react-router-dom';
import { normalizeTimestamp } from '@petra/core/transactions';

function PendingOfferClaim({ pendingToken }: { pendingToken: TokenClaim }) {
  const { activeAccountAddress } = useActiveAccount();
  const { colorMode } = useColorMode();
  const { setAcceptingPendingTokenOffer, setCancelingPendingTokenOffer } =
    useTokenOfferClaim();
  const navigate = useNavigate();

  const normalizedTimestamp = normalizeTimestamp(
    pendingToken.lastTransactionTimestamp,
  );
  const transactionTimestamp = new Date(normalizedTimestamp).toLocaleString();

  const handleClickReviewOffer = async (pendingClaim: TokenClaim) => {
    await setAcceptingPendingTokenOffer(pendingClaim);
    navigate(Routes.review_token_accept_offer.path);
  };

  const handleClickCancelOffer = async (pendingClaim: TokenClaim) => {
    await setCancelingPendingTokenOffer(pendingClaim);
    navigate(Routes.review_token_cancel_offer.path);
  };

  const isCurrentUserSender = pendingToken.fromAddress === activeAccountAddress;
  const handleClickButton = isCurrentUserSender
    ? handleClickCancelOffer
    : handleClickReviewOffer;

  const address = isCurrentUserSender
    ? pendingToken.toAddress
    : pendingToken.fromAddress;

  const addressName = isCurrentUserSender
    ? pendingToken.toAddressName
    : pendingToken.fromAddressName;

  return (
    <Flex
      key={pendingToken.tokenData.idHash}
      width="100%"
      gap="12px"
      alignItems="center"
      borderBottom="1px"
      borderColor={buttonBorderColor[colorMode]}
      pb={4}
    >
      <VStack height="100%" width="100px">
        <Box h={['48px', '56px']} w={['48px', '56px']}>
          <GalleryItem
            tokenData={{
              ...pendingToken.tokenData,
              collectionData: pendingToken.collectionData,
            }}
            padding="4px"
          />
        </Box>
      </VStack>
      <VStack width="100%" alignItems="flex-start" spacing={0.5}>
        <Box overflow="hidden" width="160px" justifyContent="flex-start">
          <Text fontWeight={700} fontSize="16px">
            {pendingToken.tokenData.name}
          </Text>
        </Box>
        <Box>
          <Flex
            fontWeight={700}
            color="navy.600"
            alignItems="center"
            fontSize="12px"
            gap={2}
          >
            {isCurrentUserSender ? (
              <FormattedMessage
                defaultMessage="To: {recipient}"
                values={{
                  recipient: addressName ? (
                    addressName.toString()
                  ) : (
                    <CreatorTag
                      address={address}
                      fontWeight={700}
                      size="10px"
                      px={2}
                    />
                  ),
                }}
              />
            ) : (
              <FormattedMessage
                defaultMessage="From: {sender}"
                values={{
                  sender: addressName ? (
                    addressName.toString()
                  ) : (
                    <CreatorTag
                      address={address}
                      fontWeight={700}
                      size="10px"
                      px={2}
                    />
                  ),
                }}
              />
            )}
          </Flex>
        </Box>
        <Box>
          <Text fontSize="10px" color="navy.600">
            <FormattedMessage
              defaultMessage="Time: {timestamp}"
              values={{ timestamp: transactionTimestamp }}
            />
          </Text>
        </Box>
      </VStack>
      {isCurrentUserSender ? (
        <Button
          aria-label="cancel"
          bgColor={secondaryButtonBgColor[colorMode]}
          border="1px"
          borderColor={customColors.navy[200]}
          fontSize="14px"
          width="170px"
          height="34px"
          onClick={() => handleClickButton(pendingToken)}
        >
          <FormattedMessage defaultMessage="Cancel Offer" />
        </Button>
      ) : (
        <Button
          aria-label="accept"
          bgColor="salmon.500"
          color="white"
          fontSize="14px"
          height="34px"
          width="170px"
          onClick={() => handleClickButton(pendingToken)}
        >
          <FormattedMessage defaultMessage="Accept" />
        </Button>
      )}
    </Flex>
  );
}

export default PendingOfferClaim;
