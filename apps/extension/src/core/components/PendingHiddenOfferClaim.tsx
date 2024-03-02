// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  VStack,
  Spinner,
  Center,
  Text,
  Flex,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Routes from 'core/routes';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import ChakraLink from 'core/components/ChakraLink';
import { useTokenPendingClaims } from '@petra/core/queries/useIndexedTokens';
import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight';
import { buttonBorderColor } from '@petra/core/colors';

const hoverBgColor = {
  dark: 'navy.700',
  light: 'navy.100',
};

function PendingHiddenOfferClaim() {
  const { activeAccountAddress } = useActiveAccount();
  const { colorMode } = useColorMode();

  const {
    data: pendingOfferClaimsData,
    isError: pendingOfferClaimsError,
    isLoading: pendingOfferClaimsLoading,
  } = useTokenPendingClaims(
    activeAccountAddress,
    {
      refetchInterval: 5000,
    },
    true,
  );

  if (pendingOfferClaimsLoading) {
    return (
      <Center h="100%">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (pendingOfferClaimsError || !pendingOfferClaimsData) {
    return (
      <Center height="100%" fontSize="20px">
        <FormattedMessage defaultMessage="Error fetching pending token offers & claims" />
      </Center>
    );
  }

  if (pendingOfferClaimsData.length === 0) {
    return null;
  }

  return (
    <ChakraLink
      to={Routes.view_hidden_pending_token_offer.path}
      width="100%"
      m="0px!important"
    >
      <Flex
        width="100%"
        alignItems="center"
        cursor="pointer"
        _hover={{
          bgColor: hoverBgColor[colorMode],
        }}
        borderBottom="1px"
        borderColor={buttonBorderColor[colorMode]}
        p={4}
      >
        <VStack width="100%" alignItems="flex-start" spacing={0}>
          <Text fontWeight={700} as="div">
            <FormattedMessage
              defaultMessage="View hidden ({count})"
              values={{ count: pendingOfferClaimsData.length }}
            />
          </Text>
        </VStack>
        <BiChevronRight size="24px" />
      </Flex>
    </ChakraLink>
  );
}

export default PendingHiddenOfferClaim;
