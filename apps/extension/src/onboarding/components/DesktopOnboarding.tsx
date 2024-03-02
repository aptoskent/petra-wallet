// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, Ref, useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, VStack, Box, Text, Link, Heading, Icon } from '@chakra-ui/react';
import { PetraWhiteLogo, PetraSalmonLogo } from 'core/components/PetraLogo';
import { MdHelp } from '@react-icons/all-files/md/MdHelp';
import { useAccounts } from '@petra/core/hooks/useAccounts';
import { Transition, type TransitionStatus } from 'react-transition-group';
import styled from '@emotion/styled';
import AptosDesktopOnboardingLogo from './AptosDesktopOnboardingLogo';
import ExtensionIcon from './ExtensionIcon';

interface OnboardingContainerProps {
  children: JSX.Element | null;
}

export const boxShadow = 'rgba(149, 157, 165, 0.2) 0px 0px 8px 4px';

const transitionStylesLeft: { [key: string]: any } = {
  entered: { opacity: 0, transform: 'translateX(25vw)' },
  entering: { opacity: 0, transform: 'translateX(12.5vw)' },
  exited: {},
  exiting: {},
  unmounted: {},
};

const transitionStylesRight = {
  entered: { opacity: 1, transform: 'translateX(-25vw)' },
  entering: { opacity: 1, transform: 'translateX(-12.5vw)' },
  exited: {},
  exiting: {},
  unmounted: {},
};

const TransitionLeft = styled(VStack)`
  opacity: 1;
  transform: translateX(0vw);
  transition: transform 800ms ease-in-out, opacity 800ms ease-in-out;
  ${(props: { state: TransitionStatus }) => transitionStylesLeft[props.state]}
`;

const TransitionRight = styled(Flex)<{ state: TransitionStatus }>`
  opacity: 1;
  position: absolute;
  z-index: 10;
  ${(props: { state: TransitionStatus }) => transitionStylesRight[props.state]}
`;

interface DesktopOnboardingContextProps {
  isDesktopOnboarding: boolean;
  setIsDesktopOnboarding: (isOnboarding: boolean) => void;
}

export const DesktopOnboardingContext =
  React.createContext<DesktopOnboardingContextProps>({
    isDesktopOnboarding: false,
    setIsDesktopOnboarding: () => {},
  });

/**
 * This container is used to wrap the extension app and provides onboarding experience
 * @param children the wrapped app
 */
export default function DesktopOnboarding({
  children,
}: OnboardingContainerProps) {
  const [isDesktopOnboarding, setIsDesktopOnboarding] =
    useState<boolean>(false);

  const { activeAccountAddress } = useAccounts();
  const ref = useRef(null);

  const context = useMemo(
    () => ({ isDesktopOnboarding, setIsDesktopOnboarding }),
    [isDesktopOnboarding, setIsDesktopOnboarding],
  );

  return (
    <DesktopOnboardingContext.Provider value={context}>
      <VStack
        w="100vw"
        h="100vh"
        spacing={0}
        pb="120px"
        bgGradient="url('/background.svg')"
        backgroundSize="cover"
        position="relative"
      >
        <Flex
          w="100%"
          position="absolute"
          pt={['10px', '14px', '18px']}
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
            <FormattedMessage defaultMessage="Petra" />
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
            <FormattedMessage defaultMessage="Help" />
          </Link>
        </Flex>
        <Flex
          pt={['96px', '128px', '160px']}
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Transition
            in={isDesktopOnboarding}
            timeout={800}
            nodeRef={ref as Ref<HTMLElement>}
          >
            {(state: TransitionStatus) =>
              !activeAccountAddress && (
                <TransitionLeft
                  w="100%"
                  h="100%"
                  color="white"
                  alignItems="center"
                  justifyContent="center"
                  state={state}
                >
                  <VStack flex={1} justifyContent="center">
                    <Box
                      h={['80px', '90px', '100px']}
                      w={['70px', '90px', '100px']}
                    >
                      <PetraSalmonLogo />
                    </Box>
                    <Text color="white" fontSize={['50px', '60px', '70px']}>
                      <FormattedMessage defaultMessage="Petra" />
                    </Text>
                    <Flex justifyContent="center">
                      <Text
                        color="navy.300"
                        fontSize={['lg', 'xl', '2xl']}
                        mb="12px"
                        textAlign="center"
                      >
                        <FormattedMessage defaultMessage="Guiding your web3 journey." />
                      </Text>
                    </Flex>
                  </VStack>
                  <Flex justifyContent="center" alignItems="center" gap="2px">
                    <Text color="navy.600" fontSize="sm">
                      <FormattedMessage defaultMessage="By" />
                    </Text>
                    <Box>
                      <AptosDesktopOnboardingLogo />
                    </Box>
                    <Text
                      color="navy.600"
                      fontSize="8px"
                      alignSelf="end"
                      marginBottom="0.5"
                    >
                      <FormattedMessage defaultMessage="LABS" />
                    </Text>
                  </Flex>
                </TransitionLeft>
              )
            }
          </Transition>
          <Transition
            in={!activeAccountAddress && isDesktopOnboarding}
            timeout={800}
            nodeRef={ref as Ref<HTMLElement>}
          >
            {(state: TransitionStatus) =>
              (!activeAccountAddress || isDesktopOnboarding) && (
                <VStack
                  w="100%"
                  h="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <TransitionRight
                    maxW={['300px', '400px', '500px']}
                    maxH={['570px', '620px', '670px']}
                    w={['300px', '400px', '500px']}
                    h={['570px', '620px', '670px']}
                    state={state}
                    transition={
                      !activeAccountAddress
                        ? 'transform 800ms ease-in-out, opacity 800ms ease-in-out'
                        : undefined
                    }
                  >
                    {children}
                  </TransitionRight>
                </VStack>
              )
            }
          </Transition>
          {activeAccountAddress && !isDesktopOnboarding ? (
            <VStack
              w="100%"
              minWidth="500px"
              h="100%"
              px="20%"
              color="white"
              gap={4}
            >
              <Box w="48px" h="48px">
                <PetraSalmonLogo />
              </Box>
              <Heading size={['lg', 'xl', '2xl']} textAlign="center">
                <FormattedMessage defaultMessage="Welcome to your wallet" />
              </Heading>
              <VStack fontSize="18px" textAlign="center" color="white" gap={10}>
                <VStack>
                  <Flex alignItems="center" gap={2}>
                    <FormattedMessage defaultMessage="Next: Go to" />
                    <Icon as={ExtensionIcon} display="inline-flex" />
                    <FormattedMessage defaultMessage="in the upper right and" />
                  </Flex>
                  <Flex justifyContent="center">
                    <FormattedMessage defaultMessage="pin the Petra wallet to your browser" />
                  </Flex>
                </VStack>
                <video autoPlay width="600px" loop>
                  <source src="./onboarding.webm" type="video/webm" />
                  <track src="" kind="captions" srcLang="" label="" />
                </video>
              </VStack>
            </VStack>
          ) : null}
        </Flex>
      </VStack>
    </DesktopOnboardingContext.Provider>
  );
}
