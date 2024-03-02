// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, LegacyRef, forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Center,
  Text,
  Button,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import type { TransitionStatus } from 'react-transition-group';
import { bgColorButtonPopup } from '@petra/core/colors';
import styled from '@emotion/styled';
import { RiErrorWarningFill } from '@react-icons/all-files/ri/RiErrorWarningFill';

const bgColorOverlay = {
  dark: 'rgba(191, 191, 191, 0.5)',
  light: 'rgba(171, 183, 183, 0.5)',
};

const bgColorPopup = {
  dark: 'gray.800',
  light: 'white',
};

interface ConfirmationPopupProps {
  bodyWidth?: string;
  isLoading?: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onRotateKey: () => void;
  state: TransitionStatus;
}

interface BackdropProps {
  children: JSX.Element;
  state: TransitionStatus;
}

const transitionStyles = {
  entered: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 2 },
  entering: { backgroundColor: 'rgba(0, 0, 0, 0)', zIndex: -2 },
  exited: {},
  exiting: {},
  unmounted: {},
};

const BackdropContainer = styled(Box)`
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 200ms ease-in-out, z-index 200ms ease-in-out;
  z-index: -2;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  ${(props: { state: TransitionStatus }) => transitionStyles[props.state]}
`;

const ConfirmationBackdrop = forwardRef(
  ({ children, state }: BackdropProps, ref) => {
    const { colorMode } = useColorMode();

    return (
      <BackdropContainer
        ref={ref as LegacyRef<HTMLDivElement>}
        className="modal-backdrop"
        flexDirection="column-reverse"
        bgColor={bgColorOverlay[colorMode]}
        state={state}
      >
        {children}
      </BackdropContainer>
    );
  },
);

const PopupTransitionStyles = {
  entered: { transform: 'translateY(0)' },
  entering: { transform: 'translateY(100%)' },
  exited: {},
  exiting: {},
  unmounted: {},
};

const ConfirmationContainer = styled(Box)`
  ${(props: { state: TransitionStatus }) => PopupTransitionStyles[props.state]}
`;

function RotateKeyConfirmationPopup({
  bodyWidth = '260px',
  isLoading,
  isOpen,
  onCancel,
  onRotateKey,
  state,
}: ConfirmationPopupProps) {
  const { colorMode } = useColorMode();
  const ref = useRef(null);

  return (
    <ConfirmationBackdrop ref={ref} state={state}>
      <ConfirmationContainer
        flexDirection="column"
        bgColor={bgColorPopup[colorMode]}
        alignContent="flex-end"
        height="60%"
        p={4}
        borderTopRadius={8}
        opacity={1}
        justifyContent="center"
        transform="translateY(100%)"
        transition="transform 200ms ease-in-out"
        state={state}
      >
        {isOpen && (
          <VStack width="100%" height="100%">
            <Center
              mx="auto"
              mb={4}
              display="flex"
              flexDirection="column"
              height="100%"
              width={bodyWidth}
              justifyContent="center"
              flex="1"
            >
              <Box
                pb={4}
                width="100%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                textAlign="center"
              >
                <Center pb={4} width="100%" height="100%">
                  <Box
                    bgColor="rgba(243, 168, 69, 0.1)"
                    borderRadius={100}
                    width="75px"
                    height="75px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <RiErrorWarningFill size={36} color="#F3A845" />
                  </Box>
                </Center>
                <Text fontSize={23} fontWeight="bold">
                  <FormattedMessage defaultMessage="Are you sure?" />
                </Text>
              </Box>
              <Box width="100%" display="flex" textAlign="center">
                <Text fontSize={16}>
                  <FormattedMessage defaultMessage="Rotating your private key will generate a new secret recovery phrase." />
                </Text>
              </Box>
            </Center>
            <Box
              key="button"
              width="100%"
              display="flex"
              flexDirection="column"
              gap={3}
            >
              <Button
                bgColor={bgColorButtonPopup[colorMode]}
                border="1px"
                borderColor="navy.300"
                height="48px"
                isDisabled={isLoading || false}
                variant="solid"
                width="100%"
                onClick={onCancel}
              >
                <FormattedMessage defaultMessage="Cancel" />
              </Button>
              <Button
                colorScheme="salmon"
                height="48px"
                color="white"
                isLoading={isLoading || false}
                variant="solid"
                width="100%"
                onClick={onRotateKey}
              >
                <FormattedMessage defaultMessage="Yes, rotate key" />
              </Button>
            </Box>
          </VStack>
        )}
      </ConfirmationContainer>
    </ConfirmationBackdrop>
  );
}

export default RotateKeyConfirmationPopup;
