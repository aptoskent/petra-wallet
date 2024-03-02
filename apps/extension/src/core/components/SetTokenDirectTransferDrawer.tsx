// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { FormattedMessage } from 'react-intl';
import React, { useMemo, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Flex,
  Text,
  Spinner,
  HStack,
  Button,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  SimpleGrid,
} from '@chakra-ui/react';
import { OnChainTransaction } from '@petra/core/types';
import { UseQueryResult } from 'react-query';
import { formatCoin } from '@petra/core/utils/coin';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { simulationRefetchInterval } from '@petra/core/constants';
import { transparentize } from 'color2k';
import {
  customColors,
  textColorSecondary,
  textColorPrimary,
  buttonBorderColor,
} from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import { useTransactionSimulation } from '@petra/core/queries/transaction';
import useTokenStoreResource from '@petra/core/queries/useTokenStoreResource';
import { maxGasFeeFromEstimated } from '@petra/core/transactions';
import useOptInToTokenDirectTransfer, {
  optInDirectTransferSimulationQueryKey,
  buildOptInDirectTransferPayload,
} from '@petra/core/mutations/directTransfer';

interface ApproveDirectTransferTokenDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function ApproveTransactionBody({
  onApprove,
  onClose,
  simulateTxn,
}: {
  onApprove: () => void;
  onClose: () => void;
  simulateTxn: UseQueryResult<OnChainTransaction, Error>;
}) {
  const { colorMode } = useColorMode();

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
    <VStack justifyContent="flex-start" width="100%" height="100%" pt={4}>
      <VStack width="100%" height="100%" px={4} gap={2} flex={1} pb={4}>
        <Heading fontSize="20px">Approve transaction</Heading>
        <Text width="100%" textAlign="center" as="div" fontSize="sm">
          <FormattedMessage defaultMessage="Changing this setting will submit an on-chain transaction and will require a gas fee." />
        </Text>
        <Flex pt={2} width="100%" justifyContent="space-between">
          <Text fontSize="14px" color={textColorSecondary[colorMode]} as="div">
            <FormattedMessage defaultMessage="Gas Fees" />
          </Text>
          <Text
            fontWeight={700}
            fontSize="14px"
            color={textColorPrimary[colorMode]}
            as="div"
          >
            {simulateTxn.isLoading ? <Spinner size="sm" as="span" /> : gasFee}
          </Text>
        </Flex>
      </VStack>
      <Box
        width="100%"
        py={4}
        borderTop="1px"
        borderColor={buttonBorderColor[colorMode]}
      >
        <SimpleGrid columns={2} px={4} width="100%" gap={2}>
          <Button
            bgColor="transparent"
            borderColor={buttonBorderColor[colorMode]}
            borderWidth="1px"
            width="100%"
            height="48px"
            onClick={onClose}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button
            width="100%"
            height="48px"
            bgColor="salmon.500"
            _hover={{
              bgColor: 'salmon.300',
            }}
            color="white"
            onClick={onApprove}
            isDisabled={!simulateTxn.isSuccess}
          >
            <FormattedMessage defaultMessage="Confirm" />
          </Button>
        </SimpleGrid>
      </Box>
    </VStack>
  );
}

function ErrorBody({
  error,
  isOptInToDirectTranfer,
}: {
  error: Error;
  isOptInToDirectTranfer: boolean;
}) {
  return (
    <VStack
      width="100%"
      height="100%"
      bgColor="navy.900"
      px={12}
      justifyContent="center"
      gap={4}
    >
      <img src="./error-animated.webp" alt="logo" height="80px" width="80px" />
      <Text
        color="white"
        textAlign="center"
        fontWeight={700}
        as="div"
        fontSize="20px"
      >
        {isOptInToDirectTranfer ? (
          <FormattedMessage defaultMessage="Error occurred when opting in to direct transfer NFTs" />
        ) : (
          <FormattedMessage defaultMessage="Error occurred when opting out of direct transfer NFTs" />
        )}
      </Text>
      <Text
        as="div"
        color="white"
        textAlign="center"
        fontSize="14px"
        width="100%"
        overflow="auto"
      >
        {error.message}
      </Text>
    </VStack>
  );
}

function SuccessBody({
  isOptInToDirectTranfer,
  onClose,
  optInTxnHash,
}: {
  isOptInToDirectTranfer: boolean;
  onClose: () => void;
  optInTxnHash: string;
}) {
  const getExplorerAddress = useExplorerAddress();

  return (
    <VStack width="100%" height="100%" bgColor="navy.900">
      <VStack flex={1} justifyContent="center" p={4}>
        <img
          src="./check-animated.webp"
          alt="logo"
          height="80px"
          width="80px"
        />
        <Text
          textAlign="center"
          fontWeight={700}
          as="div"
          fontSize="20px"
          color="white"
        >
          {isOptInToDirectTranfer ? (
            <FormattedMessage defaultMessage="Successfully opted in to direct transfer of NFTs" />
          ) : (
            <FormattedMessage defaultMessage="Successfully opted out of direct transfer of NFTs" />
          )}
        </Text>
      </VStack>
      <HStack width="full" p={4}>
        <Button
          width="100%"
          height="48px"
          size="md"
          border="1px"
          fontWeight={700}
          bgColor="navy.900"
          _hover={{
            bgColor: 'navy.700',
          }}
          color="white"
          borderColor="white"
          rel="noreferrer"
          as="a"
          target="_blank"
          cursor="pointer"
          href={getExplorerAddress(`txn/${optInTxnHash}`)}
        >
          <FormattedMessage defaultMessage="View Details" />
        </Button>
        <Button
          width="100%"
          height="48px"
          size="md"
          color="white"
          _hover={{
            bgColor: 'salmon.300',
          }}
          bgColor="salmon.500"
          onClick={onClose}
        >
          <FormattedMessage defaultMessage="Close" />
        </Button>
      </HStack>
    </VStack>
  );
}

function LoadingBody() {
  return (
    <VStack
      width="100%"
      height="100%"
      bgColor="navy.900"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <img src="./loader.webp" alt="logo" height="80px" width="80px" />
      <Text
        as="div"
        fontSize="24px"
        fontWeight={700}
        textAlign="center"
        color="white"
      >
        <FormattedMessage defaultMessage="The transaction has been sent" />
      </Text>
      <Text
        as="div"
        fontSize="24px"
        fontWeight={700}
        textAlign="center"
        color="white"
      >
        <FormattedMessage defaultMessage="Waiting for confirmed details..." />
      </Text>
    </VStack>
  );
}

function SetTokenDirectTransferDrawer({
  isOpen,
  onClose,
}: ApproveDirectTransferTokenDrawerProps) {
  const [error, setError] = useState<Error>();
  const { activeAccountAddress } = useActiveAccount();
  const tokenStoreQuery = useTokenStoreResource();
  const { data: coinBalance } = useAccountOctaCoinBalance(
    activeAccountAddress,
    {
      refetchInterval: simulationRefetchInterval,
    },
  );

  // negate the current option to toggle on -> off or off -> on
  const newIsOptInToDirectTranfer =
    !tokenStoreQuery?.data?.data.direct_transfer;

  const payload = useMemo(
    () => buildOptInDirectTransferPayload(newIsOptInToDirectTranfer),
    [newIsOptInToDirectTranfer],
  );

  const simulateTxn = useTransactionSimulation(
    [
      optInDirectTransferSimulationQueryKey,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    payload,
    {
      cacheTime: 0,
      enabled: coinBalance !== undefined,
      refetchInterval: simulationRefetchInterval,
    },
  );

  const {
    data: optInTxn,
    error: optInError,
    isLoading,
    mutateAsync,
    reset,
  } = useOptInToTokenDirectTransfer({
    gasUnitPrice: simulateTxn.data?.gasUnitPrice,
    maxGasAmount: simulateTxn.data?.gasFee
      ? maxGasFeeFromEstimated(simulateTxn.data.gasFee)
      : undefined,
  });

  const handleApprove = async () => {
    if (simulateTxn.error || !simulateTxn.data) {
      setError(
        simulateTxn.error ||
          new Error('Failed to run simulation. Please try again.'),
      );
      return;
    }

    await mutateAsync(newIsOptInToDirectTranfer);
  };

  const errorThrown = error || optInError;

  return (
    <Drawer
      size={optInTxn || errorThrown || isLoading ? 'full' : 'lg'}
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
        <DrawerBody p={0}>
          {isLoading ? <LoadingBody /> : null}
          {errorThrown ? (
            <ErrorBody
              error={errorThrown as Error}
              isOptInToDirectTranfer={newIsOptInToDirectTranfer}
            />
          ) : null}
          {!optInTxn && !errorThrown && !isLoading ? (
            <ApproveTransactionBody
              onClose={() => {
                reset();
                onClose();
              }}
              onApprove={handleApprove}
              simulateTxn={simulateTxn}
            />
          ) : null}
          {optInTxn ? (
            <SuccessBody
              isOptInToDirectTranfer={Boolean(
                tokenStoreQuery?.data?.data.direct_transfer,
              )}
              optInTxnHash={optInTxn.hash}
              onClose={() => {
                reset();
                onClose();
              }}
            />
          ) : null}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default SetTokenDirectTransferDrawer;
