// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { PropsWithChildren } from 'react';
import { VStack, Box, Link, Center, HStack } from '@chakra-ui/react';
import { PetraWhiteLogo } from 'core/components/PetraLogo';
import { MdHelp } from '@react-icons/all-files/md/MdHelp';

function FullscreenLayoutHeader() {
  return (
    <HStack
      w="100%"
      position="absolute"
      py={['10px', '14px', '18px']}
      px={['12px', '48px']}
      fontSize="20px"
      color="white"
      justifyContent="space-between"
      zIndex={2}
    >
      <Link
        href="https://petra.app"
        target="_blank"
        rel="noreferrer"
        display="flex"
        alignItems="center"
        gap="4px"
        cursor="pointer"
      >
        <Box w={[4, 5, 6]} h={[4, 5, 6]}>
          <PetraWhiteLogo />
        </Box>
        Petra
      </Link>
      <Link
        href="https://discord.com/invite/petrawallet"
        target="_blank"
        rel="noreferrer"
        display="flex"
        alignItems="center"
        gap={[0.5, 1, 1.5]}
      >
        <MdHelp color="white" />
        Help
      </Link>
    </HStack>
  );
}

export default function FullscreenLayout({ children }: PropsWithChildren) {
  return (
    <VStack
      w="100%"
      h="100%"
      spacing={0}
      bgGradient="url('/background.svg')"
      backgroundSize="cover"
    >
      <FullscreenLayoutHeader />
      <Center w="100%" h="100%">
        {children}
      </Center>
    </VStack>
  );
}
