// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { View } from 'react-native';
import { i18nmock } from 'strings';
import { NoNftsDrawingSVG } from 'shared/assets/svgs';
import ListViewEmptyState from 'pages/Assets/Shared/ListViewEmptyState';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { ParamListBase } from '@react-navigation/native';
import makeStyles from 'core/utils/makeStyles';

const pendingSentOffersPlaceholder = [];
export default function PendingNFTsSent({
  navigation,
}: MaterialTopTabScreenProps<ParamListBase>) {
  const styles = useStyles();
  React.useEffect(() => {
    navigation.setOptions({
      tabBarLabel: `${i18nmock('assets:offersSent')} (${
        pendingSentOffersPlaceholder.length
      })`,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ListViewEmptyState
        headingText={i18nmock('assets:nftsEmptyState.pendingSent.heading')}
        subText={i18nmock('assets:nftsEmptyState.pendingSent.subtext')}
        svgComponent={<NoNftsDrawingSVG />}
      />
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    flex: 1,
    justifyContent: 'center',
  },
}));
