// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

declare module 'react-native-boring-avatars' {
  export interface AvatarProps {
    colors?: string[];
    name?: string;
    size?: number | string;
    square?: boolean;
    variant?: 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';
  }

  interface AvatarComponent {
    (props: AvatarProps, context?: any): React.ReactElement | null;
  }

  const Avatar: AvatarComponent;

  export default Avatar;
}
