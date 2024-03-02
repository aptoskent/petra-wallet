// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  VStack,
  Text,
  Flex,
  Box,
  useColorMode,
  Textarea,
  HStack,
  Icon,
  Button,
} from '@chakra-ui/react';
import { RiFileCopyLine } from '@react-icons/all-files/ri/RiFileCopyLine';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import React, { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Transition, type TransitionStatus } from 'react-transition-group';

import Copyable from 'core/components/Copyable';
import {
  secondaryTextColor,
  secondaryBorderColor,
  customColors,
  secondaryButtonBgColor,
} from '@petra/core/colors';
import RotateKeyConfirmationPopup from 'core/components/RotateKeyConfirmationPopup';
import useRotateKey from 'core/hooks/useRotateKey';
import WalletLayout from 'core/layouts/WalletLayout';
import { Routes } from 'core/routes';

const transitionDuration = 200;

export default function RotateKey() {
  const { colorMode } = useColorMode();
  const ref = useRef(null);
  const [hasRotatedKey, setHasRotatedKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { activeAccount } = useActiveAccount();
  const navigate = useNavigate();
  const { rotateKey } = useRotateKey();

  // This page is only available when the account is local
  if (activeAccount.type !== 'local') {
    return null;
  }

  const onRotateKeyStart = () => setIsLoading(true);
  const onRotateKeySuccess = () => setHasRotatedKey(true);
  const onRotateKeyComplete = () => {
    setShowPopup(false);
    setIsLoading(false);
  };

  const handleRotateKey = async () => {
    onRotateKeyStart();
    await rotateKey({
      onRotateKeyComplete,
      onRotateKeySuccess,
    });
    onRotateKeyComplete();
  };

  return (
    <Box width="100%" height="100%" position="relative">
      <WalletLayout
        title={<FormattedMessage defaultMessage="Rotate Key" />}
        showBackButton
        showAccountCircle={false}
        hasWalletFooter={false}
      >
        <Flex width="100%" height="100%" flexDirection="column">
          <Box width="100%" mt={4} flex={1} px={4}>
            <Flex>
              <Text fontSize="md" fontWeight={700} flex={1}>
                {hasRotatedKey ? (
                  <FormattedMessage defaultMessage="New private key" />
                ) : (
                  <FormattedMessage defaultMessage="Rotate your private key" />
                )}
              </Text>
              <Copyable
                prompt={<FormattedMessage defaultMessage="Copy private key" />}
                value={activeAccount.privateKey}
              >
                <HStack alignItems="center" height="100%">
                  <Text fontSize="md" fontWeight={500} textAlign="center">
                    <FormattedMessage defaultMessage="Copy" />
                  </Text>
                  <Icon
                    as={RiFileCopyLine}
                    my="auto"
                    w={3}
                    h={3}
                    margin="auto"
                  />
                </HStack>
              </Copyable>
            </Flex>
            <Textarea
              marginTop={4}
              color={secondaryTextColor[colorMode]}
              height={18}
              readOnly
              variant="filled"
              fontSize="md"
              value={activeAccount.privateKey}
            />
          </Box>
          <Box
            borderTop="1px"
            px={4}
            mt={4}
            width="100%"
            borderColor={secondaryBorderColor[colorMode]}
            paddingTop={4}
          >
            {!hasRotatedKey ? (
              <Button
                py={6}
                width="100%"
                colorScheme="salmon"
                color="white"
                onClick={() => setShowPopup(true)}
              >
                <FormattedMessage defaultMessage="Rotate" />
              </Button>
            ) : null}
            {hasRotatedKey ? (
              <VStack width="100%" spacing={2}>
                <Copyable
                  prompt={
                    <FormattedMessage defaultMessage="Copy private key" />
                  }
                  value={activeAccount.privateKey}
                  as="div"
                  width="100%"
                >
                  <Button
                    width="100%"
                    bgColor={secondaryButtonBgColor[colorMode]}
                    border="1px"
                    borderColor={customColors.navy[200]}
                  >
                    <FormattedMessage defaultMessage="Copy" />
                  </Button>
                </Copyable>
                <Button
                  width="100%"
                  colorScheme="salmon"
                  color="white"
                  onClick={() =>
                    navigate(Routes.manage_account_show_recovery_phrase.path, {
                      state: { hasRotatedKey },
                    })
                  }
                >
                  <FormattedMessage defaultMessage="Next" />
                </Button>
              </VStack>
            ) : null}
          </Box>
        </Flex>
      </WalletLayout>
      <Transition in={showPopup} timeout={transitionDuration} nodeRef={ref}>
        {(state: TransitionStatus) => (
          <RotateKeyConfirmationPopup
            bodyWidth="320px"
            isOpen={showPopup}
            state={state}
            isLoading={isLoading}
            onRotateKey={async () => {
              await handleRotateKey();
            }}
            onCancel={() => {
              setShowPopup(false);
            }}
          />
        )}
      </Transition>
    </Box>
  );
}
