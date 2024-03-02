// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Center,
  Grid,
  Icon,
  Text,
  Flex,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { settingsItemLabel } from '@petra/core/constants';
import {
  secondaryGridHoverBgColor,
  textColor,
  secondaryAddressFontColor,
} from '@petra/core/colors';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import ChakraLink from './ChakraLink';

interface BgColorDictType {
  dark: string;
  light: string;
}

export interface SettingsListItemProps {
  externalLink?: string | null;
  hoverBgColorDict?: BgColorDictType;
  iconAfter?: any | undefined;
  iconBefore?: any | undefined;
  network?: any;
  onClick?: (() => Promise<void>) | (() => void);
  path: string | null;
  textColorDict?: BgColorDictType;
  title: string;
}

export default function SettingsListItem({
  hoverBgColorDict = secondaryGridHoverBgColor,
  textColorDict = textColor,
  externalLink,
  iconAfter,
  iconBefore,
  path,
  network,
  title,
  onClick,
}: SettingsListItemProps) {
  const { colorMode } = useColorMode();
  const { activeAccount } = useActiveAccount();
  const getExplorerAddress = useExplorerAddress();

  const renderTitle = useMemo(() => {
    if (title === settingsItemLabel.NETWORK) {
      return (
        <Flex gap={2}>
          <FormattedMessage defaultMessage="Network" />
          <Text color={secondaryAddressFontColor[colorMode]}>
            {network?.name}
          </Text>
        </Flex>
      );
    }

    return title;
  }, [network, title, colorMode]);

  const templateColumns = useMemo(() => {
    if (iconBefore && iconAfter) {
      return '32px 1fr 32px';
    }
    if (iconBefore) {
      return '32px 1fr';
    }
    return '1fr 32px';
  }, [iconBefore, iconAfter]);

  const settingsListItemContent = useMemo(
    () => (
      <Grid
        templateColumns={templateColumns}
        p={3}
        width="100%"
        cursor="pointer"
        onClick={onClick}
        gap={2}
        borderRadius=".5rem"
        _hover={{
          bgColor: hoverBgColorDict[colorMode],
        }}
      >
        {iconBefore ? (
          <Center width="100%">
            <Icon
              fontSize="xl"
              borderColor={textColorDict[colorMode]}
              color={textColorDict[colorMode]}
              as={iconBefore}
            />
          </Center>
        ) : null}
        <Flex color={textColorDict[colorMode]} fontWeight={600} fontSize="md">
          {renderTitle}
        </Flex>
        {iconAfter ? (
          <Center width="100%">
            <Icon
              fontSize="xl"
              borderColor={textColorDict[colorMode]}
              color={secondaryAddressFontColor[colorMode]}
              as={iconAfter}
            />
          </Center>
        ) : null}
      </Grid>
    ),
    [
      colorMode,
      onClick,
      hoverBgColorDict,
      iconAfter,
      iconBefore,
      renderTitle,
      templateColumns,
      textColorDict,
    ],
  );

  const settingsListItemContentWithRedirects = useMemo(() => {
    if (externalLink) {
      return (
        <VStack
          as="a"
          width="100%"
          alignItems="flex-start"
          href={externalLink}
          target="_blank"
          rel="noreferrer"
        >
          {settingsListItemContent}
        </VStack>
      );
    }
    if (path) {
      return (
        <ChakraLink width="100%" to={path}>
          {settingsListItemContent}
        </ChakraLink>
      );
    }
    if (title === settingsItemLabel.EXPLORER) {
      const explorerAddress = activeAccount?.address
        ? getExplorerAddress(`account/${activeAccount.address}`)
        : getExplorerAddress();
      return (
        <VStack
          as="a"
          width="100%"
          alignItems="flex-start"
          href={explorerAddress}
          target="_blank"
          rel="noreferrer"
        >
          {settingsListItemContent}
        </VStack>
      );
    }

    return settingsListItemContent;
  }, [
    activeAccount.address,
    externalLink,
    getExplorerAddress,
    path,
    settingsListItemContent,
    title,
  ]);

  return (
    <VStack width="100%" alignItems="flex-start">
      {settingsListItemContentWithRedirects}
    </VStack>
  );
}
