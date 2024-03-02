// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { customColors } from '@petra/core/colors';
import Typography from 'core/components/Typography';
import { CheckIconSVG } from 'shared/assets/svgs';
import ErrorWarningFillSVG from 'shared/assets/svgs/error_warning_fill';
import { i18nmock } from 'strings';

interface ActivityDetailRowProps {
  body: JSX.Element;
  label: string;
}

function ActivityDetailRow({ body, label }: ActivityDetailRowProps) {
  return (
    <View style={styles.container}>
      <Typography
        style={{ marginRight: 8 }}
        variant="body"
        weight="400"
        color={customColors.navy[500]}
      >
        {label}
      </Typography>
      {body}
    </View>
  );
}

export function ActivityDetailRowText({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <ActivityDetailRow
      label={label}
      body={
        <Typography
          style={{ flexShrink: 1 }}
          numberOfLines={1}
          ellipsizeMode="tail"
          variant="body"
          weight="600"
        >
          {text}
        </Typography>
      }
    />
  );
}

export function ActivityDetailRowStatus({
  label,
  status,
}: {
  label: string;
  status: boolean;
}) {
  const color = status ? customColors.green[500] : customColors.red[500];
  return (
    <ActivityDetailRow
      label={label}
      body={
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Typography
            style={{ marginRight: 8 }}
            variant="body"
            weight="600"
            color={color}
          >
            {status
              ? i18nmock('activity:successStatus')
              : i18nmock('activity:failedStatus')}
          </Typography>
          {status ? (
            <CheckIconSVG color={color} />
          ) : (
            <ErrorWarningFillSVG color={color} />
          )}
        </View>
      }
    />
  );
}

export default ActivityDetailRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
});
