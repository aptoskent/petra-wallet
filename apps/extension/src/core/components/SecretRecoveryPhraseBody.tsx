// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useEffect, useRef, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Center,
  Tooltip,
  Flex,
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  useColorMode,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { BsDot } from '@react-icons/all-files/bs/BsDot';
import { AiFillInfoCircle } from '@react-icons/all-files/ai/AiFillInfoCircle';
import { AiOutlineEyeInvisible } from '@react-icons/all-files/ai/AiOutlineEyeInvisible';
import { secondaryHeaderInputBgColor } from '@petra/core/colors';
import { type CreateWalletFormValues } from 'core/layouts/CreateWalletLayout';
import { useFormContext } from 'react-hook-form';
import { Transition, type TransitionStatus } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

const borderColor = {
  dark: 'gray.700',
  light: 'white',
};

const infoIconColor = {
  dark: 'white',
  light: '#C7D2E2',
};

const textColor = {
  dark: 'white',
  light: '#525F7A',
};

const duration = 300;

const defaultStyle = {
  height: '100%',
  opacity: 0,
  position: 'absolute' as 'absolute',
  transition: `opacity ${duration}ms ease-in-out`,
  width: '100%',
  zIndex: 2,
};

const transformStyles = {
  entered: { opacity: 1 },
  entering: { opacity: 0.5 },
  exited: { opacity: 0 },
  exiting: { opacity: 0.5 },
  unmounted: { opacity: 0 },
};

const coverBgColor = {
  dark: 'gray.700',
  light: 'gray.200',
};

const timeout = 200;

type SecretRecoveryPhraseOverlayProps = {
  showSecretRecoveryPhrase: boolean;
};

const SecretRecoveryPhraseOverlay = React.forwardRef(
  ({ showSecretRecoveryPhrase }: SecretRecoveryPhraseOverlayProps, ref) => {
    const { setValue } = useFormContext<CreateWalletFormValues>();
    const { colorMode } = useColorMode();

    return (
      <Transition
        in={!showSecretRecoveryPhrase}
        timeout={timeout}
        nodeRef={ref as Ref<HTMLElement>}
      >
        {(state: TransitionStatus) => (
          <Box
            width="100%"
            height="100%"
            bgColor={coverBgColor[colorMode]}
            onClick={() => setValue('showSecretRecoveryPhrase', true)}
            style={{
              ...defaultStyle,
              ...transformStyles[state],
            }}
          >
            <Center width="100%" height="100%">
              <VStack alignItems="center" width="200px">
                <AiOutlineEyeInvisible size={60} color="#BCCADC" />
                <Flex
                  width="100%"
                  height="100%"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Text
                    fontWeight="bold"
                    textAlign="center"
                    fontSize={18}
                    textColor={textColor[colorMode]}
                  >
                    <FormattedMessage defaultMessage="Click to reveal phrase" />
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize={14}
                    textColor={textColor[colorMode]}
                  >
                    <FormattedMessage defaultMessage="Make sure that nobody can see your screen." />
                  </Text>
                </Flex>
              </VStack>
            </Center>
          </Box>
        )}
      </Transition>
    );
  },
);

interface LocationState {
  hasRotatedKey: boolean;
}

export default function SecretRecoveryPhraseBody() {
  const { colorMode } = useColorMode();
  const { setValue, watch } = useFormContext<CreateWalletFormValues>();
  const mnemonic = watch('mnemonic');
  const showSecretRecoveryPhrase = watch('showSecretRecoveryPhrase');
  const ref = useRef(null);
  const { state } = useLocation();

  const hasRotatedKey = useMemo(
    () => (state as LocationState)?.hasRotatedKey,
    [state],
  );

  useEffect(
    () => () => {
      // hide the secret recovery phrase when exit the recovery view
      setValue('showSecretRecoveryPhrase', false);
      setValue('savedSecretRecoveryPhrase', false);
    },
    [setValue],
  );

  return (
    <VStack
      pt={3}
      maxH="100%"
      overflowY="auto"
      alignItems="left"
      flex="1"
      marginBottom={0.5}
    >
      <Heading fontSize="1.2rem">
        {hasRotatedKey ? (
          <FormattedMessage defaultMessage="Your new secret recovery phrase" />
        ) : (
          <FormattedMessage defaultMessage="Secret recovery phrase" />
        )}
      </Heading>
      <HStack
        alignItems="flex-start"
        height="100%"
        width="100%"
        maxHeight="48px"
      >
        <Text fontSize="xs">
          <FormattedMessage defaultMessage="This 12-word phrase allows you to recover your wallet and access to the coins inside." />
        </Text>
        <Tooltip
          label={
            <Flex flexDirection="column">
              <Text>
                <FormattedMessage defaultMessage="Wallet recovery scenarios" />
              </Text>
              <HStack height="18px">
                <Box width="24px">
                  <BsDot size={36} />
                </Box>
                <Text>
                  <FormattedMessage defaultMessage="New browsers / Device" />
                </Text>
              </HStack>
              <HStack height="18px">
                <Box width="24px">
                  <BsDot size={36} />
                </Box>
                <Text>
                  <FormattedMessage defaultMessage="Reinstall your extension" />
                </Text>
              </HStack>
            </Flex>
          }
          shouldWrapChildren
          placement="top"
        >
          <Box>
            <AiFillInfoCircle size={20} color={infoIconColor[colorMode]} />
          </Box>
        </Tooltip>
      </HStack>
      <VStack pt={2} width="100%" spacing={4}>
        <SimpleGrid columns={2} gap={4} position="relative">
          <VStack key="first-column">
            {mnemonic.slice(0, 6).map((item: string, index: number) => (
              <InputGroup
                key={item}
                fontWeight="bold"
                border={borderColor[colorMode]}
              >
                <InputLeftElement color="navy.600">{`${
                  index + 1
                }.`}</InputLeftElement>
                <Input
                  readOnly
                  variant="outline"
                  value={item}
                  key={item}
                  bgColor={secondaryHeaderInputBgColor[colorMode]}
                  fontWeight={600}
                />
              </InputGroup>
            ))}
          </VStack>
          <VStack key="second-column">
            {mnemonic.slice(6, 12).map((item: string, index: number) => (
              <InputGroup
                key={item}
                fontWeight="bold"
                border={borderColor[colorMode]}
              >
                <InputLeftElement color="navy.600">{`${
                  index + 7
                }.`}</InputLeftElement>
                <Input
                  readOnly
                  variant="outline"
                  value={item}
                  key={item}
                  bgColor={secondaryHeaderInputBgColor[colorMode]}
                  fontWeight={600}
                />
              </InputGroup>
            ))}
          </VStack>
          <SecretRecoveryPhraseOverlay
            showSecretRecoveryPhrase={showSecretRecoveryPhrase}
            ref={ref}
          />
        </SimpleGrid>
      </VStack>
    </VStack>
  );
}
