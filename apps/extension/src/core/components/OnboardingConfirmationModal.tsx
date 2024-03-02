// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Center,
  Text,
  Button,
  useColorMode,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';
import { bgColorButtonPopup, customColors } from '@petra/core/colors';
import { BsFillShieldFill } from '@react-icons/all-files/bs/BsFillShieldFill';

const bgColorPopup = {
  dark: 'gray.800',
  light: 'white',
};

interface ConfirmationModalProps {
  bodyWidth?: string;
  finalRef: React.RefObject<any>;
  isLoading: boolean;
  isOpen: boolean;
  primaryBttnOnClick: () => void;
  secondaryBttnOnClick: () => void;
}

function ConfirmationModal({
  bodyWidth = '260px',
  finalRef,
  isLoading,
  isOpen,
  primaryBttnOnClick,
  secondaryBttnOnClick,
}: ConfirmationModalProps) {
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Modal
        autoFocus
        closeOnEsc
        isCentered
        closeOnOverlayClick
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={secondaryBttnOnClick}
      >
        <ModalOverlay />
        <ModalContent width="375px" height="362px">
          <VStack
            bgColor={bgColorPopup[colorMode]}
            alignContent="center"
            p={4}
            height="100%"
            borderRadius={8}
          >
            <VStack
              height="100%"
              width={bodyWidth || '260px'}
              justifyContent="center"
              flex={1}
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
                    bgColor="rgba(0, 191, 165, 0.1)"
                    borderRadius={100}
                    width="75px"
                    height="75px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <BsFillShieldFill
                      size={36}
                      color={customColors.teal[100]}
                    />
                  </Box>
                </Center>
                <Text fontSize={23} fontWeight="bold">
                  <FormattedMessage defaultMessage="Keep your phrase safe!" />
                </Text>
              </Box>
              <Box width="100%" display="flex" textAlign="center">
                <Text fontSize={16}>
                  <FormattedMessage defaultMessage="If you lose it you'll have no way of accessing your assets." />
                </Text>
              </Box>
            </VStack>
            <Box width="100%" display="flex" flexDirection="column" gap={3}>
              <Button
                bgColor={bgColorButtonPopup[colorMode]}
                border="1px"
                borderColor="navy.300"
                height="48px"
                isDisabled={isLoading || false}
                variant="solid"
                width="100%"
                onClick={secondaryBttnOnClick}
              >
                <FormattedMessage defaultMessage="Show phrase again" />
              </Button>
              <Button
                colorScheme="salmon"
                height="48px"
                color="white"
                isLoading={isLoading || false}
                variant="solid"
                width="100%"
                onClick={primaryBttnOnClick}
              >
                <FormattedMessage defaultMessage="Done" />
              </Button>
            </Box>
          </VStack>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ConfirmationModal;
