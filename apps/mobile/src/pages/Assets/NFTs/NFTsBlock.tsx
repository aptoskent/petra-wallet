// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { i18nmock } from 'strings';
import GenericBlock from 'pages/Assets/GenericBlock';
import NFTListItem from 'pages/Assets/NFTs/NFTListItem';
import { RootAuthenticatedStackParamList } from 'navigation/types';
import { TokenData } from '@petra/core/types';
import {
  ASSETS_GUTTER_PADDING,
  calculateMaxNftWidth,
  nftSpacing,
} from 'pages/Assets/shared';
import Typography from 'core/components/Typography';
import { useTheme } from 'core/providers/ThemeProvider';
import { NFTsLoaders } from 'core/components/loaders/AssetsLoaders';

interface NFTsListProps {
  nfts: TokenData[];
  onItemPressed?: (nft: TokenData) => void;
}

function NFTsList({ nfts, onItemPressed }: NFTsListProps): JSX.Element {
  const nftBlockComponentWidth =
    Dimensions.get('window').width - 2 * ASSETS_GUTTER_PADDING;
  const nftContainerWidth = calculateMaxNftWidth(
    nftBlockComponentWidth,
    (nfts ?? []).length,
  );

  const handleNavigateToNft = (nft: TokenData) => onItemPressed?.(nft);

  return (
    <View style={styles.generalNftContainer}>
      {nfts.map((el) => (
        <NFTListItem
          key={el.idHash}
          handleNavigateToDetails={handleNavigateToNft}
          resource={el}
          nftContainerWidth={nftContainerWidth}
        />
      ))}
    </View>
  );
}

interface NFTsBlockProps {
  handleNavigateToNftDetails: (nft: TokenData) => void;
  handleNavigation: (routeName: keyof RootAuthenticatedStackParamList) => void;
  isLoading: boolean;
  nfts: TokenData[];
  total: number;
}

export default function NFTsBlock({
  handleNavigateToNftDetails,
  handleNavigation,
  isLoading,
  nfts,
  total,
}: NFTsBlockProps): JSX.Element {
  const { theme } = useTheme();

  const handleOnTopBarPress = () => {
    handleNavigation('NFTsList');
  };

  const handleRenderContent = () => {
    if (isLoading) return <NFTsLoaders />;

    if (nfts.length === 0) return null;

    return <NFTsList nfts={nfts} onItemPressed={handleNavigateToNftDetails} />;
  };

  const renderTotal = () => (
    <Typography
      variant="small"
      color={theme.typography.primaryDisabled}
    >{`${total} ${i18nmock('assets:total')}`}</Typography>
  );

  return (
    <GenericBlock
      handleOnTopBarPress={handleOnTopBarPress}
      headingText={i18nmock('assets:nfts')}
      renderUpperRight={renderTotal}
    >
      {handleRenderContent()}
    </GenericBlock>
  );
}

const styles = StyleSheet.create({
  generalNftContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -nftSpacing,
    // @TODO replace with flex's gap property after upgrading to RN 71
    // https://github.com/styled-components/styled-components/issues/3628
    marginTop: 14,
  },
});
