// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  useColorMode,
  VStack,
  Heading,
  Flex,
  Text,
  Button,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { useIntl, FormattedMessage } from 'react-intl';
import { transparentize } from 'color2k';
import React, { useMemo } from 'react';
import { UseQueryResult } from 'react-query';
import { OnChainTransaction } from '@petra/core/types';
import { buttonBorderColor, customColors } from '@petra/core/colors';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import { TokenClaim } from '@petra/core/types/token';
import { formatCoin } from '@petra/core/utils/coin';
import GalleryImage from './GalleryImage';

interface ApproveTransactionDrawerProps {
  isOpen: boolean;
  onApprove: () => void;
  onClose: () => void;
  pendingClaim: TokenClaim;
  primaryButtonLabel?: JSX.Element;
  simulateTxn: UseQueryResult<OnChainTransaction, Error>;
  title?: JSX.Element;
}

function ApproveTokenTransactionDrawer({
  isOpen,
  onApprove,
  onClose,
  pendingClaim,
  primaryButtonLabel = <FormattedMessage defaultMessage="Accept" />,
  simulateTxn,
  title = <FormattedMessage defaultMessage="Approve transaction" />,
}: ApproveTransactionDrawerProps) {
  const { colorMode } = useColorMode();
  const tokenMetadata = useTokenMetadata(pendingClaim.tokenData);
  const intl = useIntl();

  const gasFee = useMemo(() => {
    if (simulateTxn && simulateTxn.isSuccess) {
      return formatCoin(
        simulateTxn.data.gasFee * simulateTxn.data.gasUnitPrice,
        { decimals: 8 },
      );
    }

    return (
      <FormattedMessage
        defaultMessage="Unable to estimate gas fee"
        description="Message to show when gas fee cannot be estimated from running simulation"
      />
    );
  }, [simulateTxn]);

  return (
    <Drawer
      size="lg"
      autoFocus
      isOpen={isOpen}
      closeOnOverlayClick
      closeOnEsc
      onClose={onClose}
      placement="bottom"
    >
      <DrawerOverlay
        bgColor={transparentize(customColors.navy[900], 0.5)}
        backdropFilter="blur(1rem)"
      />
      <DrawerContent className="drawer-content" borderTopRadius=".5rem">
        <DrawerCloseButton />
        <DrawerBody p={0}>
          <VStack justifyContent="flex-start" width="100%" height="100%" pt={4}>
            <VStack
              justifyContent="flex-start"
              width="100%"
              height="100%"
              px={4}
              gap={6}
              flex={1}
            >
              <Heading fontSize="24px">{title}</Heading>
              <Flex width="100%" gap={4}>
                <Box width="60px" height="60px">
                  <GalleryImage
                    imageSrc={tokenMetadata.data?.image}
                    name={tokenMetadata.data?.name || ''}
                    padding="4px"
                  />
                </Box>
                <VStack alignItems="flex-start">
                  <Text fontWeight={700} fontSize="14px">
                    {pendingClaim.tokenData.name}
                  </Text>
                  <Text color="navy.600" fontSize="12px">
                    {pendingClaim.tokenData.collection}
                  </Text>
                  <Text color="navy.600" fontSize="12px">
                    <FormattedMessage
                      defaultMessage="Gas fee: {gasFee}"
                      values={{ gasFee }}
                      description="Gas fee label in approve token transaction drawer"
                    />
                  </Text>
                </VStack>
              </Flex>
            </VStack>
            <Box
              width="100%"
              borderTop="1px"
              py={4}
              borderColor={buttonBorderColor[colorMode]}
            >
              <VStack px={4} width="100%">
                <Button
                  aria-label={intl.formatMessage({ defaultMessage: 'approve' })}
                  width="100%"
                  height="48px"
                  bgColor="salmon.500"
                  _hover={{
                    bgColor: 'salmon.300',
                  }}
                  isDisabled={!simulateTxn.isSuccess}
                  color="white"
                  onClick={onApprove}
                >
                  {primaryButtonLabel}
                </Button>
                <Button
                  aria-label={intl.formatMessage({ defaultMessage: 'cancel' })}
                  width="100%"
                  height="48px"
                  onClick={onClose}
                >
                  <FormattedMessage defaultMessage="Cancel" />
                </Button>
              </VStack>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default ApproveTokenTransactionDrawer;
