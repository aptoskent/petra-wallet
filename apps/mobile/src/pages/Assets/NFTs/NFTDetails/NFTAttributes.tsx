// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { MetadataJson } from '@petra/core/types';
import Typography from 'core/components/Typography';
import { i18nmock } from 'strings';
import Cluster from 'core/components/Layouts/Cluster';
import { customColors } from '@petra/core/colors';
import InfoPill from 'core/components/InfoPill';

interface NFTAttributesProps {
  containerStyles?: ViewStyle;
  metadata: MetadataJson | undefined;
}

export default function NFTAttributes({
  containerStyles,
  metadata,
}: NFTAttributesProps) {
  const attributes = metadata?.attributes ?? [];

  return (
    <View style={[styles.container, containerStyles]}>
      <Typography variant="bodyLarge" color={customColors.navy[900]}>
        {i18nmock('assets:nftsDetail.attributes.title')}
      </Typography>

      {attributes.length ? (
        <Cluster space={8} style={styles.spacingTop}>
          {attributes.map((attribute) => (
            <InfoPill
              title={attribute.trait_type}
              value={attribute.value}
              key={`${attribute.trait_type}-${attribute.value}`}
            />
          ))}
        </Cluster>
      ) : (
        <InfoPill style={styles.spacingTop}>
          <Typography align="center" color={customColors.navy['700']}>
            {i18nmock('assets:nftsDetail.attributes.empty')}
          </Typography>
        </InfoPill>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    width: '100%',
  },
  spacingTop: {
    marginTop: 16,
  },
});
