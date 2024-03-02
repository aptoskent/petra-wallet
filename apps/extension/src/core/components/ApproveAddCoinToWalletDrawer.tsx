// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TxnBuilderTypes } from 'aptos';
import React, { useCallback, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { getAccountCoinResourcesKey } from '@petra/core/queries/account';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { transactionQueryKeys } from '@petra/core/queries/transaction';
import { debounce } from '@petra/core/hooks/useDebounce';
import ApproveTransactionDrawer from './ApproveTransactionDrawer';
import { registerCoinSimulationErrorToast } from './Toast';

const debouncedRegisterCoinSimulationErrorToast = debounce(
  registerCoinSimulationErrorToast,
  1000,
);

const {
  EntryFunction,
  StructTag,
  TransactionPayloadEntryFunction,
  TypeTagStruct,
} = TxnBuilderTypes;

interface ApproveAddCoinToWalletDrawerProps {
  approveDescription: JSX.Element;
  approveHeading: JSX.Element;
  errorMessage: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
  payload: TxnBuilderTypes.TransactionPayloadEntryFunction;
  successDescription: JSX.Element;
}

export const useAddCoinTransactionPayload = (selectedCoin?: string) => {
  const payload = useMemo(() => {
    if (!selectedCoin) {
      return new TransactionPayloadEntryFunction(
        EntryFunction.natural('0x1::managed_coin', 'register', [], []),
      );
    }

    let typeArgs: TxnBuilderTypes.TypeTag[] = [];

    try {
      typeArgs = [new TypeTagStruct(StructTag.fromString(selectedCoin))];

      const entryFunction = EntryFunction.natural(
        '0x1::managed_coin',
        'register',
        typeArgs,
        [],
      );

      return new TransactionPayloadEntryFunction(entryFunction);
    } catch {
      debouncedRegisterCoinSimulationErrorToast();
      return new TransactionPayloadEntryFunction(
        EntryFunction.natural('0x1::managed_coin', 'register', [], []),
      );
    }
  }, [selectedCoin]);

  return payload;
};

function ApproveAddCoinToWalletDrawer({
  approveDescription,
  approveHeading,
  errorMessage,
  isOpen,
  onClose,
  payload,
  successDescription,
}: ApproveAddCoinToWalletDrawerProps) {
  const { activeNetworkName } = useNetworks();
  const { activeAccountAddress } = useActiveAccount();
  const queryClient = useQueryClient();

  const onSettled = useCallback(() => {
    void queryClient.invalidateQueries(
      getAccountCoinResourcesKey(activeNetworkName, activeAccountAddress),
    );
  }, [activeNetworkName, activeAccountAddress, queryClient]);

  return (
    <ApproveTransactionDrawer
      simulationQueryKey={transactionQueryKeys.registerAltCoinSimulation}
      payload={payload}
      isOpen={isOpen}
      onClose={onClose}
      onSettled={onSettled}
      errorMessage={errorMessage}
      approveDescription={approveDescription}
      successDescription={successDescription}
      approveHeading={approveHeading}
    />
  );
}

export default ApproveAddCoinToWalletDrawer;
