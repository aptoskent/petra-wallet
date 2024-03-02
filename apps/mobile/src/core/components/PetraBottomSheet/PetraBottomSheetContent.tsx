// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { usePetraBottomSheetContext } from 'core/components/PetraBottomSheet/PetraBottomSheetContext';
import React, { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Note: https://gorhom.github.io/react-native-bottom-sheet/troubleshooting/#adding-horizontal-flatlist-or-scrollview-is-not-working-properly-on-android

export interface PetraBottomSheetContentProps extends PropsWithChildren {
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function PetraBottomSheetContent({
  children,
  contentContainerStyle,
}: PetraBottomSheetContentProps) {
  const { isOverflowing } = usePetraBottomSheetContext();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={isOverflowing}
      style={{
        flexGrow: 1,
        flexShrink: 1,
      }}
      contentContainerStyle={[
        {
          padding: 0,
          paddingBottom: safeAreaInsets.bottom,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}
