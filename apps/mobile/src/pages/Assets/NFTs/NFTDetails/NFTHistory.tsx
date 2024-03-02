// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { TokenActivity, TokenData, TokenEvent } from '@petra/core/types';
import Typography from 'core/components/Typography';
import { i18nmock } from 'strings';
import useTokenActivities from '@petra/core/queries/useTokenActivities';
import { normalizeTimestamp } from '@petra/core/transactions';
import Cluster from 'core/components/Layouts/Cluster';
import { customColors } from '@petra/core/colors';
import ExternalLinkIconSVG from 'shared/assets/svgs/external_link_icon';
import InfoPill from 'core/components/InfoPill';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import PetraAddress from 'core/components/PetraAddress';
import { useWebViewPopover } from 'core/providers/WebViewPopoverProvider';
import { HIT_SLOPS } from 'shared';

interface NFTPropertiesProps {
  containerStyles?: ViewStyle;
  nft: TokenData;
}

function tokenEventToString(event: TokenEvent): string {
  switch (event) {
    case TokenEvent.Mint:
      return i18nmock('assets:nftsDetail.history.minted');
    case TokenEvent.Deposit:
      return i18nmock('assets:nftsDetail.history.deposited');
    case TokenEvent.CancelOffer:
      return i18nmock('assets:nftsDetail.history.cancelled');
    case TokenEvent.Claim:
      return i18nmock('assets:nftsDetail.history.claimed');
    case TokenEvent.Create:
      return i18nmock('assets:nftsDetail.history.created');
    case TokenEvent.Mutate:
      return i18nmock('assets:nftsDetail.history.mutatedToken');
    case TokenEvent.Offer:
      return i18nmock('assets:nftsDetail.history.offered');
    case TokenEvent.Withdraw:
      return i18nmock('assets:nftsDetail.history.withdrew');
    default:
      return '';
  }
}

function tokenEventToPreposition(event: TokenEvent): string {
  switch (event) {
    case TokenEvent.Mint:
      return i18nmock('general:by');
    case TokenEvent.Deposit:
    case TokenEvent.CancelOffer:
    case TokenEvent.Claim:
    case TokenEvent.Create:
    case TokenEvent.Mutate:
    case TokenEvent.Offer:
    case TokenEvent.Withdraw:
    default:
      return i18nmock('general:toLowercase');
  }
}

function NFTHistory({ containerStyles, nft }: NFTPropertiesProps) {
  const { openUri } = useWebViewPopover();
  const nftActivities = useTokenActivities(nft.idHash);
  const getExplorerAddress = useExplorerAddress();

  const items = useMemo(
    () => nftActivities.data?.pages.flatMap((page) => page.items),
    [nftActivities.data],
  );

  if (nftActivities.isError) {
    return (
      <Typography variant="display" align="center">
        {i18nmock('assets:nftsDetail.history.error')}
      </Typography>
    );
  }

  if (nftActivities.isLoading) {
    return (
      <View style={[styles.container, containerStyles]}>
        <ActivityIndicator />
      </View>
    );
  }

  function renderEmptyState() {
    return (
      <InfoPill style={styles.spacingTop}>
        <Typography align="center" color={customColors.navy['700']}>
          {i18nmock('assets:nftsDetail.history.empty')}
        </Typography>
      </InfoPill>
    );
  }

  function renderHistoryItem(activity: TokenActivity) {
    const normalizedTimestamp = normalizeTimestamp(
      activity.transactionTimestamp,
    );

    const transactionTimestamp = new Date(normalizedTimestamp).toLocaleString();
    const eventName = tokenEventToString(activity.transferType as TokenEvent);

    return (
      <InfoPill
        style={styles.spacingTop}
        key={`${activity.accountAddress}
              _${activity.creationNumber}
              _${activity.sequenceNumber}`}
      >
        <Cluster justify="space-between" noWrap>
          <View>
            <Typography weight="600">{eventName}</Typography>
            {activity.fromAddress ? (
              <Cluster align="baseline" space={4}>
                <Typography
                  style={styles.spacingTopSmall}
                  color={customColors.navy[900]}
                >
                  {i18nmock('general:from')}
                </Typography>
                <PetraAddress address={activity.fromAddress} />
              </Cluster>
            ) : null}

            {activity.toAddress ? (
              <Cluster align="baseline" space={4}>
                <Typography
                  style={styles.spacingTopSmall}
                  color={customColors.navy[900]}
                >
                  {tokenEventToPreposition(activity.transferType as TokenEvent)}
                </Typography>
                <PetraAddress address={activity.toAddress} />
              </Cluster>
            ) : null}

            <Typography
              variant="small"
              style={styles.spacingTopSmall}
              color={customColors.navy[600]}
            >
              {transactionTimestamp}
            </Typography>
          </View>

          <TouchableOpacity
            hitSlop={HIT_SLOPS.midSlop}
            onPress={() => {
              openUri({
                title: eventName,
                uri: getExplorerAddress(`txn/${activity.transactionVersion}`),
              });
            }}
          >
            <ExternalLinkIconSVG color={customColors.navy[600]} size={12} />
          </TouchableOpacity>
        </Cluster>
      </InfoPill>
    );
  }

  return (
    <View style={[styles.container, containerStyles]}>
      <Typography variant="bodyLarge" color={customColors.navy[900]}>
        {i18nmock('assets:nftsDetail.history.title')}
      </Typography>

      {!nftActivities.isSuccess || !items || !items.length
        ? renderEmptyState()
        : items.map(renderHistoryItem)}
    </View>
  );
}

export default NFTHistory;

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  spacingTop: {
    marginTop: 8,
  },
  spacingTopSmall: {
    marginTop: 2,
  },
});
