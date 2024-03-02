// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { ReactNode } from 'react';
import {
  Box,
  useColorMode,
  type ResponsiveValue,
  VStack,
} from '@chakra-ui/react';
import WalletFooter from 'core/components/WalletFooter';
import WalletHeader from 'core/components/WalletHeader';
import NetworkBanner from 'core/components/NetworkBanner';
import { secondaryBgColor } from '@petra/core/colors';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { DefaultNetworks } from '@petra/core/types';
import styled from '@emotion/styled';

interface BgColor {
  dark: string;
  light: string;
}
interface WalletLayoutProps {
  bgColor?: BgColor;
  borderRadius?: string[] | number[] | string;
  children: ReactNode;
  disableBackButton?: boolean;
  hasWalletFooter?: boolean;
  hasWalletHeader?: boolean;
  headerButtons?: ReactNode[];
  position?: ResponsiveValue<any>;
  showAccountCircle?: boolean;
  showBackButton?: boolean;
  title?: JSX.Element;
}

const BodyDiv = styled(Box)`
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function WalletLayout({
  bgColor = secondaryBgColor,
  children,
  hasWalletFooter = true,
  hasWalletHeader = true,
  showAccountCircle = true,
  disableBackButton = false,
  headerButtons,
  showBackButton,
  borderRadius = [],
  title,
  position,
}: WalletLayoutProps) {
  const { colorMode } = useColorMode();
  const { activeNetworkName } = useNetworks();

  const showNetworkBanner = activeNetworkName !== DefaultNetworks.Mainnet;

  return (
    <VStack
      height="100%"
      width="100%"
      bgColor={bgColor[colorMode]}
      borderRadius={borderRadius}
      position={position}
      alignItems="stretch"
      spacing={0}
    >
      <NetworkBanner showBanner={showNetworkBanner} />
      {hasWalletHeader ? (
        <WalletHeader
          showAccountCircle={showAccountCircle}
          title={title}
          showBackButton={showBackButton}
          extraButtons={headerButtons}
          disableBackButton={disableBackButton}
        />
      ) : undefined}
      <BodyDiv overflowY="auto" flexGrow={1}>
        {children}
      </BodyDiv>
      {hasWalletFooter ? <WalletFooter /> : undefined}
    </VStack>
  );
}
