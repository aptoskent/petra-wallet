// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  MetadataJson,
  MetadataJsonCreator,
  TokenData,
} from '@petra/core/types';
import Typography from 'core/components/Typography';
import { i18nmock } from 'strings';
import { customColors } from '@petra/core/colors';
import Cluster from 'core/components/Layouts/Cluster';
import PetraAddress from 'core/components/PetraAddress';
import ExternalLinkIconSVG from 'shared/assets/svgs/external_link_icon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useTokenAcquiredDate from '@petra/core/hooks/useTokenAcquiredDate';
import useTokenStorageProvider from '@petra/core/hooks/useTokenStorageProvider';
import { useWebViewPopover } from 'core/providers/WebViewPopoverProvider';

interface NFTDescriptionProps {
  containerStyles?: ViewStyle;
  metadata: MetadataJson | undefined;
  nft: TokenData;
}

function NFTDetailSection({
  containerStyles,
  metadata,
  nft,
}: NFTDescriptionProps) {
  const acquiredDate = useTokenAcquiredDate(nft);
  const { provider, tokenImgSrc } = useTokenStorageProvider(nft);
  const { openUri } = useWebViewPopover();

  const creators = metadata?.properties?.creators?.map(
    (c: MetadataJsonCreator) => c.address,
  ) ?? [nft.creator];

  const viewOnText = i18nmock('assets:nftsDetail.detail.viewOnProvider');

  return (
    <View style={[styles.container, containerStyles]}>
      <Typography variant="bodyLarge" color={customColors.navy[900]}>
        {i18nmock('assets:nftsDetail.detail.title')}
      </Typography>

      {!!acquiredDate && (
        <Typography
          style={styles.spacingTopSmall}
          color={customColors.navy[900]}
        >
          {i18nmock('assets:nftsDetail.detail.acquiredOn')}{' '}
          {acquiredDate.toLocaleString()}
        </Typography>
      )}

      <Cluster align="flex-end" style={styles.spacingTopSmall}>
        <Typography color={customColors.navy[900]}>
          {i18nmock('assets:nftsDetail.detail.createdBy')}{' '}
        </Typography>
        {creators.map((creator) => (
          <PetraAddress address={creator} key={creator} />
        ))}
      </Cluster>

      {tokenImgSrc ? (
        <TouchableOpacity
          onPress={() => {
            openUri({ title: nft.name, uri: tokenImgSrc });
          }}
        >
          <Cluster align="center" style={styles.spacingTopSmall} space={6}>
            <Typography underline color={customColors.navy[900]}>
              {`${viewOnText} ${provider}`}
            </Typography>
            <ExternalLinkIconSVG color={customColors.navy[900]} size={12} />
          </Cluster>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default NFTDetailSection;

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  spacingTop: {
    marginTop: 16,
  },
  spacingTopSmall: {
    marginTop: 8,
  },
});
