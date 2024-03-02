// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Grid,
  Icon,
  Link,
  Text,
  VStack,
  Wrap,
  useColorMode,
  type ColorMode,
} from '@chakra-ui/react';
import { TiCloudStorage } from '@react-icons/all-files/ti/TiCloudStorage';
import AccountCircle from 'core/components/AccountCircle';
import { useLocation } from 'react-router-dom';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import { ExtendedTokenData } from '@petra/core/types';
import ArweaveLogo from 'core/components/ArweaveLogo';
import IPFSlogo from 'core/components/IPFSLogo';
import CollectionIcon from 'core/components/CollectionIcon';
import GalleryImage from 'core/components/GalleryImage';
import CreatorTag from 'core/components/CreatorTag';
import {
  tokenDetailsTextColor,
  storageIconColor,
  secondaryAttributeColor,
} from '@petra/core/colors';
import { MetadataJsonCreator } from '@petra/core/types/tokenMetadata';
import useTokenStorageProvider, {
  StorageProvider,
} from '@petra/core/hooks/useTokenStorageProvider';

const storageProviderIcons = (colorMode: ColorMode) => ({
  [StorageProvider.Arweave]: <ArweaveLogo />,
  [StorageProvider.Generic]: (
    <Icon
      fontSize="28px"
      as={TiCloudStorage}
      color={storageIconColor[colorMode]}
    />
  ),
  [StorageProvider.IPFS]: <IPFSlogo />,
});

function TokenDetails() {
  const { state } = useLocation();
  const { colorMode } = useColorMode();
  const tokenData = state as ExtendedTokenData;
  const { collectionData } = tokenData;
  const { data: tokenMetadata } = useTokenMetadata(tokenData);
  const creators = tokenMetadata?.properties?.creators?.map(
    (c: MetadataJsonCreator) => c.address,
  ) ?? [tokenData.creator];

  const { collectionImgSrc, provider, tokenImgSrc } =
    useTokenStorageProvider(tokenData);

  const storageProviderIcon = storageProviderIcons(colorMode)[provider];

  return (
    <VStack alignItems="stretch" spacing={4}>
      <Grid templateColumns="40px 1fr" gap={6}>
        <Box pt={1} height="50px" width="44px" margin="auto">
          <Link target="_blank" href={collectionImgSrc} rel="noreferrer">
            <GalleryImage imageSrc={collectionImgSrc} />
          </Link>
          {!collectionData && <Icon fontSize="32px" as={CollectionIcon} />}
        </Box>
        <Box>
          <Text
            fontSize="s"
            fontWeight={400}
            color={secondaryAttributeColor[colorMode]}
          >
            <FormattedMessage defaultMessage="Collection" />
          </Text>
          <Text
            fontSize="md"
            fontWeight={600}
            textColor={tokenDetailsTextColor[colorMode]}
          >
            {tokenData.collection}
          </Text>
        </Box>
      </Grid>
      <Grid templateColumns="40px 1fr" gap={6}>
        <Box pt={1} width="40px" borderRadius={1000} margin="auto">
          <AccountCircle
            account={{
              address: creators?.[0],
              privateKey: '',
              publicKey: '',
            }}
            size={40}
          />
        </Box>
        <Box>
          <Text
            fontSize="s"
            fontWeight={400}
            color={secondaryAttributeColor[colorMode]}
          >
            <FormattedMessage defaultMessage="Created by" />
          </Text>
          <Box fontSize="md" fontWeight={700}>
            <Wrap>
              {creators.map((address: string) => (
                <CreatorTag key={address} address={address} />
              ))}
            </Wrap>
          </Box>
        </Box>
      </Grid>
      {tokenImgSrc ? (
        <Grid templateColumns="40px 1fr" gap={6}>
          <Box pt={1} margin="auto">
            {storageProviderIcon}
          </Box>
          <VStack alignItems="flex-start" justifyContent="center" spacing={0}>
            <Text
              fontSize="md"
              fontWeight={400}
              color={secondaryAttributeColor[colorMode]}
            >
              <FormattedMessage defaultMessage="Metadata storage" />
            </Text>
            <Flex>
              <Link
                fontSize="md"
                textDecoration="none"
                href={tokenImgSrc}
                target="_blank"
                display="flex"
                alignItems="center"
                gap="8px"
              >
                <FormattedMessage
                  defaultMessage="View on {storageProvider}"
                  values={{ storageProvider: provider }}
                />
                <ExternalLinkIcon />
              </Link>
            </Flex>
          </VStack>
        </Grid>
      ) : null}
    </VStack>
  );
}

export default TokenDetails;
