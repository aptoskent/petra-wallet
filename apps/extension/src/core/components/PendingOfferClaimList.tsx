// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { VStack, Spinner, Center, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { TokenClaim } from '@petra/core/types/token';
import useAccountTokensPendingOfferClaims from '@petra/core/queries/useTokenPendingOfferClaims';
import PendingOfferClaim from 'core/components/PendingOfferClaim';
import PendingHiddenOfferClaim from 'core/components/PendingHiddenOfferClaim';
import NextPageLoader from 'core/components/NextPageLoader';

function PendingOfferClaimList({
  showHiddenOffers = false,
  showViewHiddenOffer = false,
}: {
  showHiddenOffers?: boolean;
  showViewHiddenOffer?: boolean;
}) {
  const { activeAccountAddress } = useActiveAccount();

  const pendingClaims = useAccountTokensPendingOfferClaims(
    activeAccountAddress,
    showHiddenOffers,
    {
      refetchInterval: 5000,
    },
  );
  const {
    data: pendingOfferClaims,
    isError: pendingOfferClaimsIsError,
    isFetchingNextPage: pendingOfferClaimsIsFetchingNextPage,
    isLoading: pendingOfferClaimsIsLoading,
    isSuccess: pendingOfferClaimsIsSuccess,
  } = pendingClaims;

  const items = useMemo(
    () => pendingOfferClaims?.pages.flatMap((page) => page.items) || [],
    [pendingOfferClaims],
  );

  if (pendingOfferClaimsIsLoading || pendingOfferClaimsIsFetchingNextPage) {
    return (
      <Center height="100%" alignItems="center">
        <Spinner size="xl" aria-label="spinner" />
      </Center>
    );
  }

  if (pendingOfferClaimsIsError) {
    return (
      <Center height="100%" fontSize="20px">
        <FormattedMessage defaultMessage="Error fetching pending token offers & claims" />
      </Center>
    );
  }

  if (pendingOfferClaimsIsSuccess && items.length === 0) {
    return (
      <VStack height="100%">
        <PendingHiddenOfferClaim />
        <VStack height="100%" fontSize="20px" justifyContent="center">
          <Text as="div" textAlign="center" fontWeight={700}>
            <FormattedMessage defaultMessage="No pending token offers & claims" />
          </Text>
          <Text
            as="div"
            textAlign="center"
            color="navy.500"
            fontSize={16}
            px={6}
          >
            <FormattedMessage defaultMessage="Your offers received, and pending collectibles sent will show up here." />
          </Text>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack width="100%" spacing="20px">
      {pendingOfferClaimsIsSuccess && items.length > 0 ? (
        <>
          <VStack width="100%">
            {items.map((pendingToken: TokenClaim) => (
              <PendingOfferClaim
                pendingToken={pendingToken}
                key={pendingToken.lastTransactionTimestamp}
              />
            ))}
          </VStack>
          <NextPageLoader query={pendingClaims} />
        </>
      ) : null}
      {showViewHiddenOffer ? <PendingHiddenOfferClaim /> : null}
    </VStack>
  );
}

export default PendingOfferClaimList;
