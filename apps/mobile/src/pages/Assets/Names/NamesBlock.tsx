// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import GenericBlock from 'pages/Assets/GenericBlock';
import { i18nmock } from 'strings';
import NFTListItem from 'pages/Assets/NFTs/NFTListItem';
import {
  ASSETS_GUTTER_PADDING,
  calculateMaxNftWidth,
  nftSpacing,
} from 'pages/Assets/shared';
import { TokenData } from '@petra/core/types';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useAccountTokens } from '@petra/core/queries/useTokens';
import { useTheme } from 'core/providers/ThemeProvider';
import Typography from 'core/components/Typography';

interface NamesBlockProps {
  handleNavigateToNameNft: (nft: TokenData) => void;
  handleNavigateToNftList: () => void;
}

export default function NamesBlock({
  handleNavigateToNameNft,
  handleNavigateToNftList,
}: NamesBlockProps): JSX.Element {
  const { theme } = useTheme();
  const { activeAccountAddress } = useActiveAccount();
  const { allTokens } = useAccountTokens(activeAccountAddress);

  const nftBlockComponentWidth =
    Dimensions.get('window').width - 2 * ASSETS_GUTTER_PADDING;
  const nftContainerWidth = calculateMaxNftWidth(
    nftBlockComponentWidth,
    (allTokens ?? 0).length,
  );

  const handleOnTopBarPress = () => {
    handleNavigateToNftList();
  };

  const renderTotal = () => (
    <Typography variant="small" color={theme.typography.primaryDisabled}>{`${
      allTokens.length
    } ${i18nmock('assets:total')}`}</Typography>
  );

  return (
    <GenericBlock
      handleOnTopBarPress={handleOnTopBarPress}
      headingText={i18nmock('assets:names')}
      renderUpperRight={renderTotal}
    >
      <View style={styles.generalNftContainer}>
        {allTokens.slice(0, 4).map((el) => (
          <NFTListItem
            key={el.idHash}
            handleNavigateToDetails={handleNavigateToNameNft}
            resource={el}
            nftContainerWidth={nftContainerWidth}
          />
        ))}
      </View>
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
