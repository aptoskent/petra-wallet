// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-underscore-dangle */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { customColors } from '@petra/core/colors';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import CompassSVG from 'shared/assets/svgs/compass';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import { APTOS_COIN_INFO, PADDING } from 'shared/constants';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import { i18nmock } from 'strings';
import { useWebViewPopover } from 'core/providers/WebViewPopoverProvider';
import { ActivityEvent } from '@petra/core/activity';
import { formatAmount } from '@petra/core/utils/coin';
import makeStyles from 'core/utils/makeStyles';
import { throwInDev } from 'shared/utils';
import {
  ActivityDetailRowStatus,
  ActivityDetailRowText,
} from './ActivityDetailRow';
import { formatCoin } from './util';

function ActivityDetailEventGeneralInfo({ event }: { event: ActivityEvent }) {
  return (
    <View>
      <ActivityDetailRowText
        label={i18nmock('activity:version')}
        text={event.version.toString()}
      />
      <ActivityDetailRowText
        label={i18nmock('activity:timestamp')}
        text={event.timestamp.toLocaleString()}
      />
      <ActivityDetailRowStatus
        label={i18nmock('activity:status')}
        status={event.success}
      />
      <ActivityDetailRowText
        label={i18nmock('activity:gas')}
        text={formatAmount(event.gas, APTOS_COIN_INFO, { prefix: false })}
      />
    </View>
  );
}

function typeStringForEvent(event: ActivityEvent) {
  switch (event._type) {
    case 'send':
      return i18nmock('activity:send');
    case 'receive':
      return i18nmock('activity:receive');
    case 'gas':
      return i18nmock('activity:gas');
    case 'swap':
      return i18nmock('activity:swap');
    case 'send_token':
    case 'send_token_offer':
      return i18nmock('activity:send_token');
    case 'receive_token':
    case 'receive_token_offer':
      return i18nmock('activity:receive_token');
    case 'mint_token':
      return i18nmock('activity:mint_token');
    case 'add-stake':
      return i18nmock('activity:stakeEvents.staked');
    case 'unstake':
      return i18nmock('activity:stakeEvents.unstaked');
    case 'withdraw-stake':
      return i18nmock('activity:stakeEvents.withdrawn');
    default:
      throwInDev(`Unexpected object: ${event}`);
      // we don't want to throw in Prod because it will crash the app
      // use empty string as only acceptable way to handle in Prod
      return '';
  }
}

function ActivityDetailEventInfo({ event }: { event: ActivityEvent }) {
  const rows = [
    {
      key: i18nmock('activity:type'),
      value: typeStringForEvent(event),
    },
  ];
  switch (event._type) {
    case 'send':
      rows.push({
        key: i18nmock('activity:amount'),
        value: formatCoin(event.amount, event.coinInfo),
      });
      break;
    case 'receive':
      rows.push({
        key: i18nmock('activity:amount'),
        value: formatCoin(event.amount, event.coinInfo),
      });
      break;
    case 'gas':
      break;
    case 'swap':
      break;
    case 'add-stake':
    case 'unstake':
    case 'withdraw-stake':
      rows.push({
        key: i18nmock('activity:amount'),
        value: formatCoin(BigInt(event.amount), APTOS_COIN_INFO),
      });
      break;
    case 'send_token':
    case 'send_token_offer':
    case 'receive_token':
    case 'receive_token_offer':
    case 'mint_token':
      rows.push({
        key: i18nmock('activity:name'),
        value: event.name,
      });
      break;
    default:
      throwInDev(`Unexpected object: ${event}`);
  }

  return (
    <View>
      {rows.map(({ key, value }) => (
        <ActivityDetailRowText key={key} label={key} text={value} />
      ))}
    </View>
  );
}

function Divider({ style }: { style?: ViewStyle }) {
  return (
    <View
      style={[style, { backgroundColor: customColors.navy[100], height: 1 }]}
    />
  );
}

function ActivityDetail({
  route,
}: RootAuthenticatedStackScreenProps<'ActivityDetail'>) {
  const styles = useStyles();
  const { openUri } = useWebViewPopover();
  const { event } = route.params;
  const getExplorerAddress = useExplorerAddress();

  const handleNavigateToExplorer = () => {
    const explorerAddress = getExplorerAddress(`txn/${event.version}`);
    openUri({
      title: i18nmock('settings:viewOnExplorer.modalTitle'),
      uri: explorerAddress,
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <ActivityDetailEventGeneralInfo event={event} />
        <Divider style={{ marginVertical: 16 }} />
        <ActivityDetailEventInfo event={event} />
      </View>
      <PetraPillButton
        text={i18nmock('settings:viewOnExplorer.title')}
        onPress={handleNavigateToExplorer}
        buttonDesign={PillButtonDesign.clearWithDarkText}
        leftIcon={CompassSVG}
      />
    </View>
  );
}

export default ActivityDetail;

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.container,
    paddingVertical: 40,
  },
}));
