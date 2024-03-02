// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { i18nmock } from 'strings';
import Typography from 'core/components/Typography';
import { PADDING } from 'shared/constants';
import { getDappFromUrl } from '../data/DappListSource';
import ExploreDappIcon from './ExploreDappIcon';
import ExploreSectionTitle from './ExploreSectionTitle';

export interface ExploreHistoryEntry {
  link: string;
  name: string;
}

interface ExploreDappHistoryProps {
  history: ExploreHistoryEntry[];
  onItemClick: (item: ExploreHistoryEntry) => void;
}

export default function ExploreDappHistory({
  history,
  onItemClick,
}: ExploreDappHistoryProps): JSX.Element {
  const renderItem = (item: ExploreHistoryEntry) => {
    const { logoImage, logoUrl, name } = getDappFromUrl(item.link);
    return (
      <TouchableWithoutFeedback
        onPress={() => onItemClick(item)}
        key={item.name + item.link}
      >
        <View style={styles.dapp}>
          <ExploreDappIcon logoUrl={logoUrl} logoImage={logoImage} />
          <Typography
            numberOfLines={1}
            color="navy.600"
            variant="small"
            style={styles.dappTitle}
          >
            {name ?? item.name}
          </Typography>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View>
      <ExploreSectionTitle style={styles.historyTitle}>
        {i18nmock('general:exploreHistory')}
      </ExploreSectionTitle>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        {history.map(renderItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dapp: {
    alignItems: 'center',
    width: 80,
  },
  dappTitle: {
    marginTop: 4,
    maxWidth: 80,
  },
  historyTitle: {
    paddingLeft: PADDING.container,
  },
  scrollView: {
    gap: 8,
    paddingHorizontal: PADDING.container,
    paddingTop: 8,
  },
});
