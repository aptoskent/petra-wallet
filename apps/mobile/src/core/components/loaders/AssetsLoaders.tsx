// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import makeStyles from 'core/utils/makeStyles';
import { View, ViewProps } from 'react-native';
import { Rect } from 'react-native-svg';
import PetraContentLoader, {
  PetraContentLoaderProps,
} from '../PetraContentLoader';

export function NFTsLoaders({ style, ...props }: ViewProps): JSX.Element {
  const styles = useStyles();

  return (
    <View style={[style, styles.nftsLoader]} {...props}>
      <PetraContentLoader width="100%" height="100%">
        <Rect rx={8} ry={8} width="48%" height="100%" />
        <Rect x="52%" rx={8} ry={8} width="48%" height="100%" />
      </PetraContentLoader>
    </View>
  );
}

export function CoinsBlockLoaders(props: PetraContentLoaderProps): JSX.Element {
  return (
    <PetraContentLoader width="100%" height={50} {...props}>
      <Rect y={5} rx={10} ry={10} width="100%" height={20} />
      <Rect y={30} rx={10} ry={10} width="100%" height={20} />
    </PetraContentLoader>
  );
}

const useStyles = makeStyles(() => ({
  assetsBlockLoader: {
    alignSelf: 'center',
  },
  nftsLoader: {
    aspectRatio: 2,
    marginTop: 16,
    width: '100%',
  },
}));
