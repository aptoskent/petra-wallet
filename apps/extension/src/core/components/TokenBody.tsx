// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Divider, Heading, Link, VStack, useColorMode } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import { ExtendedTokenData } from '@petra/core/types';
import SquareBox from 'core/components/SquareBox';
import GalleryImage from 'core/components/GalleryImage';
import TokenActivity from 'core/components/TokenActivity';
import PendingOfferList from 'core/components/PendingOfferList';
import TokenAttributes from 'core/components/TokenAttributes';
import TokenProperties from 'core/components/TokenProperties';
import TokenDetails from 'core/components/TokenDetails';
import TokenDescription from 'core/components/TokenDescription';
import { tokenBgColor } from '@petra/core/colors';

function TokenBody() {
  const { state } = useLocation();
  const tokenData = state as ExtendedTokenData;
  const { data: tokenMetadata } = useTokenMetadata(tokenData);
  const { colorMode } = useColorMode();

  const imageUri =
    tokenMetadata?.animation_url ||
    tokenMetadata?.image ||
    tokenData.metadataUri;

  const sections = [
    {
      component: <TokenDescription />,
      title: <FormattedMessage defaultMessage="Description" />,
    },
    {
      component: <TokenDetails />,
      title: <FormattedMessage defaultMessage="Details" />,
    },
    {
      component: <TokenAttributes />,
      title: <FormattedMessage defaultMessage="Attributes" />,
    },
    {
      component: <TokenProperties />,
      title: <FormattedMessage defaultMessage="On-Chain Properties" />,
    },
    {
      component: <PendingOfferList />,
      title: <FormattedMessage defaultMessage="Pending offers" />,
    },
    {
      component: <TokenActivity />,
      title: <FormattedMessage defaultMessage="History" />,
    },
  ];

  return (
    <VStack alignItems="stretch">
      <SquareBox p={8} bgColor={tokenBgColor[colorMode]}>
        <Link target="_blank" href={imageUri} rel="noreferrer">
          <GalleryImage imageSrc={imageUri} />
        </Link>
      </SquareBox>
      <VStack
        alignItems="stretch"
        mt={1}
        p={4}
        divider={<Divider />}
        spacing={6}
      >
        {sections.map(({ component, title }, i) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <VStack key={i} alignItems="start" spacing={3}>
            <Heading size="md">{title}</Heading>
            {component}
          </VStack>
        ))}
      </VStack>
    </VStack>
  );
}

export default TokenBody;
