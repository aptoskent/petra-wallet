// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useTransactions from '@petra/core/hooks/useTransactions';
import {
  SerializedMultiAgentPayload,
  SerializedPayload,
  ensureMultiAgentPayloadDeserialized,
  ensurePayloadDeserialized,
} from '@petra/core/serialization';
import collapseHexString from '@petra/core/utils/hex';
import { BCS, HexString, TxnBuilderTypes } from 'aptos';
import ApprovalRequestBody from 'pages/Explore/components/ApprovalModal/components/ApprovalRequestBody';
import React, { useMemo } from 'react';
import { Alert, View } from 'react-native';
import { i18nmock } from 'strings';
import { TransactionOptions } from '@petra/core/transactions';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { dAppEvents } from '@petra/core/utils/analytics/events';
import useBlockedDomains from 'core/hooks/useBlockedDomains';
import { useApprovalModalContext } from '../contexts/ApprovalModalContext';
import { usePayloadInfo } from '../hooks';
import commonStyles from '../styles';
import DappInfoFragment from './DappInfoFragment';
import EntryFunctionPayloadInfo from './EntryFunctionPayloadInfo';
import InfoCard from './InfoCard';
import ListRow from './ListRow';

interface SignTransactionApprovalRequestBodyProps {
  options?: TransactionOptions;
  payload: SerializedPayload | SerializedMultiAgentPayload;
  type: 'transaction' | 'multiagent';
}

export default function SignTransactionApprovalRequestBody({
  options,
  payload: serializedPayload,
  type,
}: SignTransactionApprovalRequestBodyProps) {
  const { dappInfo, handleApproval, onApproved, onReject } =
    useApprovalModalContext();
  const { activeAccount } = useActiveAccount();
  const { trackEvent } = useTrackEvent();
  const { isDomainBlocked } = useBlockedDomains();

  const payload = useMemo(() => {
    switch (type) {
      case 'multiagent':
        return ensureMultiAgentPayloadDeserialized(
          serializedPayload as SerializedMultiAgentPayload,
        );
      case 'transaction':
      default:
        return ensurePayloadDeserialized(serializedPayload);
    }
  }, [serializedPayload, type]);

  const payloadInfo = usePayloadInfo(payload);

  const { buildRawTransaction, signMultiAgentTransaction, signTransaction } =
    useTransactions();

  const onApprove = handleApproval(async () => {
    let blockedType;
    let eventType;
    let eventTypeError;
    switch (type) {
      case 'multiagent':
        blockedType = dAppEvents.BLOCKED_SIGN_MULTI_AGENT_TRANSACTION;
        eventType = dAppEvents.APPROVE_SIGN_MULTI_AGENT_TRANSACTION;
        eventTypeError = dAppEvents.ERROR_APPROVE_SIGN_MULTI_AGENT_TRANSACTION;
        break;
      case 'transaction':
      default:
        blockedType = dAppEvents.BLOCKED_SIGN_TRANSACTION;
        eventType = dAppEvents.APPROVE_SIGN_TRANSACTION;
        eventTypeError = dAppEvents.ERROR_APPROVE_SIGN_TRANSACTION;
    }

    if (isDomainBlocked(dappInfo.domain)) {
      Alert.alert(
        i18nmock('general:blockedSite.title'),
        i18nmock('general:blockedSite.message'),
      );
      void trackEvent({
        eventType: blockedType,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
      return;
    }

    try {
      let signedBytes;
      if (payload instanceof TxnBuilderTypes.MultiAgentRawTransaction) {
        signedBytes = await signMultiAgentTransaction(payload);
      } else {
        const rawTxn = await buildRawTransaction(payload, options);
        const signedTxn = await signTransaction(rawTxn);
        signedBytes = BCS.bcsToBytes(signedTxn);
      }

      const signedTxnHex = HexString.fromUint8Array(signedBytes).toString();
      onApproved({ signedTxnHex });
      void trackEvent({
        eventType,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
    } catch (e) {
      void trackEvent({
        eventType: eventTypeError,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
      throw e;
    }
  });

  const handleReject = () => {
    onReject();
    let eventType;
    switch (type) {
      case 'multiagent':
        eventType = dAppEvents.REJECT_SIGN_MULTI_AGENT_TRANSACTION;
        break;
      case 'transaction':
      default:
        eventType = dAppEvents.REJECT_SIGN_TRANSACTION;
    }
    void trackEvent({
      eventType,
      params: {
        dAppDomain: dappInfo.domain,
        dAppImageURI: dappInfo.imageURI,
        dAppName: dappInfo.name,
      },
    });
  };

  return (
    <ApprovalRequestBody
      onApprove={onApprove}
      onReject={handleReject}
      title={i18nmock('approvalModal:signTransaction.heading')}
    >
      <View style={commonStyles.mainCard.container}>
        <DappInfoFragment dappInfo={dappInfo} />
      </View>
      <ListRow
        title={i18nmock('approvalModal:common.addressUsed')}
        value={collapseHexString(activeAccount.address)}
      />
      {payloadInfo?.type === 'entryFunction' ? (
        <EntryFunctionPayloadInfo info={payloadInfo} />
      ) : null}
      <InfoCard>
        {i18nmock('approvalModal:signTransaction.disclaimer')}
      </InfoCard>
      <InfoCard>
        {i18nmock('approvalModal:signTransaction.disclaimer')}
      </InfoCard>
      <InfoCard>
        {i18nmock('approvalModal:signTransaction.disclaimer')}
      </InfoCard>
      <InfoCard>
        {i18nmock('approvalModal:signTransaction.disclaimer')}
      </InfoCard>
    </ApprovalRequestBody>
  );
}
