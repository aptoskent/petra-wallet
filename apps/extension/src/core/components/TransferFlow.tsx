// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Button } from '@chakra-ui/react';
import { IoIosSend } from '@react-icons/all-files/io/IoIosSend';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { SubmitHandler } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import {
  transferAptFormId,
  TransferFlowProvider,
  useTransferFlow,
} from 'core/hooks/useTransferFlow';
import { useCoinTransferTransaction } from 'core/mutations/transaction';
import { getAccountActivityQueryKey } from '@petra/core/queries/useActivity';
import queryKeys from '@petra/core/queries/queryKeys';
import { maxGasFeeFromEstimated } from '@petra/core/transactions';
import { isKeystoneSignatureCancel } from 'modules/keystone';
import {
  coinTransferAbortToast,
  coinTransferSuccessToast,
  transactionErrorToast,
} from './Toast';
import TransferDrawer from './TransferDrawer';

function TransferButton() {
  const { coinBalanceOcta, openDrawer } = useTransferFlow();
  return (
    <Button
      disabled={!coinBalanceOcta}
      leftIcon={<IoIosSend />}
      onClick={openDrawer}
      width="100%"
      backgroundColor="whiteAlpha.200"
      _hover={{
        backgroundColor: 'whiteAlpha.300',
      }}
      _active={{
        backgroundColor: 'whiteAlpha.400',
      }}
      color="white"
    >
      <FormattedMessage defaultMessage="Send" />
    </Button>
  );
}

export interface CoinTransferFormData {
  amount?: string;
  coinStructTag: string;
  gasUnitPriceOcta?: string;
  maxGasUnits?: string;
  recipient?: string;
}

function TransferFlow() {
  const {
    AVGasUnitPrice,
    AVMaxGasUnitsNumber,
    amountBigIntWithDecimals,
    amountString,
    canSubmitForm,
    closeDrawer,
    coinStructTag,
    doesRecipientAccountExist,
    estimatedGasFee,
    formMethods,
    goToForm,
    recipientAddress,
    simulationGasUnitPrice,
  } = useTransferFlow();
  const queryClient = useQueryClient();
  const { activeNetworkName } = useNetworks();
  const { activeAccountAddress } = useActiveAccount();

  const { handleSubmit, reset: resetForm } = formMethods;

  const estimatedMaxGasFee = estimatedGasFee
    ? maxGasFeeFromEstimated(estimatedGasFee)
    : undefined;

  const { mutateAsync: submitCoinTransfer } = useCoinTransferTransaction({
    txnOptions: {
      gasUnitPrice: AVGasUnitPrice ?? simulationGasUnitPrice,
      maxGasAmount: AVMaxGasUnitsNumber ?? estimatedMaxGasFee,
    },
  });

  const onSubmit: SubmitHandler<CoinTransferFormData> = async (data, event) => {
    event?.preventDefault();
    if (!canSubmitForm) {
      return;
    }

    try {
      const onChainTxn = await submitCoinTransfer({
        amount: amountBigIntWithDecimals,
        doesRecipientExist: doesRecipientAccountExist!,
        recipient: recipientAddress!,
        structTag: coinStructTag,
      });

      if (onChainTxn.success) {
        coinTransferSuccessToast(amountString, onChainTxn);
        resetForm();
        goToForm();
        closeDrawer();
      } else {
        coinTransferAbortToast(onChainTxn);
      }
    } catch (err) {
      if (!isKeystoneSignatureCancel(err)) {
        transactionErrorToast(err);
      }
    }

    // Other queries depend on this, so this needs to complete invalidating
    // before invalidating other queries
    await queryClient.invalidateQueries(queryKeys.getAccountResources);
    Promise.all([
      queryClient.invalidateQueries(queryKeys.getAccountOctaCoinBalance),
      queryClient.invalidateQueries(queryKeys.getAccountCoinResources),
      queryClient.invalidateQueries(
        getAccountActivityQueryKey(activeNetworkName, activeAccountAddress),
      ),
    ]);
  };

  return (
    <>
      <TransferButton />
      <form id={transferAptFormId} onSubmit={handleSubmit(onSubmit)}>
        <TransferDrawer />
      </form>
    </>
  );
}

export default function TransferFlowWrapper() {
  return (
    <TransferFlowProvider>
      <TransferFlow />
    </TransferFlowProvider>
  );
}
