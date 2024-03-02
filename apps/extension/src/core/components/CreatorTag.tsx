// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Tag, TagLabel, useColorMode } from '@chakra-ui/react';
import { collapseHexString } from '@petra/core/utils/hex';
import Copyable from 'core/components/Copyable';

interface CreatorTagProps {
  address: string;
  bgColor?: string;
  color?: string;
  fontWeight?: number;
  px?: number;
  size?: string[] | string;
}

const tagColor = {
  dark: 'gray.600',
  light: 'gray.200',
};

function CreatorTag({
  address,
  bgColor,
  color,
  fontWeight,
  px,
  size,
}: CreatorTagProps) {
  const { colorMode } = useColorMode();

  return (
    <Copyable value={address}>
      <Tag
        fontSize={size || ['xs', 'sm', 'md']}
        fontWeight={fontWeight}
        color={color}
        bgColor={bgColor || tagColor[colorMode]}
        borderRadius="full"
        px={px}
      >
        <TagLabel maxW="140px">{collapseHexString(address)}</TagLabel>
      </Tag>
    </Copyable>
  );
}

export default CreatorTag;
