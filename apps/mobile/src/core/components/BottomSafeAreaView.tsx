// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// TODO: SafeAreaView might be simpler than this
export default forwardRef<View, ViewProps>(({ style, ...otherProps }, ref) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      ref={ref}
      style={[{ flexGrow: 1, paddingBottom: bottom }, style]}
      {...otherProps}
    />
  );
});
