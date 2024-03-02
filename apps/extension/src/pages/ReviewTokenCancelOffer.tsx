// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  VStack,
  Text,
  Flex,
  HStack,
  useColorMode,
  useDisclosure,
  Button,
  Spinner,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { useTokenOfferClaim } from '@petra/core/hooks/useTokenOfferClaim';
import GalleryItem from 'core/components/GalleryItem';
import CreatorTag from 'core/components/CreatorTag';
import { UseQueryResult, useQueryClient } from 'react-query';
import { OnChainTransaction } from '@petra/core/types';
import WalletLayout from 'core/layouts/WalletLayout';
import { useTransactionSimulation } from '@petra/core/queries/transaction';
import { maxGasFeeFromEstimated } from '@petra/core/transactions';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { formatCoin } from '@petra/core/utils/coin';
import { FormattedMessage } from 'react-intl';
import {
  buttonBorderColor,
  secondaryButtonBgColor,
  textColorPrimary,
  textColorSecondary,
  secondaryGridBgColor,
} from '@petra/core/colors';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import { useNavigate } from 'react-router-dom';
import Routes from 'core/routes';
import { TokenClaim } from '@petra/core/types/token';
import { simulationRefetchInterval } from '@petra/core/constants';
import { cancelTokenOferErrorToast } from 'core/components/Toast';
import ApproveTokenTransactionDrawer from 'core/components/ApproveTokenTransactionDrawer';
import { useTransactionSubmit } from 'core/mutations/transaction';
import { getAllTokensPendingOfferClaimQueryKey } from '@petra/core/queries/useIndexedTokens';
import { getTokenPendingOfferClaimQueryKey } from '@petra/core/queries/useTokenPendingOfferClaims';
import { getAccountTokensQueryKey } from '@petra/core/queries/useTokens';

const simulationQueryKey = 'CancelToken';

function CancelTokenOfferLoading() {
  return (
    <VStack
      width="100%"
      height="100%"
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      right={0}
      bgColor="navy.900"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <img src="./loader.webp" alt="logo" height="80px" width="80px" />
      <Text
        color="white"
        textAlign="center"
        display="block"
        fontSize="20px"
        fontWeight={700}
      >
        <FormattedMessage defaultMessage="Waiting for confirmed details" />
      </Text>
      <Text color="white" textAlign="center" display="block" fontSize="16px">
        <FormattedMessage defaultMessage="The transaction has been sent" />
      </Text>
    </VStack>
  );
}

interface CancelTokenOfferErrorProps {
  error: Error;
  pendingClaim: TokenClaim;
}

function CancelTokenOfferError({
  error,
  pendingClaim,
}: CancelTokenOfferErrorProps) {
  return (
    <VStack
      width="100%"
      height="100%"
      position="absolute"
      bgColor="navy.900"
      top={0}
      left={0}
      bottom={0}
      right={0}
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
        <FormattedMessage defaultMessage="Error occured when cancelling token offer to" />
      </Text>
      <CreatorTag
        bgColor="navy.700"
        color="white"
        address={pendingClaim.toAddress}
      />
      <Text color="white" textAlign="center" as="div" fontSize="14px">
        {error.message}
      </Text>
    </VStack>
  );
}
interface CancelTokenOfferSuccessProps {
  cancelTokenOfferTxn: string;
  pendingClaim: TokenClaim;
}

function CancelTokenOfferSuccess({
  cancelTokenOfferTxn,
  pendingClaim,
}: CancelTokenOfferSuccessProps) {
  const { setCancelingPendingTokenOffer } = useTokenOfferClaim();
  const navigate = useNavigate();

  const handleClose = () => {
    setCancelingPendingTokenOffer(undefined);
    navigate(Routes.gallery.path);
  };

  const getExplorerAddress = useExplorerAddress();

  return (
    <VStack
      width="100%"
      height="100%"
      position="absolute"
      bgColor="navy.900"
      top={0}
      left={0}
      bottom={0}
      right={0}
    >
      <VStack
        justifyContent="center"
        alignItems="center"
        flex={1}
        spacing="20px"
      >
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
          <FormattedMessage defaultMessage="Offer canceled." />
        </Text>
        <Flex
          textAlign="center"
          gap="12px"
          fontSize="16px"
          flexDirection="column"
          color="white"
        >
          <FormattedMessage defaultMessage="Your NFT offer to" />
          <CreatorTag
            address={pendingClaim.fromAddress}
            bgColor="navy.700"
            color="white"
          />
          <Text as="div" color="white">
            <FormattedMessage defaultMessage="was successfully canceled" />
          </Text>
        </Flex>
      </VStack>
      <HStack width="full" p={4}>
        <Button
          width="100%"
          height="48px"
          size="md"
          border="1px"
          fontWeight={700}
          bgColor="navy.900"
          color="white"
          borderColor="white"
          rel="noreferrer"
          as="a"
          target="_blank"
          cursor="pointer"
          href={getExplorerAddress(`txn/${cancelTokenOfferTxn}`)}
        >
          <FormattedMessage defaultMessage="View Details" />
        </Button>
        <Button
          width="100%"
          height="48px"
          size="md"
          bgColor="salmon.500"
          _hover={{
            bgColor: 'salmon.300',
          }}
          color="white"
          onClick={handleClose}
        >
          <FormattedMessage defaultMessage="Close" />
        </Button>
      </HStack>
    </VStack>
  );
}

interface ReviewTokenConfirmProps {
  onCancel: () => void;
  pendingClaim: TokenClaim;
  simulateTxn: UseQueryResult<OnChainTransaction, Error>;
}

function ReviewTokenConfirm({
  onCancel,
  pendingClaim,
  simulateTxn,
}: ReviewTokenConfirmProps) {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { setCancelingPendingTokenOffer } = useTokenOfferClaim();
  const transactionTimestamp = new Date(
    pendingClaim.lastTransactionTimestamp,
  ).toLocaleString();

  const handleGoBack = () => {
    setCancelingPendingTokenOffer(undefined);
    navigate(Routes.gallery.path);
  };

  const gasFee = useMemo(() => {
    if (simulateTxn && simulateTxn.isSuccess) {
      return formatCoin(
        simulateTxn.data.gasFee * simulateTxn.data.gasUnitPrice,
        { decimals: 8 },
      );
    }
    if (!simulateTxn || simulateTxn.isError) {
      return (
        <FormattedMessage
          defaultMessage="Unable to estimate gas fee"
          description="Message to show when gas fee cannot be estimated from running simulation"
        />
      );
    }

    return simulateTxn.status;
  }, [simulateTxn]);

  return (
    <VStack width="100%" height="100%">
      <VStack width="100%" height="100%" p={4} flex={1}>
        <Flex
          width="100%"
          gap={4}
          alignItems="center"
          py={4}
          px={6}
          bgColor={secondaryGridBgColor[colorMode]}
          borderRadius="1rem"
        >
          <GalleryItem
            tokenData={pendingClaim?.tokenData}
            padding="6px"
            width="80px"
            height="80px"
          />
          <VStack
            alignItems="flex-start"
            spacing="0.1rem"
            width="240px"
            whiteSpace="nowrap"
            overflow="auto"
            textOverflow="ellipsis"
            overflowWrap="break-word"
          >
            <Text fontWeight={700} fontSize="18px" as="div">
              {pendingClaim.tokenData.name}
            </Text>
            <Text fontSize="12px" color={textColorSecondary[colorMode]}>
              {pendingClaim.tokenData.collection}
            </Text>
          </VStack>
        </Flex>
        <VStack width="100%" py={4} gap={2}>
          <Flex width="100%" justifyContent="space-between">
            <Text
              fontSize="16px"
              color={textColorSecondary[colorMode]}
              as="div"
            >
              <FormattedMessage defaultMessage="From" />
            </Text>
            <CreatorTag address={pendingClaim.fromAddress} size="14px" px={2} />
          </Flex>
          <Flex width="100%" justifyContent="space-between">
            <Text
              fontSize="16px"
              color={textColorSecondary[colorMode]}
              as="div"
            >
              <FormattedMessage defaultMessage="To" />
            </Text>
            <CreatorTag address={pendingClaim.toAddress} size="14px" px={2} />
          </Flex>
          <Flex
            width="100%"
            justifyContent="space-between"
            borderBottom="1px"
            borderColor={buttonBorderColor[colorMode]}
            pb={4}
          >
            <Text
              fontSize="14px"
              color={textColorSecondary[colorMode]}
              as="div"
            >
              <FormattedMessage defaultMessage="Date" />
            </Text>
            <Text
              fontWeight={700}
              fontSize="14px"
              color={textColorPrimary[colorMode]}
              as="div"
            >
              {transactionTimestamp}
            </Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between">
            <Text
              fontSize="14px"
              color={textColorSecondary[colorMode]}
              as="div"
            >
              <FormattedMessage defaultMessage="Token Amount" />
            </Text>
            <Text
              fontWeight={700}
              fontSize="14px"
              color={textColorPrimary[colorMode]}
              as="div"
            >
              {pendingClaim.amount}
            </Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between">
            <Text
              fontSize="14px"
              color={textColorSecondary[colorMode]}
              as="div"
            >
              <FormattedMessage defaultMessage="Gas fees" />
            </Text>
            <Text
              fontWeight={700}
              fontSize="14px"
              color={textColorPrimary[colorMode]}
              as="div"
            >
              {simulateTxn.isLoading ? (
                <Spinner aria-label="spinner" size="sm" as="span" />
              ) : (
                gasFee
              )}
            </Text>
          </Flex>
        </VStack>
      </VStack>
      <HStack
        width="full"
        borderTop="1px"
        p={4}
        borderColor={buttonBorderColor[colorMode]}
      >
        <Button
          aria-label="close"
          width="100%"
          height="48px"
          size="md"
          border="1px"
          bgColor={secondaryButtonBgColor[colorMode]}
          borderColor="navy.300"
          onClick={handleGoBack}
        >
          <FormattedMessage defaultMessage="Close" />
        </Button>
        <Button
          aria-label="cancel-offer"
          width="100%"
          height="48px"
          size="md"
          color="white"
          bgColor="salmon.500"
          _hover={{
            bgColor: 'salmon.300',
          }}
          onClick={onCancel}
          isDisabled={!simulateTxn.isSuccess}
        >
          <FormattedMessage defaultMessage="Cancel offer" />
        </Button>
      </HStack>
    </VStack>
  );
}

export default function ReviewTokenCancelOffer() {
  const { cancelingPendingTokenOffer: pendingClaim } = useTokenOfferClaim();
  const { activeAccountAddress } = useActiveAccount();
  const [error, setError] = useState<Error>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [cancelingTokenOffer, setCancelingTokenOffer] =
    useState<boolean>(false);
  const queryClient = useQueryClient();
  const [cancelTokenOfferTxn, setCancelTokenOfferTxn] = useState<string>();
  const { activeNetworkName } = useNetworks();
  const { data: coinBalance } = useAccountOctaCoinBalance(
    activeAccountAddress,
    {
      refetchInterval: simulationRefetchInterval,
    },
  );
  const payload = useMemo(
    () => ({
      arguments: [
        pendingClaim?.toAddress,
        pendingClaim?.tokenData.creator,
        pendingClaim?.tokenData.collection,
        pendingClaim?.tokenData.name,
        pendingClaim?.tokenData.propertyVersion,
      ],
      function: '0x3::token_transfers::cancel_offer_script',
      type_arguments: [],
    }),
    [pendingClaim],
  );

  const simulateTxn = useTransactionSimulation(
    [simulationQueryKey, undefined, undefined, undefined, undefined],
    payload,
    {
      cacheTime: 0,
      enabled: coinBalance !== undefined,
      refetchInterval: simulationRefetchInterval,
    },
  );

  const submitTxn = useTransactionSubmit<void>(() => payload, {
    txnOptions: {
      gasUnitPrice: simulateTxn.data?.gasUnitPrice,
      maxGasAmount: simulateTxn.data?.gasFee
        ? maxGasFeeFromEstimated(simulateTxn.data.gasFee)
        : undefined,
    },
  });

  const handleCancelTokenOffer = async () => {
    if (!pendingClaim) return;

    if (simulateTxn.error || !simulateTxn.data) {
      setError(
        simulateTxn.error ||
          new Error('Failed to run simulation. Please try again'),
      );
      cancelTokenOferErrorToast();
      return;
    }

    onClose();
    setCancelingTokenOffer(true);
    try {
      const cancelOfferTxn = await submitTxn.mutateAsync();

      await Promise.all([
        queryClient.invalidateQueries(
          getAccountTokensQueryKey(activeNetworkName, activeAccountAddress),
        ),
        queryClient.invalidateQueries(
          getAllTokensPendingOfferClaimQueryKey(
            activeNetworkName,
            activeAccountAddress,
          ),
        ),
        queryClient.invalidateQueries(
          getTokenPendingOfferClaimQueryKey(
            activeNetworkName,
            activeAccountAddress,
          ),
        ),
      ]);

      setCancelTokenOfferTxn(cancelOfferTxn.hash);
    } catch (_error) {
      const errorThrown = _error as Error;
      cancelTokenOferErrorToast();
      setError(errorThrown);
    }

    setCancelingTokenOffer(false);
  };

  if (!pendingClaim) return null;

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Cancel this offer" />}
      showBackButton
      showAccountCircle={false}
      hasWalletFooter={false}
      position="relative"
      disableBackButton={cancelingTokenOffer}
    >
      {cancelingTokenOffer ? <CancelTokenOfferLoading /> : null}
      {!cancelTokenOfferTxn && !error && !cancelingTokenOffer ? (
        <ReviewTokenConfirm
          pendingClaim={pendingClaim}
          simulateTxn={simulateTxn}
          onCancel={onOpen}
        />
      ) : null}
      {cancelTokenOfferTxn ? (
        <CancelTokenOfferSuccess
          cancelTokenOfferTxn={cancelTokenOfferTxn}
          pendingClaim={pendingClaim}
        />
      ) : null}
      {error ? (
        <CancelTokenOfferError error={error} pendingClaim={pendingClaim} />
      ) : null}
      <ApproveTokenTransactionDrawer
        isOpen={isOpen}
        simulateTxn={simulateTxn}
        onClose={onClose}
        onApprove={handleCancelTokenOffer}
        pendingClaim={pendingClaim}
        title={<FormattedMessage defaultMessage="Approve cancellation" />}
        primaryButtonLabel={<FormattedMessage defaultMessage="Cancel offer" />}
      />
    </WalletLayout>
  );
}
