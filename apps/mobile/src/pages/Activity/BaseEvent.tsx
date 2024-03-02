// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as Types from '@petra/core/activity/types';
import { customColors } from '@petra/core/colors';
import Typography from 'core/components/Typography';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { i18nmock } from 'strings';

export type ActivityEventProps<E = Types.ActivityEvent> = {
  event: E;
};

type BaseEventProps = {
  extra?: JSX.Element;
  icon: JSX.Element;
  text: JSX.Element;
};

function BaseEvent({ extra, icon, text }: BaseEventProps) {
  return (
    <View style={styles.container}>
      {icon}
      <View style={styles.text}>{text}</View>
      <View style={styles.extra}>{extra}</View>
    </View>
  );
}

export function BaseActivityStatusText({
  failText,
  status,
  successText,
}: {
  failText: string;
  status: boolean;
  successText: string;
}) {
  return (
    <>
      {!status && (
        <Typography variant="body" color={customColors.error} weight="600">
          {`${i18nmock('activity:failedStatus')} `}
        </Typography>
      )}
      {status ? successText : failText}
    </>
  );
}

export default BaseEvent;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  extra: {
    alignItems: 'flex-end',
    width: 100,
  },
  text: {
    flexGrow: 1,
    flexShrink: 1,
    marginHorizontal: 8,
  },
});
