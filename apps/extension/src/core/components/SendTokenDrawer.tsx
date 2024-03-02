// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useCallback, useEffect } from 'react';
import { UseQueryResult, useQueryClient } from 'react-query';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { formatCoin } from '@petra/core/utils/coin';
import { maxGasFeeFromEstimated } from '@petra/core/transactions';
import { BsPlus } from '@react-icons/all-files/bs/BsPlus';
import { BiMinus } from '@react-icons/all-files/bi/BiMinus';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import { useFetchAccountResource } from '@petra/core/queries/useAccountResources';
import { useForm, useFormContext, FormProvider } from 'react-hook-form';
import { OnChainTransaction } from '@petra/core/types';
import { transparentize } from 'color2k';
import { offerTokenErrorToast } from 'core/components/Toast';
import { FormattedMessage } from 'react-intl';
import {
  primaryTextColor,
  customColors,
  secondaryMediumBorderColor,
} from '@petra/core/colors';
import {
  Button,
  Text,
  Input,
  useColorMode,
  Tooltip,
  VStack,
  Spinner,
  RadioGroup,
  Stack,
  Radio,
  Center,
  Box,
  Flex,
  Icon,
  HStack,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import { TokenData, ExtendedTokenData } from '@petra/core/types/token';
import { BsDot } from '@react-icons/all-files/bs/BsDot';
import { AiFillInfoCircle } from '@react-icons/all-files/ai/AiFillInfoCircle';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import { RiSendPlaneFill } from '@react-icons/all-files/ri/RiSendPlaneFill';
import { useTransactionSubmit } from 'core/mutations/transaction';
import { useTransactionSimulation } from '@petra/core/queries/transaction';
import Routes from 'core/routes';
import {
  simulationRefetchInterval,
  tokenStoreStructTag,
} from '@petra/core/constants';
import {
  generateDirectTransferPayloadV2,
  generateDirectTransferPayloadV1,
  generateOfferPayloadV1,
} from '@petra/core/utils/token';
import CreatorTag from './CreatorTag';
import GalleryImage from './GalleryImage';
import TransferHeader from './TransferHeader';

const SEND_TOKEN_METHOD = {
  DIRECT_TRANSFER: 'direct_transfer',
  OFFER: 'offer',
};

type SendTokenPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

const secondaryTextColor = {
  dark: 'navy.500',
  light: 'navy.600',
};

const simulationOfferTokenQueryKey = 'offerTokenSimulation';
const simulationDirectTransferTokenQueryKey = 'directTransferTokenSimulation';

const circleColor = {
  dark: 'green.800',
  light: 'green.200',
};

const iconColor = {
  dark: 'white',
  light: 'green.700',
};

interface ConfirmTransactionViewProps {
  isLoadingTokenStore: boolean;
  isOptInToDirectTranfer: boolean;
  onPrevious: () => void;
  onSendToken: () => void;
  recipientAddress: string;
  sendTokenMethod: string;
  setSendTokenMethod: (method: string) => void;
  simulateTxn: UseQueryResult<OnChainTransaction, Error>;
  tokenAmount: number;
}

function ConfirmTransactionView({
  isLoadingTokenStore,
  isOptInToDirectTranfer,
  onPrevious,
  onSendToken,
  recipientAddress,
  sendTokenMethod,
  setSendTokenMethod,
  simulateTxn,
  tokenAmount,
}: ConfirmTransactionViewProps) {
  const { colorMode } = useColorMode();
  const { state } = useLocation();

  const tokenData = state as ExtendedTokenData;

  const gasFee = useMemo(() => {
    if (simulateTxn.isSuccess) {
      return formatCoin(
        simulateTxn.data.gasFee * simulateTxn.data.gasUnitPrice,
        { decimals: 8 },
      );
    }
    return <Spinner aria-label="spinner" size="sm" display="span" />;
  }, [simulateTxn]);

  let transferTypeComponent = null;
  if (tokenData.tokenStandard === 'v2') {
    transferTypeComponent = (
      <Text fontWeight={700} fontSize="sm">
        <FormattedMessage defaultMessage="Direct Transfer" />
      </Text>
    );
  } else if (isOptInToDirectTranfer) {
    transferTypeComponent = (
      <RadioGroup onChange={setSendTokenMethod} value={sendTokenMethod}>
        <Stack spacing={5} direction="column">
          <HStack justifyContent="flex-end">
            <Text fontWeight={700} fontSize="sm">
              <FormattedMessage defaultMessage="Offer" />
            </Text>
            <Radio
              aria-label="offer-option"
              checked={sendTokenMethod === SEND_TOKEN_METHOD.OFFER}
              value={SEND_TOKEN_METHOD.OFFER}
              colorScheme="salmon"
            />
          </HStack>
          <HStack justifyContent="flex-end">
            <Text fontWeight={700} fontSize="sm">
              <FormattedMessage defaultMessage="Direct Transfer" />
            </Text>
            <Radio
              aria-label="direct-transfer-option"
              checked={sendTokenMethod === SEND_TOKEN_METHOD.DIRECT_TRANSFER}
              value={SEND_TOKEN_METHOD.DIRECT_TRANSFER}
              colorScheme="salmon"
              isDisabled={!isOptInToDirectTranfer}
            />
          </HStack>
        </Stack>
      </RadioGroup>
    );
  } else {
    transferTypeComponent = (
      <Text fontWeight={700} fontSize="sm">
        <FormattedMessage defaultMessage="Offer" />
      </Text>
    );
  }

  return (
    <>
      <Text
        position="absolute"
        top="-60px"
        left="10px"
        color="white"
        fontSize="3xl"
        fontWeight={600}
      >
        <FormattedMessage defaultMessage="Confirm Send" />
      </Text>
      <VStack width="100%" mb={4} height="100%" alignItems="left">
        <VStack flex={1} px={6} py={4} spacing={4}>
          <Box
            bgColor={circleColor[colorMode]}
            w={14}
            h={14}
            borderRadius="200px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Icon
              as={RiSendPlaneFill}
              color={iconColor[colorMode]}
              w={8}
              h={8}
            />
          </Box>
          <Text fontWeight="700" fontSize="20px" pb={4} display="block">
            <FormattedMessage defaultMessage="Transaction Summary" />
          </Text>
          <HStack
            paddingBottom={4}
            borderBottom="1px"
            borderColor={secondaryMediumBorderColor[colorMode]}
            width="100%"
            justifyContent="space-between"
          >
            <Text color={secondaryTextColor[colorMode]} fontSize="sm">
              <FormattedMessage defaultMessage="Recipient:" />
            </Text>
            <CreatorTag address={recipientAddress} size="sm" />
          </HStack>
          <VStack
            borderBottom="1px"
            borderColor={secondaryMediumBorderColor[colorMode]}
            width="100%"
            paddingBottom={4}
          >
            <HStack
              width="100%"
              justifyContent="space-between"
              alignItems="start"
            >
              <HStack>
                <Text color={secondaryTextColor[colorMode]} fontSize="sm">
                  <FormattedMessage defaultMessage="Delivery Method" />
                </Text>
                <Tooltip
                  minWidth="200px"
                  minHeight="300px"
                  label={
                    <Flex flexDirection="column" gap="12px" p="16px">
                      <Text fontWeight={700} fontSize="sm">
                        <FormattedMessage defaultMessage="Delivery Methods" />
                      </Text>

                      <HStack width="100%" alignItems="start">
                        <Box width="24px">
                          <BsDot size={36} />
                        </Box>
                        <Text>
                          <Text fontWeight={700}>
                            <FormattedMessage defaultMessage="Offer:" />
                          </Text>
                          <Text>
                            <FormattedMessage defaultMessage="NFTs sent as an Offer will need to be claimed by the recipient" />
                          </Text>
                        </Text>
                      </HStack>

                      <HStack width="100%" alignItems="start">
                        <Box width="24px">
                          <BsDot size={36} />
                        </Box>
                        <Text>
                          <Text fontWeight={700}>
                            <FormattedMessage defaultMessage="Direct Transfer:" />
                          </Text>
                          <Text>
                            <FormattedMessage defaultMessage="NFTs sent as a Direct Transfer will be automatically received by the recipient. (If you don't see this as an option it means the recipient has not opted into receiving Direct Transfers.)" />
                          </Text>
                        </Text>
                      </HStack>

                      <HStack width="100%" alignItems="start">
                        <Box width="24px">
                          <BsDot size={36} />
                        </Box>
                        <Text>
                          <Text fontWeight={700}>
                            <FormattedMessage defaultMessage="Gas fees:" />
                          </Text>
                          <Text>
                            <FormattedMessage defaultMessage="For the transaction depend on the type of transfer" />
                          </Text>
                        </Text>
                      </HStack>
                    </Flex>
                  }
                  shouldWrapChildren
                  placement="bottom"
                >
                  <Box>
                    <AiFillInfoCircle color="#B7BCBD" />
                  </Box>
                </Tooltip>
              </HStack>
              {transferTypeComponent}
            </HStack>
          </VStack>
          <HStack width="100%" justifyContent="space-between">
            <Text color={secondaryTextColor[colorMode]} fontSize="sm">
              <FormattedMessage defaultMessage="NFT Name" />
            </Text>
            <Text
              color={primaryTextColor[colorMode]}
              fontWeight={700}
              fontSize="sm"
            >
              {tokenData.name}
            </Text>
          </HStack>
          <HStack width="100%" justifyContent="space-between">
            <Text color={secondaryTextColor[colorMode]} fontSize="sm">
              <FormattedMessage defaultMessage="Quantity" />
            </Text>
            <Text
              color={primaryTextColor[colorMode]}
              fontWeight={700}
              fontSize="sm"
            >
              {tokenAmount}
            </Text>
          </HStack>
          <HStack width="100%" justifyContent="space-between">
            <Box color={secondaryTextColor[colorMode]} flex={1} fontSize="sm">
              <FormattedMessage
                defaultMessage="Gas fee"
                description="Gas fee label in send token drawer"
              />
            </Box>
            <Box
              color={primaryTextColor[colorMode]}
              fontWeight={700}
              fontSize="sm"
            >
              {simulateTxn.isLoading || isLoadingTokenStore ? (
                <Spinner aria-label="spinner" size="sm" display="span" />
              ) : (
                gasFee
              )}
            </Box>
          </HStack>
        </VStack>
        <HStack
          width="100%"
          borderTop="1px"
          px={4}
          pt={3}
          borderColor={secondaryMediumBorderColor[colorMode]}
        >
          <Button
            aria-label="back"
            width="100%"
            height="48px"
            size="md"
            border="1px"
            bgColor="transparent"
            borderColor="navy.300"
            onClick={onPrevious}
          >
            <FormattedMessage defaultMessage="Back" />
          </Button>
          <Button
            aria-label="send"
            width="100%"
            height="48px"
            size="md"
            border="1px"
            colorScheme="salmon"
            onClick={onSendToken}
            isDisabled={!simulateTxn.isSuccess}
          >
            <FormattedMessage defaultMessage="Send" />
          </Button>
        </HStack>
      </VStack>
    </>
  );
}

interface AddWalletAddressViewProps {
  doesRecipientAccountExist: boolean;
  maxAmount: number;
  onClose: () => void;
  onNext: () => void;
}

function AddWalletAddressView({
  doesRecipientAccountExist,
  maxAmount,
  onClose,
  onNext,
}: AddWalletAddressViewProps) {
  const { colorMode } = useColorMode();
  const { state } = useLocation();
  const tokenData = state as TokenData;
  const { data: tokenMetadata } = useTokenMetadata(tokenData);
  const { register, setValue, watch } = useFormContext();
  const imageUri =
    tokenMetadata?.animation_url ||
    tokenMetadata?.image ||
    tokenData.metadataUri;
  const amount = watch('amount');
  const recipient = watch('recipient');
  const handleIncrementAmount = () => setValue('amount', amount + 1);
  const handleDecrementAmount = () => setValue('amount', amount - 1);
  const showAdjustTokenAmountInput = maxAmount > 1;
  const dimension = showAdjustTokenAmountInput ? '140px' : '260px';
  const tokenMaxString =
    showAdjustTokenAmountInput && amount > maxAmount
      ? `${maxAmount} token${maxAmount > 1 ? 's' : ''} max`
      : '';

  return (
    <>
      <Text
        position="absolute"
        top="-60px"
        fontSize="3xl"
        fontWeight={600}
        left="10px"
        color="white"
      >
        <FormattedMessage defaultMessage="Add a wallet address" />
      </Text>
      <VStack width="100%" mb={4} height="100%" alignItems="left">
        <VStack
          width="100%"
          borderBottom="1px"
          borderColor={secondaryMediumBorderColor[colorMode]}
          alignItems="flex-start"
        >
          <VStack p={4} width="100%" gap={2} alignItems="flex-start">
            <TransferHeader />
          </VStack>
        </VStack>
        <VStack flex={1} pt={4} spacing="18px">
          <Box width={dimension} height={dimension}>
            <GalleryImage imageSrc={imageUri} />
          </Box>
          {showAdjustTokenAmountInput ? (
            <Flex justifyContent="space-between" width="60%" gap={2}>
              <Button
                borderRadius={400}
                width="50px"
                height="50px"
                disabled={amount <= 0}
                onClick={handleDecrementAmount}
              >
                <BiMinus size="md" />
              </Button>
              <Flex flex="1" justifyContent="center" alignItems="center">
                <Input
                  fontSize="3xl"
                  fontWeight={700}
                  textAlign="center"
                  type="number"
                  border="none"
                  errorBorderColor="orange.500"
                  isInvalid={amount > maxAmount || amount < 0}
                  {...register('amount', {
                    max: maxAmount,
                    pattern: /^\d+$/,
                    valueAsNumber: true,
                  })}
                />
              </Flex>
              <Button
                borderRadius={400}
                width="50px"
                height="50px"
                disabled={amount >= maxAmount}
                onClick={handleIncrementAmount}
              >
                <BsPlus size="md" />
              </Button>
            </Flex>
          ) : null}
          <Text as="div" color="orange.500">
            {tokenMaxString}
          </Text>
        </VStack>
        <HStack
          width="full"
          borderTop="1px"
          px={4}
          pt={3}
          borderColor={secondaryMediumBorderColor[colorMode]}
        >
          <Button
            aria-label="cancel"
            width="100%"
            height="48px"
            size="md"
            border="1px"
            bgColor="transparent"
            borderColor="navy.300"
            onClick={onClose}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button
            aria-label="next"
            width="100%"
            height="48px"
            size="md"
            border="1px"
            colorScheme="salmon"
            onClick={onNext}
            isDisabled={
              recipient?.length === 0 ||
              !doesRecipientAccountExist ||
              amount > maxAmount ||
              amount < 0
            }
          >
            <FormattedMessage defaultMessage="Next" />
          </Button>
        </HStack>
      </VStack>
    </>
  );
}

interface ConfirmationTransactionViewProps {
  error: Error | null;
  loading: boolean;
  onClose: () => void;
  recipientAddress: string;
  sendTokenMethod: string;
  sendTokenTxn: string;
}

function ConfirmationTransactionView({
  error,
  loading,
  onClose,
  recipientAddress,
  sendTokenMethod,
  sendTokenTxn,
}: ConfirmationTransactionViewProps) {
  const navigate = useNavigate();
  const getExplorerAddress = useExplorerAddress();

  const handleClose = () => {
    onClose();
    navigate(Routes.gallery.path);
  };

  return (
    <VStack height="100%" bgColor="navy.900">
      {loading ? (
        <VStack
          width="100%"
          height="100%"
          flex={1}
          justifyContent="center"
          alignItems="center"
          gap={4}
          px={4}
        >
          <img
            src="./loader.webp"
            alt="logo"
            height="80px"
            width="80px"
            aria-label="spinner"
          />
          <Box width="100%">
            <Text
              color="white"
              textAlign="center"
              display="block"
              fontSize="20px"
              fontWeight={700}
            >
              <FormattedMessage defaultMessage="Waiting for confirmed details" />
            </Text>
            <Text
              color="white"
              textAlign="center"
              display="block"
              fontSize="sm"
            >
              <FormattedMessage defaultMessage="The transaction has been sent" />
            </Text>
          </Box>
        </VStack>
      ) : null}
      {!loading && !!sendTokenTxn ? (
        <>
          <VStack
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            gap={6}
          >
            <VStack width="100%" justifyContent="center" alignItems="center">
              <img
                src="./check-animated.webp"
                alt="logo"
                height="80px"
                width="80px"
              />
              <Text
                textAlign="center"
                fontWeight={700}
                display="block"
                color="white"
                fontSize="28px"
              >
                <FormattedMessage defaultMessage="Transaction Successful" />
              </Text>
              {sendTokenMethod === SEND_TOKEN_METHOD.OFFER ? (
                <Text
                  textAlign="center"
                  display="block"
                  px={10}
                  color="white"
                  fontSize="14px"
                >
                  <FormattedMessage defaultMessage="NFT will show up as 'Pending'. The recipient then has to accept the NFT so that it can be deposited into their wallet" />
                </Text>
              ) : null}
            </VStack>
            <VStack
              width="100%"
              justifyContent="center"
              alignItems="center"
              mt={4}
            >
              <Text color="white" fontSize="sm">
                <FormattedMessage defaultMessage="Your NFT was sent to" />
              </Text>
              <CreatorTag
                address={recipientAddress}
                size="14px"
                bgColor="navy.700"
                color="white"
              />
            </VStack>
          </VStack>
          <HStack width="full" px={4} py={4}>
            <Button
              width="100%"
              height="48px"
              size="md"
              fontWeight={700}
              bgColor="navy.900"
              color="white"
              border="1px"
              borderColor="white"
              rel="noreferrer"
              as="a"
              target="_blank"
              cursor="pointer"
              href={getExplorerAddress(`txn/${sendTokenTxn}`)}
            >
              <FormattedMessage defaultMessage="View Details" />
            </Button>
            <Button
              width="100%"
              height="48px"
              size="md"
              colorScheme="salmon"
              onClick={handleClose}
            >
              <FormattedMessage defaultMessage="Close" />
            </Button>
          </HStack>
        </>
      ) : null}
      {!loading && error ? (
        <Center
          width="100%"
          height="100%"
          flexDirection="column"
          gap={4}
          px={5}
        >
          <img
            src="./error-animated.webp"
            alt="logo"
            height="80px"
            width="80px"
          />
          <Text
            textAlign="center"
            display="block"
            color="white"
            fontSize="24px"
            px={12}
            fontWeight={700}
          >
            <FormattedMessage defaultMessage="Error occured while sending transaction" />
          </Text>
          <Text textAlign="center" color="white" fontSize="12px">
            {JSON.stringify(error)}
          </Text>
        </Center>
      ) : null}
    </VStack>
  );
}

function SendTokenPopup({ isOpen, onClose }: SendTokenPopupProps) {
  const { state: locationState } = useLocation();
  const { activeAccountAddress } = useActiveAccount();
  const tokenData = locationState as ExtendedTokenData;
  const queryClient = useQueryClient();
  const fetchResource = useFetchAccountResource();
  const method = useForm<{
    amount: number;
    doesRecipientAccountExist: boolean;
    error: Error | null;
    fetchTokenStoreError: Error | null;
    isLoadingTokenStore: boolean;
    isOptInToDirectTranfer: boolean;
    isSending: boolean;
    recipient: string;
    recipientAddress: string;
    sendTokenMethod: string;
    sendTokenTxn: string;
    step: number;
  }>({
    defaultValues: {
      amount: tokenData.amount || 1,
      doesRecipientAccountExist: false,
      error: null,
      fetchTokenStoreError: null,
      isLoadingTokenStore: false,
      isOptInToDirectTranfer: false,
      isSending: false,
      recipient: '',
      recipientAddress: '',
      sendTokenMethod: SEND_TOKEN_METHOD.OFFER,
      sendTokenTxn: '',
      step: 0,
    },
  });
  const { setValue, watch } = method;
  const amount = watch('amount');
  const recipient = watch('recipient');
  const step = watch('step');
  const recipientAddress = watch('recipientAddress');
  const doesRecipientAccountExist = watch('doesRecipientAccountExist');
  const isSending = watch('isSending');
  const sendTokenTxn = watch('sendTokenTxn');
  const sendTokenMethod = watch('sendTokenMethod');
  const isLoadingTokenStore = watch('isLoadingTokenStore');
  const isOptInToDirectTranfer = watch('isOptInToDirectTranfer');
  const error = watch('error');
  const { data: coinBalance } = useAccountOctaCoinBalance(
    activeAccountAddress,
    {
      refetchInterval: simulationRefetchInterval,
    },
  );

  useEffect(() => {
    if (!recipientAddress) return;

    setValue('isLoadingTokenStore', true);
    fetchResource(recipientAddress, tokenStoreStructTag)
      .then((tokenStoreResource) => {
        if (!tokenStoreResource) {
          setValue(
            'fetchTokenStoreError',
            new Error("Failed to fetch user's on-chain data"),
          );
          setValue('isLoadingTokenStore', false);

          return;
        }

        const tokenStore = tokenStoreResource.data;
        const directTransfer = tokenStore.direct_transfer;

        if (directTransfer) {
          setValue('sendTokenMethod', 'direct_transfer');
        }

        setValue('isOptInToDirectTranfer', directTransfer);
        setValue('isLoadingTokenStore', false);
      })
      .catch((e) => {
        setValue('fetchTokenStoreError', e);
        setValue('isLoadingTokenStore', false);
      });
    // exclude fetchResource because useFetchAccountResource hook
    // did not wrap the return function in useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientAddress]);

  const payloadOffer = useMemo(
    () => generateOfferPayloadV1({ amount, recipientAddress, tokenData }),
    [amount, recipientAddress, tokenData],
  );

  const directTransferPayloadV1 = () =>
    generateDirectTransferPayloadV1({
      amount,
      collectionName: tokenData.collection,
      creator: tokenData.creator,
      propertyVersion: tokenData.propertyVersion || 0,
      recipientAddress,
      tokenName: tokenData.name,
    });

  const directTransferPayloadV2 = () =>
    generateDirectTransferPayloadV2({
      recipientAddress,
      tokenAddress: tokenData.idHash,
    });

  const payloadDirectTransfer =
    tokenData.tokenStandard === 'v2'
      ? directTransferPayloadV2
      : directTransferPayloadV1;

  const simulateOfferTxn = useTransactionSimulation(
    [simulationOfferTokenQueryKey, undefined, undefined, undefined, undefined],
    payloadOffer,
    {
      cacheTime: 0,
      enabled: coinBalance !== undefined,
      refetchInterval: simulationRefetchInterval,
    },
  );

  const simulateDirectTransferTxn = useTransactionSimulation(
    [
      simulationDirectTransferTokenQueryKey,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    payloadDirectTransfer(),
    {
      cacheTime: 0,
      enabled: coinBalance !== undefined,
      refetchInterval: simulationRefetchInterval,
    },
  );

  const submitDirectTransferTxn = useTransactionSubmit<void>(
    () => payloadDirectTransfer(),
    {
      onMutate: async () => {
        await queryClient.invalidateQueries();
      },
      txnOptions: {
        gasUnitPrice: simulateDirectTransferTxn.data?.gasUnitPrice,
        maxGasAmount: simulateDirectTransferTxn.data?.gasFee
          ? maxGasFeeFromEstimated(simulateDirectTransferTxn.data.gasFee)
          : undefined,
      },
    },
  );

  const submitOfferTxn = useTransactionSubmit<void>(() => payloadOffer, {
    onMutate: async () => {
      await queryClient.invalidateQueries();
    },
    txnOptions: {
      gasUnitPrice: simulateOfferTxn.data?.gasUnitPrice,
      maxGasAmount: simulateOfferTxn.data?.gasFee
        ? maxGasFeeFromEstimated(simulateOfferTxn.data.gasFee)
        : undefined,
    },
  });

  const simulateTxn = useMemo(
    () =>
      isOptInToDirectTranfer ||
      sendTokenMethod === SEND_TOKEN_METHOD.DIRECT_TRANSFER
        ? simulateDirectTransferTxn
        : simulateOfferTxn,
    [
      isOptInToDirectTranfer,
      simulateDirectTransferTxn,
      simulateOfferTxn,
      sendTokenMethod,
    ],
  );

  const handleClickNext = useCallback(
    () => setValue('step', step + 1),
    [setValue, step],
  );
  const handleClickPrevious = useCallback(
    () => setValue('step', step - 1),
    [setValue, step],
  );

  const handleSendToken = useCallback(async () => {
    if (simulateTxn.error || !simulateTxn.data) {
      offerTokenErrorToast({
        errorThrown:
          simulateTxn.error ||
          new Error('Failed to run simulation. Please try again'),
        recipientAddress,
        tokenName: tokenData.name,
      });

      return;
    }

    setValue('isSending', true);
    handleClickNext();

    let tokenTxn;
    if (
      sendTokenMethod === SEND_TOKEN_METHOD.DIRECT_TRANSFER ||
      tokenData.tokenStandard === 'v2'
    ) {
      tokenTxn = await submitDirectTransferTxn.mutateAsync();
    } else {
      tokenTxn = await submitOfferTxn.mutateAsync();
    }

    try {
      setValue('sendTokenTxn', tokenTxn.hash);
      setValue('isSending', false);
    } catch (_error) {
      const errorThrown = _error as Error;
      offerTokenErrorToast({
        errorThrown,
        recipientAddress: recipient,
        tokenName: tokenData.name,
      });
      setValue('isSending', false);
      setValue('error', errorThrown);
    }
  }, [
    simulateTxn.error,
    simulateTxn.data,
    setValue,
    handleClickNext,
    sendTokenMethod,
    tokenData.tokenStandard,
    tokenData.name,
    recipientAddress,
    submitDirectTransferTxn,
    submitOfferTxn,
    recipient,
  ]);

  const body = useMemo(() => {
    if (!isOpen) return null;

    switch (step) {
      case 0:
        return (
          <AddWalletAddressView
            onClose={onClose}
            onNext={handleClickNext}
            maxAmount={tokenData.amount || 1}
            doesRecipientAccountExist={doesRecipientAccountExist}
          />
        );
      case 1:
        return (
          <ConfirmTransactionView
            onPrevious={handleClickPrevious}
            tokenAmount={amount}
            onSendToken={handleSendToken}
            recipientAddress={recipientAddress}
            simulateTxn={simulateTxn}
            isLoadingTokenStore={isLoadingTokenStore}
            isOptInToDirectTranfer={isOptInToDirectTranfer}
            sendTokenMethod={sendTokenMethod}
            setSendTokenMethod={(sendMethod: string) =>
              setValue('sendTokenMethod', sendMethod)
            }
          />
        );
      case 2:
        return (
          <ConfirmationTransactionView
            loading={isSending}
            sendTokenTxn={sendTokenTxn}
            sendTokenMethod={sendTokenMethod}
            onClose={onClose}
            recipientAddress={recipientAddress}
            error={error}
          />
        );
      default:
        return null;
    }
  }, [
    amount,
    error,
    recipientAddress,
    simulateTxn,
    doesRecipientAccountExist,
    handleSendToken,
    handleClickNext,
    handleClickPrevious,
    isLoadingTokenStore,
    isOptInToDirectTranfer,
    isSending,
    onClose,
    setValue,
    sendTokenMethod,
    sendTokenTxn,
    step,
    isOpen,
    tokenData.amount,
  ]);

  return (
    <Drawer
      size={step === 2 ? 'full' : 'lg'}
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
        <FormProvider {...method}>
          <DrawerBody p={0}>{body}</DrawerBody>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
}

export default SendTokenPopup;
