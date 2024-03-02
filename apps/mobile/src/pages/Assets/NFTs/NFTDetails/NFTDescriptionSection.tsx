// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { TouchableOpacity, View, ViewStyle, StyleSheet } from 'react-native';
import { MetadataJson, TokenData } from '@petra/core/types';
import Typography from 'core/components/Typography';
import { i18nmock } from 'strings';
import Cluster from 'core/components/Layouts/Cluster';
import { customColors } from '@petra/core/colors';
import PetraImage from 'core/components/PetraImage';
import useTokenStorageProvider from '@petra/core/hooks/useTokenStorageProvider';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootAuthenticatedStackParamList } from 'navigation/types';
import NFTHeader from './NFTHeader';

interface NFTDescriptionSectionProps {
  containerStyles?: ViewStyle;
  metadata: MetadataJson | undefined;
  nft: TokenData;
}

// Based on the designs, we show three lines by default
// and allow the user to expand the description to view it all
const maxLines = 3;

function NFTDescriptionSection({
  containerStyles,
  metadata,
  nft,
}: NFTDescriptionSectionProps) {
  const [isCollapsible, setIsCollapsible] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const provider = useTokenStorageProvider(nft);
  const { collectionData } = nft;
  const route =
    useRoute<RouteProp<RootAuthenticatedStackParamList, 'NFTDetails'>>();

  const renderDescription = () => {
    const tokenDescription = metadata?.description || nft?.description;

    const descriptionBlock = (
      <Typography
        marginTop
        align="left"
        numberOfLines={isCollapsible && isCollapsed ? maxLines : undefined}
        onTextLayout={(e) => {
          if (!isCollapsible && e.nativeEvent.lines.length > maxLines) {
            setIsCollapsed(true);
            setIsCollapsible(true);
          }
        }}
      >
        {tokenDescription}
      </Typography>
    );

    const toggleText = (
      <Typography marginTop underline align="left">
        {isCollapsed
          ? i18nmock('assets:nftsDetail.description.seeMore')
          : i18nmock('assets:nftsDetail.description.seeLess')}
      </Typography>
    );

    return isCollapsible ? (
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
        {descriptionBlock}
        {toggleText}
      </TouchableOpacity>
    ) : (
      descriptionBlock
    );
  };

  return (
    <View style={[styles.container, containerStyles]}>
      <PetraImage
        uri={provider?.tokenImgSrc ?? ''}
        aspectRatio={1}
        rounded
        style={styles.defaultBackgroundColor}
      />

      <View style={styles.spacingTop}>
        <NFTHeader name={route.params.token.name ?? i18nmock('assets:nfts')} />
        {collectionData ? (
          <Cluster space={16} noWrap>
            <PetraImage
              uri={provider?.collectionImgSrc ?? ''}
              style={styles.defaultBackgroundColor}
              size={48}
              rounded
            />
            <View>
              <Typography color={customColors.navy[900]}>
                {i18nmock('assets:nftsDetail.description.fromCollection')}
              </Typography>
              <Typography weight="500">{nft.collection}</Typography>
            </View>
          </Cluster>
        ) : (
          <Typography variant="subheading">
            {i18nmock('assets:nftsDetail.description.title')}
          </Typography>
        )}
      </View>

      {renderDescription()}
    </View>
  );
}

export default NFTDescriptionSection;

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    width: '100%',
  },
  defaultBackgroundColor: {
    backgroundColor: customColors.navy['100'],
  },
  spacingTop: {
    marginTop: 16,
  },
});
