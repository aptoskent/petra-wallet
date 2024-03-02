// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { usePetraBottomSheetContext } from 'core/components/PetraBottomSheet/PetraBottomSheetContext';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PetraBottomSheetFooter({
  children,
}: PropsWithChildren) {
  const { isOverflowing } = usePetraBottomSheetContext();
  const { bottom: bottomInset } = useSafeAreaInsets();
  return (
    <View
      style={{
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        borderTopWidth: isOverflowing ? 1 : 0,
        flexGrow: 0,
        flexShrink: 0,
        padding: 16,
        paddingBottom: bottomInset !== 0 ? bottomInset : undefined,
      }}
    >
      {children}
    </View>
  );
}
