// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  SignMessageRequestArgs,
  SignMessageResponseArgs,
} from '@petra/core/approval';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useSigner from '@petra/core/hooks/useSigner';
import collapseHexString from '@petra/core/utils/hex';
import { HexString } from 'aptos';
import Typography from 'core/components/Typography';
import ApprovalRequestBody from 'pages/Explore/components/ApprovalModal/components/ApprovalRequestBody';
import React from 'react';
import { Alert, View } from 'react-native';
import { i18nmock } from 'strings';
import { TextEncoder } from 'text-encoding';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { dAppEvents } from '@petra/core/utils/analytics/events';
import useBlockedDomains from 'core/hooks/useBlockedDomains';
import { useApprovalModalContext } from '../contexts/ApprovalModalContext';
import { ApprovalRequestBodyProps } from '../types';
import commonStyles from '../styles';
import DappInfoFragment from './DappInfoFragment';
import InfoCard from './InfoCard';
import ListRow from './ListRow';

export default function SignMessageApprovalRequestBody({
  message,
}: ApprovalRequestBodyProps<SignMessageRequestArgs>) {
  const { dappInfo, handleApproval, onApproved, onReject } =
    useApprovalModalContext<SignMessageResponseArgs>();

  const { activeAccount } = useActiveAccount();
  const { withSigner } = useSigner();
  const { trackEvent } = useTrackEvent();
  const { isDomainBlocked } = useBlockedDomains();

  const onApprove = handleApproval(async () => {
    if (isDomainBlocked(dappInfo.domain)) {
      Alert.alert(
        i18nmock('general:blockedSite.title'),
        i18nmock('general:blockedSite.message'),
      );
      void trackEvent({
        eventType: dAppEvents.BLOCKED_SIGN_MESSAGE,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
      return;
    }
    try {
      const encoder = new TextEncoder();
      const messageBytes = encoder.encode(message);
      const signatureBytes = await withSigner(activeAccount, (signer) =>
        signer.signBuffer(messageBytes),
      );
      const signature = HexString.fromUint8Array(signatureBytes).toString();

      onApproved({ signature });
      void trackEvent({
        eventType: dAppEvents.APPROVE_SIGN_MESSAGE,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
    } catch (e) {
      void trackEvent({
        eventType: dAppEvents.ERROR_APPROVE_SIGN_MESSAGE,
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

  const handleReject = () => {
    onReject();
    void trackEvent({
      eventType: dAppEvents.REJECT_SIGN_MESSAGE,
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
      title={i18nmock('approvalModal:signMessage.heading')}
    >
      <View style={commonStyles.mainCard.container}>
        <DappInfoFragment dappInfo={dappInfo} />
        <Typography
          variant="body"
          color="navy.900"
          style={commonStyles.mainCard.title}
        >
          {i18nmock('approvalModal:signMessage.detailsTitle')}
        </Typography>
        <Typography
          variant="small"
          color="navy.600"
          style={[commonStyles.mainCard.text, { lineHeight: 21 }]}
        >
          {message}
        </Typography>
      </View>
      <ListRow
        title={i18nmock('approvalModal:common.addressUsed')}
        value={collapseHexString(activeAccount.address)}
      />
      <InfoCard>{i18nmock('approvalModal:signMessage.disclaimer')}</InfoCard>
    </ApprovalRequestBody>
  );
}
