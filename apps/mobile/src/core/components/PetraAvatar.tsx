// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Avatar, {
  AvatarProps as BoringAvatarProps,
} from 'react-native-boring-avatars';
import { avatarColors } from '@petra/core/colors';

interface AvatarProps {
  accountAddress: string;
  size: number;
  variant?: BoringAvatarProps['variant'];
}

function PetraAvatar({
  accountAddress,
  size,
  variant = 'ring',
}: AvatarProps): JSX.Element {
  return (
    <Avatar
      size={size}
      name={accountAddress}
      variant={variant}
      colors={avatarColors}
    />
  );
}

export function CoinAvatar({ ...props }: AvatarProps): JSX.Element {
  return <PetraAvatar {...props} variant="ring" />;
}

export function AccountAvatar({ ...props }: AvatarProps): JSX.Element {
  return <PetraAvatar {...props} variant="sunset" />;
}
