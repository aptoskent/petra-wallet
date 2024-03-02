// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import Typography from 'core/components/Typography';
import { PADDING } from 'shared/constants';
import { DApp } from '../data/DappListSource';
import ExploreDappIcon from './ExploreDappIcon';

interface DappListItemProps {
  item: DApp;
  onClick(item: DApp): void;
}

export default function DappListItem({ item, onClick }: DappListItemProps) {
  return (
    <TouchableHighlight
      onPress={() => onClick(item)}
      underlayColor={customColors.navy['50']}
    >
      <View style={styles.dapp}>
        <ExploreDappIcon logoUrl={item.logoUrl} logoImage={item.logoImage} />
        <View style={styles.description}>
          <Typography weight="600" color="navy.900">
            {item.name}
          </Typography>
          <Typography variant="small" color="navy.600">
            {item.description}
          </Typography>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  dapp: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: PADDING.container,
    padding: PADDING.container,
  },
  description: {
    flexShrink: 1,
  },
});
