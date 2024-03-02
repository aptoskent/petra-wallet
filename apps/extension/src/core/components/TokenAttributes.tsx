// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Text, VStack, useColorMode } from '@chakra-ui/react';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import { useLocation } from 'react-router-dom';
import { ExtendedTokenData } from '@petra/core/types';
import {
  assetSecondaryBgColor,
  secondaryAttributeColor,
  networkListItemSecondaryBorderColor,
} from '@petra/core/colors';
import { MetadataJsonAttribute } from '@petra/core/types/tokenMetadata';

function TokenAttributes() {
  const { state } = useLocation();
  const tokenData = state as ExtendedTokenData;
  const { colorMode } = useColorMode();
  const { data: tokenMetadata } = useTokenMetadata(tokenData);
  const attributes = tokenMetadata?.attributes ?? [];
  if (attributes.length === 0) {
    attributes.push({
      trait_type: 'Token Standard',
      value: tokenData.tokenStandard,
    });
  }
  return (
    <Flex width="100%" gap={2} flexWrap="wrap">
      {attributes.length > 0 ? (
        attributes.map((attribute: MetadataJsonAttribute) => (
          <VStack
            key={attribute.trait_type}
            alignItems="start"
            spacing="0px"
            bgColor={assetSecondaryBgColor[colorMode]}
            padding="12px"
            borderRadius="6px"
          >
            <Text
              fontSize="sm"
              fontWeight={300}
              color={secondaryAttributeColor[colorMode]}
            >
              {attribute.trait_type}
            </Text>
            <Text fontSize="md" fontWeight={500}>
              {attribute.value}
            </Text>
          </VStack>
        ))
      ) : (
        <Flex
          border="1px"
          borderColor={networkListItemSecondaryBorderColor[colorMode]}
          width="100%"
          height="80px"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="18px" color="navy.600">
            <FormattedMessage defaultMessage="No attributes" />
          </Text>
        </Flex>
      )}
    </Flex>
  );
}

export default TokenAttributes;
