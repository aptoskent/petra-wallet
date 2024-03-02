// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Center,
  Spinner,
  Button,
  Text,
  VStack,
  useColorMode,
  SimpleGrid,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { secondaryButtonBgColor } from '@petra/core/colors';
import GalleryItem from 'core/components/GalleryItem';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import NextPageLoader from 'core/components/NextPageLoader';
import { useAccountTokens } from '@petra/core/queries/useTokens';

const marketplaces = [
  {
    name: 'topaz.so',
    url: 'https://topaz.so',
  },
  {
    name: 'souffl3.com',
    url: 'https://souffl3.com',
  },
  {
    name: 'bluemove.net',
    url: 'https://bluemove.net/',
  },
  {
    name: 'seashrine.io',
    url: 'https://seashrine.io/',
  },
];

function NoCollectedTokens() {
  const { colorMode } = useColorMode();
  return (
    <VStack height="100%" py={4} px={8} justifyContent="center">
      <VStack px={4} pb={4}>
        <Text
          fontSize="2xl"
          textAlign="center"
          fontWeight={700}
          display="block"
        >
          <FormattedMessage defaultMessage="No collectibles yet." />
        </Text>
        <Text color="navy.500" textAlign="center">
          <FormattedMessage defaultMessage="Check out these marketplaces to get your first Aptos NFTs." />
        </Text>
      </VStack>
      {marketplaces.map((marketplace) => (
        <Link
          key={marketplace.name}
          width="100%"
          href={marketplace.url}
          target="_blank"
        >
          <Button
            border="1px"
            borderColor="navy.300"
            width="100%"
            bgColor={secondaryButtonBgColor[colorMode]}
          >
            {marketplace.name}
          </Button>
        </Link>
      ))}
    </VStack>
  );
}

function CollectedTokens() {
  const { activeAccountAddress } = useActiveAccount();
  const tokens = useAccountTokens(activeAccountAddress);

  const allTokens = tokens.isSuccess
    ? tokens.data.pages.flatMap((page) => page.items.map((token) => token))
    : [];

  return (
    <>
      {tokens.isLoading ? (
        <Center height="100%">
          <Spinner size="lg" />
        </Center>
      ) : null}
      {tokens.isSuccess && allTokens.length === 0 ? (
        <NoCollectedTokens />
      ) : null}
      {tokens.isSuccess && allTokens.length > 0 ? (
        <>
          <SimpleGrid columns={2} spacing={2}>
            {allTokens.map((token) => (
              <GalleryItem
                key={token.idHash}
                tokenData={token}
                padding="12px"
              />
            ))}
          </SimpleGrid>
          <NextPageLoader query={tokens} />
        </>
      ) : null}
      {tokens.isError ? (
        <Center height="100%" fontSize="xl">
          <FormattedMessage defaultMessage="Failed retrieving collectibles" />
        </Center>
      ) : null}
    </>
  );
}

export default CollectedTokens;
