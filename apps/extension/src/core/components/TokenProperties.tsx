// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Text, VStack, useColorMode } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { ExtendedTokenData } from '@petra/core/types';
import {
  assetSecondaryBgColor,
  secondaryAttributeColor,
  networkListItemSecondaryBorderColor,
} from '@petra/core/colors';

function TokenProperties() {
  const { state } = useLocation();
  const tokenData = state as ExtendedTokenData;
  const { colorMode } = useColorMode();

  const properties = Object.entries(tokenData?.tokenProperties || {});

  return (
    <Flex width="100%" gap={2} flexWrap="wrap">
      {properties.length > 0 ? (
        properties.map(([propertyKey, propertyValue]) => (
          <VStack
            key={propertyKey}
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
              {propertyKey}
            </Text>
            <Text fontSize="md" fontWeight={500}>
              {propertyValue}
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
            <FormattedMessage defaultMessage="No properties" />
          </Text>
        </Flex>
      )}
    </Flex>
  );
}

export default TokenProperties;
