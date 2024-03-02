// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  chakra,
  Text,
  Box,
  Tooltip,
  useColorMode,
  Icon,
} from '@chakra-ui/react';
import { AiFillInfoCircle } from '@react-icons/all-files/ai/AiFillInfoCircle';
import { textColorSecondary, checkedBgColor } from '@petra/core/colors';
import React from 'react';
import SquareBox from './SquareBox';

interface ImageFallbackProps {
  name?: string;
  padding?: string;
  tooltipLabel?: JSX.Element;
}

function GalleryImageFallbackNonChakra({
  name,
  padding,
  tooltipLabel,
  ...props
}: ImageFallbackProps) {
  const { colorMode } = useColorMode();

  return (
    <SquareBox
      color={textColorSecondary[colorMode]}
      bgColor={checkedBgColor[colorMode]}
      display="flex"
      flexDirection="column"
      padding={padding}
      {...props}
    >
      <Tooltip label={name}>
        <Text
          fontSize="xs"
          flex={1}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {name}
        </Text>
      </Tooltip>
      <Tooltip label={tooltipLabel}>
        <Box alignSelf="end" flexShrink={0} justifyContent="end">
          <Icon as={AiFillInfoCircle} size="xs" />
        </Box>
      </Tooltip>
    </SquareBox>
  );
}

export const GalleryImageFallback = chakra(GalleryImageFallbackNonChakra);

function ImageFallbackNonChakra({
  name,
  tooltipLabel,
  ...props
}: ImageFallbackProps) {
  const { colorMode } = useColorMode();

  return (
    <SquareBox
      color={textColorSecondary[colorMode]}
      bgColor={checkedBgColor[colorMode]}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Text
        flex={1}
        fontSize="xs"
        maxW="32px"
        textAlign="center"
        fontWeight={500}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {name}
      </Text>
    </SquareBox>
  );
}

export const ImageFallback = chakra(ImageFallbackNonChakra);
