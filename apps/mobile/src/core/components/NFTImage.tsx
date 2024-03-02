// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { getTokenMetadata } from '@petra/core/utils/token';
import React from 'react';
import { StyleProp, View } from 'react-native';
import { ImageStyle } from 'react-native-fast-image';
import PetraImage from './PetraImage';

interface LinkImageProps {
  size: number;
  style?: StyleProp<ImageStyle>;
  uri: string;
}

/*
 * Component to render an image from a NFT uri.
 * If the uri is a metadata uri, it will download the underlying image.
 * else it will try to render the image directly
 */
export default function NFTImage({ size, style, uri }: LinkImageProps) {
  const [imageUri, setImageUri] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const getImage = async () => {
      const metadata = await getTokenMetadata('', uri);
      if (metadata) {
        setImageUri(metadata.image);
      }
    };

    getImage();
  }, [uri]);

  if (imageUri) {
    return <PetraImage style={style} uri={imageUri} size={size} rounded />;
  }

  // If still loading then show a placeholder view
  return (
    <View
      style={[
        style,
        {
          backgroundColor: customColors.navy[50],
          height: size,
          width: size,
        },
      ]}
    />
  );
}
