// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TransactionPayload } from '@petra/core/serialization';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Heading, Text, VStack } from '@chakra-ui/react';
import { simulationRefetchInterval } from '@petra/core/constants';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useTransactionSimulation } from '@petra/core/queries/transaction';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import dappTransactionHeadingProps from '@petra/core/utils/styles';
import { useApprovalRequestContext } from 'prompt/hooks';
import {
  parsePersonalTokenBalanceChanges,
  parsePersonalCoinBalanceChanges,
} from '@petra/core/utils/transaction';
import { DappTokenTransactionDetailItem } from './DappTokenTransactionDetails';
import { DappCoinTransactionDetailItem } from './DappCoinTransactionDetails';

interface DappTransactionDetailsProps {
  payload: TransactionPayload;
}

export default function DappTransactionDetails({
  payload,
}: DappTransactionDetailsProps) {
  const { approvalRequest } = useApprovalRequestContext();
  const { activeAccountAddress } = useActiveAccount();
  const { data: coinBalance } = useAccountOctaCoinBalance(
    activeAccountAddress,
    { refetchInterval: simulationRefetchInterval },
  );

  const simulation = useTransactionSimulation(
    ['approvalRequest', approvalRequest.id],
    payload,
    {
      enabled: coinBalance !== undefined,
      refetchInterval: simulationRefetchInterval,
    },
  );

  const coinBalanceChanges = useMemo(
    () =>
      parsePersonalCoinBalanceChanges({
        activeAccountAddress,
        transaction: simulation.data,
      }),
    [activeAccountAddress, simulation.data],
  );

  const tokenBalanceChanges = useMemo(
    () =>
      simulation.data
        ? parsePersonalTokenBalanceChanges({
            activeAccountAddress,
            transaction: simulation.data,
          })
        : [],
    [activeAccountAddress, simulation.data],
  );

  const emptyTransactionDetails =
    tokenBalanceChanges.length === 0 || !coinBalanceChanges;

  return (
    <VStack alignItems="flex-start" width="100%">
      <Heading {...dappTransactionHeadingProps}>
        <FormattedMessage defaultMessage="Transaction details" />
      </Heading>
      {coinBalanceChanges ? (
        Object.entries(coinBalanceChanges).map(([key, value]) => (
          <DappCoinTransactionDetailItem key={key} item={value} />
        ))
      ) : (
        <Text>
          <FormattedMessage defaultMessage="No coin balance changes" />
        </Text>
      )}
      {Object.entries(tokenBalanceChanges).map(([key, value]) => (
        <DappTokenTransactionDetailItem key={key} item={value} />
      ))}
      {emptyTransactionDetails ? (
        <Text>
          <FormattedMessage defaultMessage="Some resources were changed, please see the events and writeset below for more details" />
        </Text>
      ) : null}
    </VStack>
  );
}
