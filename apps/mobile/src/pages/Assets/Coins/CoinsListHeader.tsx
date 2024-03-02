// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { i18nmock } from 'strings';
import { customColors } from '@petra/core/colors';
import { CloseIconSVG } from 'shared/assets/svgs';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import Typography from 'core/components/Typography';

const windowWidth = Dimensions.get('window').width;

type CoinsListHeaderProps = RootAuthenticatedStackScreenProps<'CoinsList'>;

export default function CoinsListHeader({
  navigation,
}: NativeStackScreenProps<CoinsListHeaderProps>): JSX.Element {
  return (
    <View style={styles.container}>
      <Typography variant="heading" weight="700">
        {i18nmock('assets:coins')}
      </Typography>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <CloseIconSVG color={customColors.navy['600']} />
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
    width: Math.floor(windowWidth * 0.9),
  },
});
