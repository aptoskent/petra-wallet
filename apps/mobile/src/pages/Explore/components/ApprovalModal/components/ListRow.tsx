// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Typography from 'core/components/Typography';
import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { HIT_SLOPS } from 'shared';
import InfoIconSVG from 'shared/assets/svgs/info_icon';

export interface ListRowProps {
  onShowDetails?: () => void;
  title: string;
  value: ReactNode;
}

export default function ListRow({ onShowDetails, title, value }: ListRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Typography color="navy.500" style={{ marginRight: 4 }}>
          {title}
        </Typography>
        {onShowDetails !== undefined ? (
          <TouchableOpacity
            onPress={onShowDetails}
            hitSlop={HIT_SLOPS.smallSlop}
          >
            <InfoIconSVG size={16} color="navy.500" />
          </TouchableOpacity>
        ) : null}
      </View>
      <Typography color="navy.900" weight="600">
        {value}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
