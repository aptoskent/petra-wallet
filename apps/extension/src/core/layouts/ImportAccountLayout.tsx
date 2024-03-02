// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, Grid, useColorMode } from '@chakra-ui/react';
import { secondaryBgColor } from '@petra/core/colors';
import ImportAccountHeader from 'core/components/ImportAccountHeader';

interface WalletLayoutProps {
  backPage?: string;
  children: React.ReactNode;
  headerValue?: JSX.Element;
}

export default function ImportAccountLayout({
  backPage,
  children,
  headerValue = <FormattedMessage defaultMessage="Import account" />,
}: WalletLayoutProps) {
  const { colorMode } = useColorMode();

  return (
    <Grid
      height="100%"
      width="100%"
      maxW="100%"
      templateRows="80px 1fr"
      bgColor={secondaryBgColor[colorMode]}
    >
      <ImportAccountHeader backPage={backPage} headerValue={headerValue} />
      <Box maxH="100%" overflowY="auto" pb={4}>
        {children}
      </Box>
    </Grid>
  );
}
