// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, ScrollView } from 'react-native';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import NFTDescriptionSection from './NFTDescriptionSection';
import NFTDetailSection from './NFTDetailSection';
import NFTAttributes from './NFTAttributes';
import NFTProperties from './NFTProperties';
import NFTHistory from './NFTHistory';

type NFTDetailsProps = RootAuthenticatedStackScreenProps<'NFTDetails'>;

export default function NFTDetails({ route }: NFTDetailsProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  const nft = route.params.token;
  const { data: metadata } = useTokenMetadata(nft);

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <NFTDescriptionSection nft={nft} metadata={metadata} />
        <NFTDetailSection
          nft={nft}
          metadata={metadata}
          containerStyles={styles.spacingTop}
        />
        <NFTAttributes
          metadata={metadata}
          containerStyles={styles.spacingTop}
        />
        <NFTProperties nft={nft} containerStyles={styles.spacingTop} />
        <NFTHistory nft={nft} containerStyles={styles.spacingTop} />
      </View>
    </ScrollView>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    flex: 1,
    paddingHorizontal: PADDING.container,
  },
  scrollView: {
    backgroundColor: theme.background.secondary,
  },
  spacingTop: {
    marginTop: 24,
  },
}));
