// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useDisclosure } from '@chakra-ui/react';
import constate from 'constate';
import { CoinTransferFormData } from 'core/components/TransferFlow';
import {
  OnChainCoinTransferTxn,
  useCoinTransferSimulation,
} from 'core/mutations/transaction';
import {
  AccountCoinResource,
  useAccountCoinResources,
  useAccountExists,
  useAccountOctaCoinBalance,
} from '@petra/core/queries/account';
import { useAddressFromName } from '@petra/core/queries/useNameAddress';
import { AptosName } from '@petra/core/utils/names';
import {
  formatAddress,
  isAddressValid,
  isAptosName,
} from '@petra/core/utils/address';
import {
  formatCoin,
  formatAmount,
  splitStringAmount,
} from '@petra/core/utils/coin';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { aptosCoinStructTag } from '@petra/core/constants';
import { CoinErrorReason, MoveStatusCodeText } from '@petra/core/move';
import useCoinListDict from '@petra/core/hooks/useCoinListDict';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useDebounce from '@petra/core/hooks/useDebounce';
import { RefetchInterval } from '@petra/core/hooks/constants';
import { onKeystoneRequest, SerializedUR } from 'modules/keystone';

export const transferAptFormId = 'transferApt' as const;

export enum TransferDrawerPage {
  ADD_ADDRESS_AND_AMOUNT,
  CONFIRM_TRANSACTION,
  GENERATE_QR_CODE,
  SCAN_QR_CODE,
}

export const [TransferFlowProvider, useTransferFlow] = constate(() => {
  // hooks
  const formMethods = useForm<CoinTransferFormData>({
    defaultValues: {
      coinStructTag: aptosCoinStructTag,
    },
  });
  const {
    isOpen: isDrawerOpen,
    onClose: closeDrawer,
    onOpen: openDrawer,
  } = useDisclosure();
  const intl = useIntl();

  const { activeAccountAddress } = useActiveAccount();
  const { coinListDict } = useCoinListDict();
  const { data: accountCoinResourcesRaw } = useAccountCoinResources(
    activeAccountAddress,
    {
      refetchInterval: RefetchInterval.STANDARD,
    },
  );

  const accountCoinResourcesFormatted = useMemo(() => {
    const result: Record<
      string,
      AccountCoinResource & { isRecognized: boolean; logoUrl: string }
    > = {};
    accountCoinResourcesRaw?.recognizedCoins.forEach((resource) => {
      result[resource.type] = {
        ...resource,
        isRecognized: true,
        logoUrl: coinListDict[resource.info.type]?.logo_url,
      };
    });
    accountCoinResourcesRaw?.unrecognizedCoins.forEach((resource) => {
      result[resource.type] = {
        ...resource,
        isRecognized: false,
        logoUrl: coinListDict[resource.info.type]?.logo_url,
      };
    });
    return result;
  }, [accountCoinResourcesRaw, coinListDict]);

  const { data: coinBalanceOcta } =
    useAccountOctaCoinBalance(activeAccountAddress);

  const [transferDrawerPage, setTransferDrawerPage] =
    useState<TransferDrawerPage>(TransferDrawerPage.ADD_ADDRESS_AND_AMOUNT);
  const [advancedView, setAdvancedView] = useState<boolean>(false);
  const [keystoneUR, setKeystoneUR] = useState<SerializedUR>();

  // form data and methods
  const { watch } = formMethods;
  const amount = watch('amount');
  const recipient = watch('recipient');
  // Coin type
  const coinStructTag = watch('coinStructTag');
  const coinBalanceRawWithDecimals =
    accountCoinResourcesFormatted[coinStructTag]?.balance;
  const coinDecimals =
    accountCoinResourcesFormatted[coinStructTag]?.info.decimals;
  const coinSymbol = accountCoinResourcesFormatted[coinStructTag]?.info.symbol;
  const coinLogo = accountCoinResourcesFormatted[coinStructTag]?.logoUrl;
  // AV = Advanced View
  const AVGasUnitPriceOcta = watch('gasUnitPriceOcta');
  const AVMaxGasUnits = watch('maxGasUnits');

  const nameAddressEnabled = recipient !== undefined && isAptosName(recipient);
  const nameAddress = useAddressFromName(
    nameAddressEnabled ? new AptosName(recipient) : new AptosName(''),
    {
      enabled: nameAddressEnabled,
    },
  );

  const coinBalanceApt = useMemo(
    () => formatCoin(coinBalanceOcta),
    [coinBalanceOcta],
  );

  const coinBalanceTypeAgnostic = useMemo(() => {
    if (coinStructTag === aptosCoinStructTag) {
      return coinBalanceApt;
    }

    const { decimals, name, symbol, type } =
      accountCoinResourcesFormatted[coinStructTag].info;
    return formatAmount(
      accountCoinResourcesFormatted[coinStructTag].balance,
      {
        decimals,
        name,
        symbol,
        type,
      },
      { prefix: false },
    );
  }, [accountCoinResourcesFormatted, coinStructTag, coinBalanceApt]);

  let recipientName: AptosName | undefined;
  let recipientAddress: string | undefined;
  if (!nameAddress.isLoading) {
    if (nameAddress.data) {
      recipientName = recipient ? new AptosName(recipient) : undefined;
      recipientAddress = nameAddress.data;
    } else if (isAddressValid(recipient)) {
      recipientAddress = formatAddress(recipient);
    }
  }

  const { data: doesRecipientAccountExist } = useAccountExists({
    address: recipientAddress,
  });

  const { amountBigIntWithDecimals, amountString } = useMemo(
    () =>
      splitStringAmount({
        amount,
        decimals: coinDecimals,
      }),
    [amount, coinDecimals],
  );

  const AVGasUnitPrice = AVGasUnitPriceOcta
    ? Number(AVGasUnitPriceOcta?.replace(/[^0-9.]/g, ''))
    : undefined;
  const AVMaxGasUnitsNumber = AVMaxGasUnits
    ? Number(AVMaxGasUnits?.replace(/[^0-9.]/g, ''))
    : undefined;

  const {
    debouncedValue: debouncedAmountBigIntWithDecimals,
    isLoading: debouncedAmountIsLoading,
  } = useDebounce(amountBigIntWithDecimals, 500);

  const {
    debouncedValue: debouncedGasUnitPriceNumber,
    isLoading: debouncedGasUnitPriceIsLoading,
  } = useDebounce(AVGasUnitPrice, 500);

  const {
    debouncedValue: debouncedMaxGasUnitsNumber,
    isLoading: debouncedMaxGasUnitsNumberIsLoading,
  } = useDebounce(AVMaxGasUnitsNumber, 500);

  const isBalanceEnoughBeforeFee =
    debouncedAmountBigIntWithDecimals &&
    coinBalanceOcta !== undefined &&
    coinBalanceRawWithDecimals !== undefined
      ? debouncedAmountBigIntWithDecimals <= coinBalanceRawWithDecimals
      : undefined;

  const {
    data: simulationResult,
    error: simulationError,
    isLoading: simulationIsLoading,
  } = useCoinTransferSimulation(
    {
      amount: debouncedAmountBigIntWithDecimals,
      doesRecipientExist: doesRecipientAccountExist,
      gasUnitPrice: debouncedGasUnitPriceNumber,
      maxGasAmount: debouncedMaxGasUnitsNumber,
      recipient: recipientAddress,
      structTag: coinStructTag,
    },
    {
      enabled: isDrawerOpen && isBalanceEnoughBeforeFee,
      refetchInterval: 5000,
      txnOptions: {
        gasUnitPrice: debouncedGasUnitPriceNumber,
        maxGasAmount: debouncedMaxGasUnitsNumber,
      },
    },
  );

  const simulationTxnError = simulationResult?.error;

  const simulationResultAmountFormatted = useMemo(() => {
    if (simulationResult) {
      const { coinInfo } =
        simulationResult as unknown as OnChainCoinTransferTxn;
      if (coinInfo) {
        const { decimals, name, symbol, type } = coinInfo;
        const formattedAmount = formatAmount(
          (simulationResult as any).amount,
          {
            decimals,
            name,
            symbol,
            type,
          },
          { prefix: false },
        );
        return formattedAmount;
      }
    }
    return null;
  }, [simulationResult]);

  const simulationMoveVMErrorMessage = useMemo(
    () => simulationError?.message.toString(),
    [simulationError],
  );

  const simulationContractErrorMessage = useMemo(() => {
    if (simulationTxnError && simulationTxnError.type === 'abort') {
      if (simulationTxnError.reason === CoinErrorReason.CoinStoreNotPublished) {
        return intl.formatMessage(
          {
            defaultMessage:
              '{coinSymbol} CoinStore is not registered for recipient',
          },
          { coinSymbol },
        );
      }
      return simulationTxnError.description;
    }
    return undefined;
  }, [simulationTxnError, coinSymbol, intl]);

  const estimatedGasFee =
    debouncedAmountBigIntWithDecimals >= 0n && simulationResult !== undefined
      ? simulationResult.gasFee
      : undefined;

  const estimatedGasFeeOcta =
    debouncedAmountBigIntWithDecimals >= 0n && simulationResult !== undefined
      ? simulationResult.gasFee * simulationResult.gasUnitPrice
      : undefined;

  const simulationGasUnitPrice =
    debouncedAmountBigIntWithDecimals >= 0n && simulationResult !== undefined
      ? simulationResult.gasUnitPrice
      : undefined;

  const estimatedGasFeeApt = useMemo(
    () => formatCoin(estimatedGasFeeOcta, { decimals: 8 }),
    [estimatedGasFeeOcta],
  );

  const shouldBalanceShake =
    isBalanceEnoughBeforeFee === false ||
    simulationError !== null ||
    simulationTxnError !== undefined;

  const canSubmitForm =
    recipientAddress !== undefined &&
    !debouncedMaxGasUnitsNumberIsLoading &&
    !debouncedGasUnitPriceIsLoading &&
    !debouncedAmountIsLoading &&
    doesRecipientAccountExist !== undefined &&
    debouncedAmountBigIntWithDecimals !== undefined &&
    debouncedAmountBigIntWithDecimals >= 0 &&
    !simulationIsLoading &&
    simulationResult?.success === true &&
    !simulationError;

  const isLoading =
    debouncedMaxGasUnitsNumberIsLoading ||
    debouncedGasUnitPriceIsLoading ||
    debouncedAmountIsLoading ||
    simulationIsLoading;

  const formSubmissionErrorText = useMemo(() => {
    if (!canSubmitForm) {
      if (!(recipientAddress !== undefined)) {
        return intl.formatMessage({
          defaultMessage: 'Recipient address is invalid',
        });
      }
      if (debouncedAmountIsLoading) {
        return intl.formatMessage({ defaultMessage: 'Loading amount...' });
      }
      if (!(doesRecipientAccountExist !== undefined)) {
        return intl.formatMessage({
          defaultMessage: 'Recipient address does not exist',
        });
      }
      if (!(debouncedAmountBigIntWithDecimals !== undefined)) {
        return intl.formatMessage({
          defaultMessage: 'Loading number amount...',
        });
      }
      if (debouncedMaxGasUnitsNumberIsLoading) {
        return intl.formatMessage({ defaultMessage: 'Loading max gas fee...' });
      }
      if (simulationIsLoading) {
        return intl.formatMessage({
          defaultMessage: 'Transaction simulation is loading...',
        });
      }
      if (debouncedAmountBigIntWithDecimals < 0n) {
        return intl.formatMessage({
          defaultMessage: 'Amount must not be negative',
        });
      }
      if (coinBalanceRawWithDecimals < debouncedAmountBigIntWithDecimals) {
        return intl.formatMessage(
          { defaultMessage: 'Amount is over balance (balance is {balance}' },
          { balance: coinBalanceTypeAgnostic },
        );
      }
      if (simulationMoveVMErrorMessage) {
        switch (simulationMoveVMErrorMessage) {
          case MoveStatusCodeText.FUNCTION_RESOLUTION_FAILURE:
            return intl.formatMessage({
              defaultMessage:
                'Function not found in module, likely cause is you are unable to transfer alt coins to an uninitialized account',
            });
          default:
            return simulationMoveVMErrorMessage;
        }
      }
      if (simulationContractErrorMessage) {
        return simulationContractErrorMessage;
      }
      if (simulationResult?.error || !simulationResult?.success) {
        return intl.formatMessage({
          defaultMessage: 'Transaction simulation unsuccessful',
        });
      }
      if (simulationError) {
        return intl.formatMessage({
          defaultMessage: 'Transaction simulation errored',
        });
      }
    }
    return intl.formatMessage({ defaultMessage: 'Can submit' });
  }, [
    canSubmitForm,
    coinBalanceTypeAgnostic,
    debouncedAmountIsLoading,
    debouncedMaxGasUnitsNumberIsLoading,
    coinBalanceRawWithDecimals,
    debouncedAmountBigIntWithDecimals,
    doesRecipientAccountExist,
    recipientAddress,
    simulationError,
    simulationIsLoading,
    simulationMoveVMErrorMessage,
    simulationContractErrorMessage,
    simulationResult?.error,
    simulationResult?.success,
    intl,
  ]);

  // transfer page state

  const goToForm = useCallback(() => {
    setTransferDrawerPage(TransferDrawerPage.ADD_ADDRESS_AND_AMOUNT);
  }, []);

  const goToConfirmation = useCallback(() => {
    setTransferDrawerPage(TransferDrawerPage.CONFIRM_TRANSACTION);
  }, []);

  const goToGenerateQRCode = useCallback(() => {
    setTransferDrawerPage(TransferDrawerPage.GENERATE_QR_CODE);
  }, []);

  const goToScanQRCode = useCallback(() => {
    setTransferDrawerPage(TransferDrawerPage.SCAN_QR_CODE);
  }, []);

  const advancedViewOnClick = useCallback(() => {
    setAdvancedView(!advancedView);
  }, [advancedView]);

  useEffect(
    () =>
      // When a QR signature is requested, navigate to the appropriate page
      onKeystoneRequest((ur) => {
        setKeystoneUR(ur);
        setTransferDrawerPage(TransferDrawerPage.GENERATE_QR_CODE);
      }),
    [],
  );

  return {
    AVGasUnitPrice,
    AVMaxGasUnitsNumber,
    accountCoinResourcesFormatted,
    advancedView,
    advancedViewOnClick,
    amountBigIntWithDecimals,
    amountString,
    canSubmitForm,
    closeDrawer,
    coinBalanceApt,
    coinBalanceOcta,
    coinBalanceTypeAgnostic,
    coinDecimals,
    coinLogo,
    coinStructTag,
    coinSymbol,
    debouncedMaxGasUnitsNumber,
    doesRecipientAccountExist,
    estimatedGasFee,
    estimatedGasFeeApt,
    estimatedGasFeeOcta,
    formMethods,
    formSubmissionErrorText,
    goToConfirmation,
    goToForm,
    goToGenerateQRCode,
    goToScanQRCode,
    isDrawerOpen,
    isLoading,
    keystoneUR,
    openDrawer,
    recipientAddress,
    recipientName,
    setKeystoneUR,
    shouldBalanceShake,
    simulationGasUnitPrice,
    simulationResult,
    simulationResultAmountFormatted,
    transferDrawerPage,
  };
});
