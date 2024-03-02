// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import TokenData from '@petra/core/types/token';
import { Box } from '@chakra-ui/react';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import ChakraLink from './ChakraLink';
import GalleryImage from './GalleryImage';

interface GalleryItemProps {
  height?: string;
  padding?: string;
  tokenData: TokenData;
  width?: string;
}

function GalleryItem({ height, padding, tokenData, width }: GalleryItemProps) {
  const tokenMetadata = useTokenMetadata(tokenData);
  return (
    <Box>
      <ChakraLink to={`/tokens/${tokenData.idHash}`} state={tokenData}>
        <GalleryImage
          imageSrc={tokenMetadata.data?.image}
          name={tokenData.name}
          padding={padding}
          height={height}
          width={width}
          amount={tokenData.amount}
        />
      </ChakraLink>
    </Box>
  );
}

export default GalleryItem;
