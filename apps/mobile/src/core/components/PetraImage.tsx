// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleProp } from 'react-native';
import { SvgUri } from 'react-native-svg';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import PetraNameImage from './PetraNameImage';

interface LinkImageProps {
  aspectRatio?: number;
  rounded?: boolean | number;
  size?: number;
  style?: StyleProp<ImageStyle>;
  uri: string;
}

/*
 * Component to render an image from a uri (png, web, svg, etc).
 * If the uri is a svg, it will render a SvgUri component.
 * Otherwise, it will render a Image component.
 */
export default function PetraImage({
  aspectRatio,
  rounded,
  size,
  style,
  uri,
}: LinkImageProps): JSX.Element {
  const extension = uri.split('.').pop();
  const isSvg = extension === 'svg';
  const isAptosName = /aptos-names-api/i.test(uri);

  const imageStyles: StyleProp<ImageStyle> = [
    !!aspectRatio && { aspectRatio },
    !!rounded && { borderRadius: 8, overflow: 'hidden' },
    // SVGs don't respect CSS's height and width, this is only for images
    !!size && { height: size, width: size },
    style,
  ];

  if (isAptosName) {
    return <PetraNameImage uri={uri} rounded={rounded} style={imageStyles} />;
  }

  if (isSvg) {
    return <SvgUri style={imageStyles} height={size} width={size} uri={uri} />;
  }

  return <FastImage style={imageStyles} source={{ uri }} />;
}
