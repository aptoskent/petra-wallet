// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { customColors } from '@petra/core/colors';
import { TokenData } from '@petra/core/types';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import PetraImage from 'core/components/PetraImage';
import Typography from 'core/components/Typography';
import { nftSpacing } from 'pages/Assets/shared';

interface NFTListItemProps {
  handleNavigateToDetails: (obj: TokenData) => void;
  nftContainerWidth?: number;
  resource: TokenData;
  showName?: boolean;
}

export default function NFTListItem({
  handleNavigateToDetails,
  nftContainerWidth,
  resource,
  showName,
}: NFTListItemProps): JSX.Element | null {
  const { data: tokenMetadata } = useTokenMetadata(resource);
  const imageSource =
    tokenMetadata?.animation_url || tokenMetadata?.image || '';

  const nftContainerWidthStyle = nftContainerWidth
    ? {
        height: nftContainerWidth,
        width: nftContainerWidth,
      }
    : null;
  const containerViewStyle = nftContainerWidth
    ? {
        marginBottom: 8,
        marginHorizontal: nftSpacing,
      }
    : null;

  return (
    <View style={containerViewStyle}>
      <TouchableOpacity
        style={nftContainerWidthStyle}
        onPress={() => handleNavigateToDetails(resource)}
      >
        <PetraImage
          uri={imageSource}
          aspectRatio={1}
          rounded
          style={{ backgroundColor: customColors.navy['100'] }}
        />

        {(resource?.amount ?? 0) > 1 && (
          <View style={styles.countContainer}>
            <Typography variant="small">{resource.amount}</Typography>
          </View>
        )}

        {!!showName && (
          <Typography weight="600" numberOfLines={1} style={styles.spacingTop}>
            {resource.name}
          </Typography>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  countContainer: {
    backgroundColor: customColors.green[100],
    borderRadius: 4,
    padding: 2,
    paddingHorizontal: 8,
    position: 'absolute',
    right: 8,
    top: 8,
  },
  spacingTop: {
    marginTop: 8,
  },
});

interface NFTTListItemWrapperProps extends React.PropsWithChildren {
  index: number;
  listLength: number;
  spacing: number;
  spacingBottom?: number;
}

export function NFTTListItemWrapper({
  children,
  index,
  listLength,
  spacing,
  spacingBottom = spacing,
}: NFTTListItemWrapperProps) {
  // Orphans don't have an extra element to their right that
  // provides two extra buffers of margin, adjust to keep spacing
  const hasOrphan = listLength % 2 === 1;
  const isOrphan = hasOrphan && index === listLength - 1;
  const orphanMarginModifier = isOrphan ? 3 : 1;

  return (
    <View
      style={{
        flex: 1 / 2,
        margin: spacing,
        marginBottom: spacingBottom,
        marginRight: spacing * orphanMarginModifier,
      }}
    >
      {children}
    </View>
  );
}
