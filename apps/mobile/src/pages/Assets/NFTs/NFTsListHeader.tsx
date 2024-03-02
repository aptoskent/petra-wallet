// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { i18nmock } from 'strings';
import { CloseIconSVG } from 'shared/assets/svgs';
import Typography from 'core/components/Typography';
import { HIT_SLOPS } from 'shared';

interface NFTsListHeaderProps {
  goBack: () => void;
  isNames: boolean;
}

export default function NFTsListHeader({
  goBack,
  isNames = false,
}: NFTsListHeaderProps): JSX.Element {
  const headingText = isNames
    ? i18nmock('assets:names')
    : i18nmock('assets:nfts');
  return (
    <View style={styles.container}>
      <Typography variant="heading" weight="900">
        {headingText}
      </Typography>
      <TouchableOpacity onPress={() => goBack()} hitSlop={HIT_SLOPS.midSlop}>
        <CloseIconSVG color="navy.600" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
