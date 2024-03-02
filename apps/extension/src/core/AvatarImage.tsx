// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Avatar, { AvatarProps as BoringAvatarProps } from 'boring-avatars';
import React from 'react';
import { avatarColors } from '@petra/core/colors';

interface AvatarProps {
  address: string;
  size: number;
  variant?: BoringAvatarProps['variant'];
}

export default function AvatarImage({
  address,
  size,
  variant = 'ring',
}: AvatarProps) {
  return (
    <Avatar
      size={size}
      name={address}
      variant={variant}
      colors={avatarColors}
    />
  );
}
