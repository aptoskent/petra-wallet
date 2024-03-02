// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Flex,
  Grid,
  IconButton,
  StackProps,
  Text,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  secondaryBackButtonBgColor,
  secondaryBgColor,
  secondaryBorderColor,
} from '@petra/core/colors';

export interface FullscreenExtensionContainerHeaderProps {
  hideBackButton?: boolean;
  title: JSX.Element;
}

export function FullscreenExtensionContainerHeader({
  hideBackButton,
  title,
}: FullscreenExtensionContainerHeaderProps) {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1 as any);
  };

  return (
    <Grid
      maxW="100%"
      width="100%"
      height="100px"
      px={12}
      flexShrink={0}
      templateColumns={!hideBackButton ? '50px 1fr' : '1fr'}
      borderBottomColor={secondaryBorderColor[colorMode]}
      borderBottomWidth="1px"
      alignItems="center"
    >
      {!hideBackButton && (
        <IconButton
          size="lg"
          aria-label="back"
          colorScheme="salmon"
          icon={<ArrowBackIcon fontSize={26} />}
          variant="filled"
          onClick={handleClickBack}
          bgColor={secondaryBackButtonBgColor[colorMode]}
          borderRadius="1rem"
        />
      )}
      <Flex width="100%" marginLeft={4}>
        <Text fontSize={20} fontWeight={600}>
          {title}
        </Text>
      </Flex>
    </Grid>
  );
}

export function FullscreenExtensionContainerFooter({
  children,
}: PropsWithChildren) {
  const { colorMode } = useColorMode();
  return (
    <VStack
      flexShrink={0}
      p={4}
      px={12}
      alignItems="stretch"
      borderTopColor={secondaryBorderColor[colorMode]}
      borderTopWidth="1px"
    >
      {children}
    </VStack>
  );
}

export function FullscreenExtensionContainerBody({
  children,
}: PropsWithChildren) {
  return (
    <VStack
      flexGrow={1}
      flexShrink={0}
      alignItems="stretch"
      overflowY="auto"
      spacing={0}
      px={12}
      py={6}
    >
      {children}
    </VStack>
  );
}

export function FullscreenExtensionContainer(props: StackProps) {
  const { colorMode } = useColorMode();
  return (
    <VStack
      w={['300px', '400px', '500px']}
      h={['570px', '620px', '670px']}
      borderRadius="2rem"
      overflow="hidden"
      alignItems="stretch"
      bgColor={secondaryBgColor[colorMode]}
      {...props}
    />
  );
}
