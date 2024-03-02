// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Text, View } from 'react-native';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import makeStyles from 'core/utils/makeStyles';

type CoinDetailsProps = RootAuthenticatedStackScreenProps<'CoinDetails'>;

export default function CoinDetails({ route }: CoinDetailsProps) {
  const styles = useStyles();
  const { coinType } = route.params;
  return (
    <View style={styles.container}>
      <Text>{coinType}</Text>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    flex: 1,
    paddingHorizontal: 16,
  },
}));
