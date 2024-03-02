// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React from 'react';

import ContentLoader, {
  IContentLoaderProps,
} from 'react-content-loader/native';

export interface PetraContentLoaderProps extends IContentLoaderProps {
  radius?: number;
}

function PetraContentLoader({
  children,
  height = 0,
  width = 0,
  ...props
}: PetraContentLoaderProps): JSX.Element {
  return (
    <ContentLoader
      speed={2}
      width={width}
      height={height}
      backgroundColor={customColors.lightGray}
      foregroundColor={customColors.navy['200']}
      {...props}
    >
      {children}
    </ContentLoader>
  );
}

export default PetraContentLoader;
