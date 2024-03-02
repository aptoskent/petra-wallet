// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { Center, Text, VStack, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Routes from 'core/routes';
import { DesktopOnboardingContext } from 'onboarding/components/DesktopOnboarding';

function Welcome() {
  const navigate = useNavigate();
  const { isDesktopOnboarding, setIsDesktopOnboarding } = useContext(
    DesktopOnboardingContext,
  );

  useEffect(() => {
    setTimeout(() => {
      if (isDesktopOnboarding) {
        setIsDesktopOnboarding(false);
      } else {
        navigate(Routes.wallet.path);
      }
    }, 2500);
  }, [navigate, setIsDesktopOnboarding, isDesktopOnboarding]);

  return (
    <Center
      height="100%"
      width="100%"
      alignItems="center"
      bgColor="navy.900"
      bgGradient="url('/background.svg')"
    >
      <VStack width="100%" justifyContent="center">
        <Image
          src="./petra-loading.webp"
          alt="animating-logo"
          boxSize="200px"
        />
        <Text
          fontSize="30px"
          textAlign="center"
          fontWeight="bold"
          lineHeight="120%"
          color="white"
          width="220px"
        >
          <FormattedMessage defaultMessage="Welcome to your wallet" />
        </Text>
      </VStack>
    </Center>
  );
}

export default Welcome;
