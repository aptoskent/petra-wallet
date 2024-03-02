// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  SignAndSubmitTransactionRequestArgs,
  SignAndSubmitTransactionResponseArgs,
} from '@petra/core/approval';
import RefetchInterval from '@petra/core/hooks/constants';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useTransactions from '@petra/core/hooks/useTransactions';
import { ensurePayloadDeserialized } from '@petra/core/serialization';
import {
  maxGasFeeFromEstimated,
  TransactionOptions,
} from '@petra/core/transactions';
import { formatCoin } from '@petra/core/utils/coin';
import collapseHexString from '@petra/core/utils/hex';

import Typography from 'core/components/Typography';
import ApprovalRequestBody from 'pages/Explore/components/ApprovalModal/components/ApprovalRequestBody';
import useTransactionSimulation from 'pages/Send/hooks/useTransactionSimulation';
import React, { useMemo } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { i18nmock } from 'strings';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { dAppEvents } from '@petra/core/utils/analytics/events';
import useBlockedDomains from 'core/hooks/useBlockedDomains';
import { useApprovalModalContext } from '../contexts/ApprovalModalContext';
import { usePayloadInfo } from '../hooks';
import commonStyles from '../styles';
import BalanceChangesSection from './BalanceChangesSection';
import DappInfoFragment from './DappInfoFragment';
import EntryFunctionPayloadInfo from './EntryFunctionPayloadInfo';
import InfoCard from './InfoCard';
import ListRow from './ListRow';

export default function SignTransactionApprovalRequestBody({
  payload: serializedPayload,
}: SignAndSubmitTransactionRequestArgs) {
  const { activeAccountAddress } = useActiveAccount();
  const { dappInfo, handleApproval, onApproved, onReject } =
    useApprovalModalContext<SignAndSubmitTransactionResponseArgs>();
  const { trackEvent } = useTrackEvent();
  const { isDomainBlocked } = useBlockedDomains();

  const payload = useMemo(
    () => ensurePayloadDeserialized(serializedPayload),
    [serializedPayload],
  );

  const simulation = useTransactionSimulation(payload, {
    keepPreviousData: true,
    refetchInterval: RefetchInterval.STANDARD,
  });
  const payloadInfo = usePayloadInfo(payload);

  const { buildRawTransaction, signTransaction, submitTransaction } =
    useTransactions();

  const onApprove = handleApproval(async () => {
    if (isDomainBlocked(dappInfo.domain)) {
      Alert.alert(
        i18nmock('general:blockedSite.title'),
        i18nmock('general:blockedSite.message'),
      );
      void trackEvent({
        eventType: dAppEvents.BLOCKED_SIGN_AND_SUBMIT_TRANSACTION,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
      return;
    }

    try {
      if (simulation.data === undefined) {
        return;
      }

      const txnOptions: TransactionOptions = {
        gasUnitPrice: simulation.data.gasUnitPrice,
        maxGasAmount: maxGasFeeFromEstimated(simulation.data.gasFee),
      };

      const rawTxn = await buildRawTransaction(payload, txnOptions);
      const signedTxn = await signTransaction(rawTxn);
      const userTxn = await submitTransaction(signedTxn);

      onApproved({ userTxn });
      void trackEvent({
        eventType: dAppEvents.APPROVE_SIGN_AND_SUBMIT_TRANSACTION,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
    } catch (e) {
      void trackEvent({
        eventType: dAppEvents.ERROR_APPROVE_SIGN_AND_SUBMIT_TRANSACTION,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
      // caught by handleApproval in ApprovalModal
      throw e;
    }
  });

  const renderMainCardBody = () => {
    if (simulation.isSuccess && simulation.data.success) {
      return <BalanceChangesSection transaction={simulation.data} />;
    }

    if (simulation.isError || simulation.data?.error) {
      const errorMessage =
        (simulation.error as Error)?.message ??
        simulation.data?.error?.description;
      return (
        <Typography
          variant="small"
          color="red.500"
          style={commonStyles.mainCard.text}
        >
          {errorMessage}
        </Typography>
      );
    }

    return <ActivityIndicator style={{ marginTop: 16 }} />;
  };

  const onShowNetworkFeeInfo = () => {
    Alert.alert(
      i18nmock('assets:sendFlow.transactionDetails.networkFee'),
      i18nmock('assets:sendFlow.transactionDetails.networkFeeInfo'),
    );
  };

  const handleReject = () => {
    onReject();
    void trackEvent({
      eventType: dAppEvents.REJECT_SIGN_AND_SUBMIT_TRANSACTION,
      params: {
        dAppDomain: dappInfo.domain,
        dAppImageURI: dappInfo.imageURI,
        dAppName: dappInfo.name,
      },
    });
  };

  const networkFee = simulation.isSuccess
    ? simulation.data.gasFee * simulation.data.gasUnitPrice
    : 0;
  const formattedNetworkFee = formatCoin(networkFee);

  const statusColor =
    simulation.isError || simulation.data?.error ? 'red.500' : 'navy.900';

  return (
    <ApprovalRequestBody
      title={i18nmock('approvalModal:signTransaction.heading')}
      onApprove={onApprove}
      onReject={handleReject}
    >
      <View style={commonStyles.mainCard.container}>
        <DappInfoFragment dappInfo={dappInfo} />
        <Typography
          variant="body"
          color={statusColor}
          style={commonStyles.mainCard.title}
        >
          {i18nmock('approvalModal:signTransaction.detailsTitle')}
        </Typography>
        {renderMainCardBody()}
      </View>
      <ListRow
        title={i18nmock('approvalModal:common.addressUsed')}
        value={collapseHexString(activeAccountAddress)}
      />
      {payloadInfo?.type === 'entryFunction' ? (
        <EntryFunctionPayloadInfo info={payloadInfo} />
      ) : null}
      <ListRow
        title={i18nmock('approvalModal:signTransaction.networkFee')}
        value={
          !simulation.isLoading ? (
            <Typography color={statusColor} weight="600">
              {formattedNetworkFee}
            </Typography>
          ) : (
            <ActivityIndicator />
          )
        }
        onShowDetails={onShowNetworkFeeInfo}
      />
      <InfoCard>
        {i18nmock('approvalModal:signTransaction.disclaimer')}
      </InfoCard>
    </ApprovalRequestBody>
  );
}
