// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

interface ClusterProps extends React.PropsWithChildren, ViewProps {
  align?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
  justify?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-around'
    | 'space-between';
  noWrap?: boolean;
  padding?: number;
  space?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Cluster({
  align = 'center',
  children,
  justify = 'flex-start',
  noWrap,
  padding = 0,
  space = 0,
  style,
  ...props
}: ClusterProps) {
  return (
    <View
      {...props}
      style={[
        {
          alignItems: align,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: noWrap ? 'nowrap' : 'wrap',
          gap: space,
          justifyContent: justify,
          padding,
          width: '100%',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
