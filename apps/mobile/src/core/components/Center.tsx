// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, ViewProps } from 'react-native';

export default function Center({ children, style, ...props }: ViewProps) {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          flexGrow: 1,
          justifyContent: 'center',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
