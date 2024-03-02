// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PetraListItem, { ItemType } from './PetraListItem';

interface PetraListProps {
  footerLocation?: 'flush-with-list' | 'flush-with-bottom';
  handleItemPress?: (item: ItemType<any>) => void;
  items: ItemType<any>[];
  renderFooter?: () => JSX.Element;
  renderHeader?: () => JSX.Element;
}

export default function PetraList({
  footerLocation = 'flush-with-list',
  handleItemPress,
  items,
  renderFooter,
  renderHeader,
}: PetraListProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom },
      ]}
    >
      {renderHeader?.()}
      {items.map((item: ItemType<any>) => (
        <PetraListItem
          item={item}
          key={item.id}
          onPress={() => handleItemPress?.(item)}
        />
      ))}
      {renderFooter ? (
        <View
          style={
            footerLocation === 'flush-with-bottom'
              ? styles.footerFlushBottom
              : null
          }
        >
          {renderFooter()}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  footerFlushBottom: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
