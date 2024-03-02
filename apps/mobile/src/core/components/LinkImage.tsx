// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { SvgUri } from 'react-native-svg';

interface LinkImageProps {
  size: number;
  style?: StyleProp<ImageStyle>;
  uri: string | number;
}

/*
 * Component to render an image from a uri (png, web, svg, etc).
 * If the uri is a svg, it will render a SvgUri component.
 * Otherwise, it will render a Image component.
 */
export default function LinkImage({
  size,
  style,
  uri,
}: LinkImageProps): JSX.Element {
  const isRequire = typeof uri === 'number';
  const isSvg = !isRequire && uri.split('.').pop() === 'svg';
  return isSvg ? (
    <SvgUri style={style} width={size} height={size} uri={uri} />
  ) : (
    <Image
      style={[{ height: size, width: size }, style]}
      source={isRequire ? uri : { uri }}
    />
  );
}
