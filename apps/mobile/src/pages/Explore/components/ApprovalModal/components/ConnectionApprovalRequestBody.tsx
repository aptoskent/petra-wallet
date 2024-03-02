// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ConnectionResponseArgs } from '@petra/core/approval';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import Typography from 'core/components/Typography';
import ApprovalRequestBody from 'pages/Explore/components/ApprovalModal/components/ApprovalRequestBody';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import CheckCircleFilledIcon from 'shared/assets/svgs/check_circle_filled_icon';
import { i18nmock } from 'strings';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { dAppEvents } from '@petra/core/utils/analytics/events';
import useBlockedDomains from 'core/hooks/useBlockedDomains';
import { useApprovalModalContext } from '../contexts/ApprovalModalContext';
import commonStyles from '../styles';
import DappInfoFragment from './DappInfoFragment';
import InfoCard from './InfoCard';

export default function ConnectionApprovalRequestBody() {
  const { activeAccount } = useActiveAccount();
  const { dappInfo, onApproved, onReject } =
    useApprovalModalContext<ConnectionResponseArgs>();
  const { trackEvent } = useTrackEvent();
  const { isDomainBlocked } = useBlockedDomains();

  const onApprove = async () => {
    if (isDomainBlocked(dappInfo.domain)) {
      Alert.alert(
        i18nmock('general:blockedSite.title'),
        i18nmock('general:blockedSite.message'),
      );
      void trackEvent({
        eventType: dAppEvents.BLOCKED_DAPP_CONNECTION,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
      return;
    }
    const { address, publicKey } = activeAccount;
    try {
      onApproved({ account: { address, publicKey } });
      void trackEvent({
        eventType: dAppEvents.APPROVE_DAPP_CONNECTION,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
    } catch {
      void trackEvent({
        eventType: dAppEvents.ERROR_APPROVE_DAPP_CONNECTION,
        params: {
          dAppDomain: dappInfo.domain,
          dAppImageURI: dappInfo.imageURI,
          dAppName: dappInfo.name,
        },
      });
    }
  };

  const permissions = [
    i18nmock('approvalModal:connect.permission1'),
    i18nmock('approvalModal:connect.permission2'),
  ];

  const handleReject = () => {
    onReject();
    void trackEvent({
      eventType: dAppEvents.REJECT_DAPP_CONNECTION,
      params: {
        dAppDomain: dappInfo.domain,
        dAppImageURI: dappInfo.imageURI,
        dAppName: dappInfo.name,
      },
    });
  };

  return (
    <ApprovalRequestBody
      title={i18nmock('approvalModal:connect.heading')}
      onApprove={onApprove}
      onReject={handleReject}
    >
      <View style={commonStyles.mainCard.container}>
        <DappInfoFragment dappInfo={dappInfo} />
        {permissions.map((permission) => (
          <View style={styles.permissionRow}>
            <CheckCircleFilledIcon size={18.33} color="green.500" />
            <Typography
              variant="small"
              color="navy.900"
              style={{ marginLeft: 9 }}
            >
              {permission}
            </Typography>
          </View>
        ))}
        <Typography variant="small" color="navy.600" style={{ marginTop: 24 }}>
          {i18nmock('approvalModal:connect.noFeeDisclaimer')}
        </Typography>
      </View>
      <InfoCard>{i18nmock('approvalModal:connect.disclaimer')}</InfoCard>
    </ApprovalRequestBody>
  );
}

const styles = StyleSheet.create({
  permissionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 24,
  },
});
