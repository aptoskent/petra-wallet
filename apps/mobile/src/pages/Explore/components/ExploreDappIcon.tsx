// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { parseColor } from '@petra/core/colors';
import PetraImage from 'core/components/PetraImage';
import React from 'react';
import { StyleSheet, Image, View, StyleProp, ViewStyle } from 'react-native';
import { DApp } from '../data/DappListSource';

const iconSize = 48;

interface ExploreDappIconProps {
  logoImage?: DApp['logoImage'];
  logoUrl: DApp['logoUrl'];
  style?: StyleProp<ViewStyle>;
}

export default function ExploreDappIcon({
  logoImage,
  logoUrl,
  style,
}: ExploreDappIconProps) {
  let children = <View style={[styles.iconLink, styles.iconPlaceholder]} />;

  if (logoImage) {
    children = <Image style={styles.iconImage} source={logoImage} />;
  } else {
    children = (
      <PetraImage style={styles.iconLink} size={iconSize} uri={logoUrl} />
    );
  }

  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  iconImage: {
    borderRadius: 12,
    height: iconSize,
    width: iconSize,
  },
  iconLink: {
    borderColor: parseColor('navy.50'),
    borderRadius: 12,
    borderWidth: 1,
    height: iconSize,
    resizeMode: 'contain',
    width: iconSize,
  },
  iconPlaceholder: {
    backgroundColor: parseColor('navy.50'),
  },
});
