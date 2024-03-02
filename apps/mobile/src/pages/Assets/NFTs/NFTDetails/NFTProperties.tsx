// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TokenData } from '@petra/core/types';
import Typography from 'core/components/Typography';
import { i18nmock } from 'strings';
import Cluster from 'core/components/Layouts/Cluster';
import { customColors } from '@petra/core/colors';
import InfoPill from 'core/components/InfoPill';

interface NFTPropertiesProps {
  containerStyles?: ViewStyle;
  nft: TokenData;
}

function NFTProperties({ containerStyles, nft }: NFTPropertiesProps) {
  const properties = Object.entries((nft as any).tokenProperties || {});

  return (
    <View style={[styles.container, containerStyles]}>
      <Typography variant="bodyLarge" color={customColors.navy[900]}>
        {i18nmock('assets:nftsDetail.properties.title')}
      </Typography>

      {properties.length ? (
        <Cluster space={8} style={styles.spacingTop}>
          {properties.map(([key, value]) => (
            <InfoPill
              title={key}
              value={value as any}
              key={`${key}-${value}`}
            />
          ))}
        </Cluster>
      ) : (
        <InfoPill style={styles.spacingTop}>
          <Typography align="center" color={customColors.navy['700']}>
            {i18nmock('assets:nftsDetail.properties.empty')}
          </Typography>
        </InfoPill>
      )}
    </View>
  );
}

export default NFTProperties;

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  spacingTop: {
    marginTop: 16,
  },
});
