// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ImageBackground, StyleProp } from 'react-native';
import { ImageStyle } from 'react-native-fast-image';
import { nftNameBackground } from 'shared/assets/images';
import { customColors } from '@petra/core/colors';
import Typography from './Typography';

interface PetraNameImageProps {
  rounded?: boolean | number;
  style?: StyleProp<ImageStyle>;
  uri: string;
}

export default function PetraNameImage({
  rounded,
  style,
  uri,
}: PetraNameImageProps): JSX.Element {
  const [containerSize, setContainerSize] = React.useState(0);

  const [, name = ''] = uri.split('v1/image/');

  // When a container is at least 300px wide, we want the font size
  // to be 100% * 18px. Anything smaller will scale proportionally.
  const scale = Math.min(1, containerSize / 300);
  const basePadding = 16;
  const baseRadius = 8;
  const baseFontSize = 18;

  const imageStyles: StyleProp<ImageStyle> = [
    !!rounded && { borderRadius: baseRadius, overflow: 'hidden' },
    {
      alignItems: 'center',
      aspectRatio: 1,
      justifyContent: 'center',
      padding: basePadding * scale,
    },
    style,
  ];

  return (
    <ImageBackground
      onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}
      style={imageStyles}
      source={nftNameBackground}
      resizeMode="cover"
    >
      <Typography
        weight="600"
        numberOfLines={4}
        style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: baseRadius * scale,
          color: customColors.white,
          fontSize: baseFontSize * scale,
          lineHeight: 1.6 * baseFontSize * scale,
          overflow: 'hidden',
          padding: basePadding * scale,
          textAlign: 'center',
        }}
      >
        {name}.apt
      </Typography>
    </ImageBackground>
  );
}
