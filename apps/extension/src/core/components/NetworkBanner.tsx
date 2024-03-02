// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useColorMode,
  Box,
  keyframes,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { Routes } from 'core/routes';
import { DefaultNetworks } from '@petra/core/types';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { Transition, type TransitionStatus } from 'react-transition-group';

const defaultNetworkBannerBgColor = {
  dark: 'navy.800',
  light: 'navy.100',
};

const defaultNetworkTextColor = {
  dark: 'white',
  light: 'navy.800',
};

interface NetworkBannerProps {
  showBanner: boolean;
}

const transitionStyles = {
  entered: { opacity: 1 },
  entering: { opacity: 0.5 },
  exited: { opacity: 0 },
  exiting: { opacity: 0.5 },
  unmounted: { opacity: 0 },
};

const defaultStyle = {
  opacity: 0,
  transition: 'opacity 500ms ease-in-out',
};

function PulsatingDot() {
  const pulsate = keyframes`
    0% {
        box-shadow: 0 0 0 0 rgba(250,128,114, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(250,128,114, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(250,128,114, 0);
    }
    `;
  return (
    <Box
      border="3px"
      bgColor="salmon.500"
      borderRadius="50%"
      height="14px"
      width="14px"
      boxShadow="0 0 0 rgba(250,128,114, 0.4)"
      animation={`${pulsate} infinite 2s`}
    />
  );
}

function NetworkBanner({ showBanner }: NetworkBannerProps) {
  const { colorMode } = useColorMode();
  const { pathname } = useLocation();

  const bgColor = useMemo(() => {
    switch (pathname) {
      case Routes.wallet.path:
      case Routes.switchAccount.path:
        return 'navy.700';
      default:
        return defaultNetworkBannerBgColor[colorMode];
    }
  }, [colorMode, pathname]);

  const ref = useRef(null);
  const { activeNetworkName, switchNetwork } = useNetworks();

  return (
    <Transition in={showBanner} timeout={500} nodeRef={ref}>
      {(state: TransitionStatus) =>
        showBanner && (
          <HStack
            height="40px"
            flexShrink={0}
            px={4}
            spacing={3}
            overflow="hidden"
            bgColor={bgColor || defaultNetworkBannerBgColor[colorMode]}
            color={
              bgColor === 'navy.700'
                ? 'white'
                : defaultNetworkTextColor[colorMode]
            }
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <PulsatingDot />
            <Text fontWeight={700} fontSize="md" flexGrow={1}>
              {activeNetworkName}
            </Text>
            <Button
              variant="unstyled"
              fontSize="sm"
              fontWeight="regular"
              textDecoration="underline"
              onClick={() => switchNetwork(DefaultNetworks.Mainnet)}
            >
              <FormattedMessage defaultMessage="Switch to Mainnet" />
            </Button>
          </HStack>
        )
      }
    </Transition>
  );
}

export default NetworkBanner;
