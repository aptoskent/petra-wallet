// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  VStack,
  Input,
  useColorMode,
  Box,
  HStack,
  Button,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import WalletLayout from 'core/layouts/WalletLayout';
import { useForm } from 'react-hook-form';
import {
  searchInputBackground,
  buttonBorderColor,
  secondaryButtonBgColor,
  customColors,
} from '@petra/core/colors';
import ApproveAddCoinToWalletDrawer, {
  useAddCoinTransactionPayload,
} from 'core/components/ApproveAddCoinToWalletDrawer';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import {
  transactionQueryKeys,
  useTransactionSimulation,
} from '@petra/core/queries/transaction';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { simulationRefetchInterval } from '@petra/core/constants';
import ChakraLink from 'core/components/ChakraLink';
import useDebounce from '@petra/core/hooks/useDebounce';
import useCoinResources from '@petra/core/queries/useCoinResources';
import { MoveStatusCodeText, MoveStatusCodeKey } from '@petra/core/move';
import { useNavigate } from 'react-router-dom';

function AddCustomCoin() {
  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { register, watch } = useForm({
    defaultValues: {
      coinAddress: '',
      coinName: '',
      symbol: '',
    },
  });
  const coinAddress = watch('coinAddress');
  const coinName = watch('coinName');
  const symbol = watch('symbol');
  const navigate = useNavigate();
  const intl = useIntl();

  const {
    debouncedValue: debouncedCoinAddress,
    isLoading: debouncedCoinAddressIsLoading,
  } = useDebounce(coinAddress, 500);

  const {
    debouncedValue: debouncedCoinName,
    isLoading: debouncedCoinNameIsLoading,
  } = useDebounce(coinName, 500);

  const handleClose = () => {
    onClose();
    navigate(-1);
  };

  const {
    debouncedValue: debouncedSymbol,
    isLoading: debouncedSymbolIsLoading,
  } = useDebounce(symbol, 500);

  const { activeAccountAddress } = useActiveAccount();

  const {
    coinsHash: registeredCoinHash,
    isLoading: useCoinResourcesIsLoading,
    isSuccess: useCoinResourcesIsSuccess,
  } = useCoinResources();

  const payload = useAddCoinTransactionPayload(debouncedCoinAddress);

  const { data: coinBalance } = useAccountOctaCoinBalance(
    activeAccountAddress,
    {
      refetchInterval: simulationRefetchInterval,
    },
  );

  const simulateTxn = useTransactionSimulation(
    [
      transactionQueryKeys.registerCustomCoinSimulation,
      debouncedCoinAddress,
      debouncedCoinName,
      debouncedSymbol,
      undefined,
    ],
    payload,
    {
      cacheTime: 0,
      enabled: coinBalance !== undefined,
      refetchInterval: simulationRefetchInterval,
    },
  );

  const moveError = simulateTxn.error?.message as MoveStatusCodeKey;

  const addButtonTooltip = useMemo(() => {
    if (coinAddress.length === 0) {
      return intl.formatMessage({
        defaultMessage: 'Token address cannot be empty',
      });
    }

    if (coinName.length === 0) {
      return intl.formatMessage({
        defaultMessage: 'Token name cannot be empty',
      });
    }

    if (symbol.length === 0) {
      return intl.formatMessage({
        defaultMessage: 'Token symbol cannot be empty',
      });
    }

    if (registeredCoinHash.get(coinAddress)) {
      return intl.formatMessage({
        defaultMessage:
          'Coin already registered with the current account. Please register a different coin',
      });
    }
    if (simulateTxn.error && MoveStatusCodeText[moveError]) {
      return MoveStatusCodeText[moveError];
    }

    if (simulateTxn.isError) {
      return intl.formatMessage(
        {
          defaultMessage:
            'Simulation failed. Please correct coin information and try again. Error message: {error}',
        },
        { error: simulateTxn.error.message },
      );
    }

    return null;
  }, [
    registeredCoinHash,
    coinAddress,
    coinName,
    symbol,
    simulateTxn,
    moveError,
    intl,
  ]);

  const isAddDisabled =
    useCoinResourcesIsLoading ||
    !useCoinResourcesIsSuccess ||
    registeredCoinHash.get(coinAddress) ||
    debouncedCoinAddressIsLoading ||
    debouncedCoinNameIsLoading ||
    debouncedSymbolIsLoading ||
    !simulateTxn.isSuccess ||
    debouncedCoinAddress.length === 0 ||
    debouncedCoinName.length === 0 ||
    debouncedSymbol.length === 0;

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Add Custom Coin" />}
      hasWalletFooter={false}
      showBackButton
      showAccountCircle={false}
    >
      <VStack height="100%" width="100%">
        <VStack
          width="100%"
          paddingTop={8}
          height="100%"
          gap={4}
          px={4}
          flex={1}
        >
          <Input
            placeholder={intl.formatMessage({
              defaultMessage: 'Token address',
            })}
            bgColor={searchInputBackground[colorMode]}
            border="transparent"
            height="48px"
            {...register('coinAddress')}
          />
          <Input
            placeholder={intl.formatMessage({ defaultMessage: 'Token name' })}
            bgColor={searchInputBackground[colorMode]}
            border="transparent"
            height="48px"
            {...register('coinName')}
          />
          <Input
            placeholder={intl.formatMessage({ defaultMessage: 'Symbol' })}
            bgColor={searchInputBackground[colorMode]}
            border="transparent"
            height="48px"
            {...register('symbol')}
          />
          {moveError ? (
            <Text
              color={customColors.orange[500]}
              width="100%"
              textAlign="left"
            >
              {addButtonTooltip}
            </Text>
          ) : null}
        </VStack>
        <HStack
          width="100%"
          borderTop="1px"
          p={4}
          borderColor={buttonBorderColor[colorMode]}
        >
          <Box width="100%">
            <ChakraLink to={-1 as any}>
              <Button
                aria-label="cancel"
                height="48px"
                size="md"
                border="1px"
                width="100%"
                bgColor={secondaryButtonBgColor[colorMode]}
                borderColor="navy.300"
              >
                <FormattedMessage defaultMessage="Cancel" />
              </Button>
            </ChakraLink>
          </Box>
          <Box width="100%">
            <Tooltip label={addButtonTooltip} shouldWrapChildren>
              <Button
                aria-label="add"
                height="48px"
                size="md"
                width="100%"
                isLoading={simulateTxn.isLoading}
                border="1px"
                colorScheme="salmon"
                isDisabled={isAddDisabled}
                onClick={onOpen}
              >
                <FormattedMessage defaultMessage="Add" />
              </Button>
            </Tooltip>
          </Box>
        </HStack>
      </VStack>
      {payload && !simulateTxn.isError ? (
        <ApproveAddCoinToWalletDrawer
          isOpen={isOpen}
          payload={payload}
          onClose={handleClose}
          errorMessage={
            <FormattedMessage
              defaultMessage="Error occured when adding {coinName} to your coins"
              values={{ coinName }}
            />
          }
          approveDescription={
            <FormattedMessage defaultMessage="Adding a custom coin will submit an on-chain transcation and will require a gas fee." />
          }
          successDescription={
            <FormattedMessage
              defaultMessage="Successfully added {coinName} to your coins"
              values={{ coinName }}
            />
          }
          approveHeading={
            <FormattedMessage defaultMessage="Add custom coin to wallet" />
          }
        />
      ) : null}
    </WalletLayout>
  );
}

export default AddCustomCoin;
