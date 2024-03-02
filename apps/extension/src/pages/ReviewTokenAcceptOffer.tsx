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
import { UseQueryResult, useQueryClient } from 'react-query';
import { OnChainTransaction } from '@petra/core/types';
import { useTokenOfferClaim } from '@petra/core/hooks/useTokenOfferClaim';
import GalleryItem from 'core/components/GalleryItem';
import { maxGasFeeFromEstimated } from '@petra/core/transactions';
import WalletLayout from 'core/layouts/WalletLayout';
import { useTransactionSimulation } from '@petra/core/queries/transaction';
import { useAppState } from '@petra/core/hooks/useAppState';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { formatCoin } from '@petra/core/utils/coin';
import {
  hideTokenToast,
  acceptTokenOferErrorToast,
} from 'core/components/Toast';
import {
  buttonBorderColor,
  secondaryButtonBgColor,
  textColorPrimary,
  textColorSecondary,
  secondaryGridBgColor,
} from '@petra/core/colors';
import { FormattedMessage } from 'react-intl';
import CreatorTag from 'core/components/CreatorTag';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { useNavigate } from 'react-router-dom';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import Routes from 'core/routes';
import { TokenClaim } from '@petra/core/types/token';
import { simulationRefetchInterval } from '@petra/core/constants';
import ApproveTokenTransactionDrawer from 'core/components/ApproveTokenTransactionDrawer';
import { useTransactionSubmit } from 'core/mutations/transaction';
import { getAllTokensPendingOfferClaimQueryKey } from '@petra/core/queries/useIndexedTokens';
import { getTokenPendingOfferClaimQueryKey } from '@petra/core/queries/useTokenPendingOfferClaims';
import { getAccountTokensQueryKey } from '@petra/core/queries/useTokens';

const simulationQueryKey = 'ClaimToken';

function ReviewTokenLoading() {
  return (
    <VStack
      width="100%"
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      right={0}
      height="100%"
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

interface ClaimedTokenErrorProps {
  error: Error;
  pendingClaim: TokenClaim;
}

function ClaimedTokenError({ error, pendingClaim }: ClaimedTokenErrorProps) {
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
        <FormattedMessage defaultMessage="Error occured when claiming token offer from" />
      </Text>
      <CreatorTag
        bgColor="navy.700"
        color="white"
        address={pendingClaim.fromAddress}
      />
      <Text
        as="div"
        color="white"
        fontSize="14px"
        textAlign="start"
        width="100%"
        overflow="auto"
      >
        {error.message}
      </Text>
    </VStack>
  );
}

interface ClaimedTokenSuccessProps {
  claimedTokenTxn: string;
  pendingClaim: TokenClaim;
}

function ClaimedTokenSuccess({
  claimedTokenTxn,
  pendingClaim,
}: ClaimedTokenSuccessProps) {
  const { setAcceptingPendingTokenOffer } = useTokenOfferClaim();
  const getExplorerAddress = useExplorerAddress();
  const navigate = useNavigate();

  const handleClose = () => {
    setAcceptingPendingTokenOffer(undefined);
    navigate(Routes.gallery.path);
  };

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
          <FormattedMessage defaultMessage="The offer was accepted!" />
        </Text>
        <Flex
          textAlign="center"
          gap="12px"
          flexDirection="column"
          px={12}
          fontSize="16px"
          color="white"
        >
          <FormattedMessage
            defaultMessage="{token} was successfully claimed from {account}"
            values={{
              account: (
                <CreatorTag
                  address={pendingClaim.fromAddress}
                  bgColor="navy.700"
                  color="white"
                />
              ),
              token: pendingClaim.tokenData.name,
            }}
          />
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
          href={getExplorerAddress(`txn/${claimedTokenTxn}`)}
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
          onClick={handleClose}
        >
          <FormattedMessage defaultMessage="Close" />
        </Button>
      </HStack>
    </VStack>
  );
}

interface ReviewTokenConfirmProps {
  onAccept: () => void;
  pendingClaim: TokenClaim;
  simulateTxn: UseQueryResult<OnChainTransaction, Error>;
}

function ReviewTokenConfirm({
  onAccept,
  pendingClaim,
  simulateTxn,
}: ReviewTokenConfirmProps) {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { hiddenTokens, updatePersistentState } = useAppState();
  const { setAcceptingPendingTokenOffer } = useTokenOfferClaim();
  const { activeAccountAddress } = useActiveAccount();

  const handleGoBack = () => {
    setAcceptingPendingTokenOffer(undefined);
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

  const transactionTimestamp = new Date(
    pendingClaim.lastTransactionTimestamp,
  ).toLocaleString();

  const handleHideTokenOffer = async () => {
    const { lastTransactionVersion } = pendingClaim;
    const { idHash } = pendingClaim.tokenData;
    const tokenKey = `${idHash}_${lastTransactionVersion}`;

    const oldHiddenTokensByAddress = hiddenTokens?.[activeAccountAddress] || {};

    /*
      addressA: {
        tokenA: true // tokenA offer is hidden for addressA
      },
      addressB: {
        tokenB: true // tokenB offer is hidden for addressB
      }
    */
    await updatePersistentState({
      hiddenTokens: {
        ...hiddenTokens,
        [activeAccountAddress]: {
          ...oldHiddenTokensByAddress,
          [tokenKey]: true,
        },
      },
    });

    handleGoBack();
    hideTokenToast(pendingClaim.tokenData.name, pendingClaim.fromAddress);
  };

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
            flex={1}
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
          aria-label="hide"
          width="100%"
          height="48px"
          size="md"
          border="1px"
          bgColor={secondaryButtonBgColor[colorMode]}
          borderColor="navy.300"
          onClick={handleHideTokenOffer}
        >
          <FormattedMessage defaultMessage="Hide" />
        </Button>
        <Button
          aria-label="accept"
          width="100%"
          height="48px"
          size="md"
          bgColor="salmon.500"
          _hover={{
            bgColor: 'salmon.300',
          }}
          color="white"
          onClick={onAccept}
          isDisabled={!simulateTxn.isSuccess}
        >
          <FormattedMessage defaultMessage="Accept" />
        </Button>
      </HStack>
    </VStack>
  );
}

export default function ReviewTokenAcceptOffer() {
  const { acceptingPendingTokenOffer: pendingClaim } = useTokenOfferClaim();
  const { activeAccountAddress } = useActiveAccount();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [claimingToken, setClaimingToken] = useState<boolean>(false);
  const [claimedTokenTxn, setClaimedTokenTxn] = useState<string>();
  const [error, setError] = useState<Error>();
  const queryClient = useQueryClient();
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
        pendingClaim?.fromAddress,
        pendingClaim?.tokenData.creator,
        pendingClaim?.tokenData.collection,
        pendingClaim?.tokenData.name,
        pendingClaim?.tokenData.propertyVersion,
      ],
      function: '0x3::token_transfers::claim_script',
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

  const handleClaimToken = async () => {
    if (!pendingClaim) return;

    if (simulateTxn.error || !simulateTxn.data) {
      setError(
        simulateTxn.error ||
          new Error('Failed to run simulation. Please try again'),
      );
      acceptTokenOferErrorToast();
      return;
    }

    onClose();
    setClaimingToken(true);
    try {
      const claimTokenOfferTxn = await submitTxn.mutateAsync();
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

      setClaimedTokenTxn(claimTokenOfferTxn.hash);
    } catch (_error) {
      const errorThrown = _error as Error;
      setError(errorThrown);
      acceptTokenOferErrorToast();
    }

    setClaimingToken(false);
  };

  if (!pendingClaim) return null;

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Accept this offer" />}
      showBackButton
      showAccountCircle={false}
      hasWalletFooter={false}
      position="relative"
      disableBackButton={claimingToken}
    >
      {claimingToken ? <ReviewTokenLoading /> : null}
      {!claimedTokenTxn && !error && !claimingToken ? (
        <ReviewTokenConfirm
          pendingClaim={pendingClaim}
          simulateTxn={simulateTxn}
          onAccept={onOpen}
        />
      ) : null}
      {claimedTokenTxn ? (
        <ClaimedTokenSuccess
          claimedTokenTxn={claimedTokenTxn}
          pendingClaim={pendingClaim}
        />
      ) : null}
      {error ? (
        <ClaimedTokenError error={error} pendingClaim={pendingClaim} />
      ) : null}
      <ApproveTokenTransactionDrawer
        simulateTxn={simulateTxn}
        isOpen={isOpen}
        onClose={onClose}
        onApprove={handleClaimToken}
        pendingClaim={pendingClaim}
        title={<FormattedMessage defaultMessage="Approve transaction" />}
        primaryButtonLabel={<FormattedMessage defaultMessage="Accept offer" />}
      />
    </WalletLayout>
  );
}
