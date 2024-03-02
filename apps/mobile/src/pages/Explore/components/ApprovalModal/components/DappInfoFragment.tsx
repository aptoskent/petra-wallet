// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DappInfo } from '@petra/core/types';

import { customColors } from '@petra/core/colors';
import ExploreDappIcon from 'pages/Explore/components/ExploreDappIcon';
import { getDappFromUrl } from 'pages/Explore/data/DappListSource';

export default function DappInfoFragment({ dappInfo }: { dappInfo: DappInfo }) {
  const { logoImage, logoUrl } = getDappFromUrl(dappInfo.domain);
  return (
    <View style={styles.container}>
      <ExploreDappIcon
        logoImage={logoImage}
        logoUrl={logoUrl}
        style={styles.icon}
      />
      <Text style={styles.domain}>{dappInfo.domain}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  domain: {
    color: customColors.navy[900],
    fontSize: 16,
    fontWeight: '700',
  },
  icon: {
    marginRight: 8,
  },
});
