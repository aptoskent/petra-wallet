// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Image, Box } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { customColors } from '@petra/core/colors';
import SquareBox from './SquareBox';
import { GalleryImageFallback } from './ImageFallback';

interface GalleryImageProps {
  amount?: number;
  borderRadius?: string;
  height?: string;
  imageSrc?: string;
  name?: string;
  padding?: string;
  width?: string;
}

export default function GalleryImage({
  amount,
  borderRadius,
  height,
  imageSrc,
  name,
  padding,
  width,
}: GalleryImageProps) {
  return (
    <SquareBox borderRadius={borderRadius ?? '.5rem'} overflow="hidden">
      {amount && amount > 1 ? (
        <Box
          position="absolute"
          top={1}
          right={1}
          paddingTop={1}
          paddingBottom={1}
          paddingLeft={2}
          paddingRight={2}
          backgroundColor={customColors.navy[600]}
          justifyContent="center"
          alignItems="center"
          color="white"
          display="flex"
          borderRadius={4}
          fontWeight={700}
          minWidth={8}
        >
          {amount}
        </Box>
      ) : null}
      <Image
        objectFit="cover"
        src={imageSrc}
        width={width || '100%'}
        height={height || '100%'}
        fallback={
          <GalleryImageFallback
            tooltipLabel={
              <FormattedMessage defaultMessage="Sorry! Your NFT is not loading. Please refresh the browser and try again" />
            }
            name={name}
            padding={padding}
            height={height}
            width={width}
          />
        }
      />
    </SquareBox>
  );
}
