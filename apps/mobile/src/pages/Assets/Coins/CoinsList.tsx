// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { i18nmock } from 'strings';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import ListViewEmptyState from 'pages/Assets/Shared/ListViewEmptyState';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import { RawCoinInfoWithLogo } from 'pages/Assets/shared';
import useCoinDisplay from 'pages/Assets/useCoinDisplay';
import makeStyles from 'core/utils/makeStyles';
import { tokenEmpty } from 'shared/assets/images';

type CoinsListProps = RootAuthenticatedStackScreenProps<'CoinsList'>;

export default function CoinsList({ navigation }: CoinsListProps) {
  const styles = useStyles();
  const { allCoins, handleRenderCoin, totalCoins } = useCoinDisplay();

  const handleOnPressBuy = () => {
    navigation.popToTop();
    navigation.navigate('Buy');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleNavigateToDetails = (coinType: string) => {
    navigation.navigate('CoinDetails', { coinType });
  };

  const renderYesCoinsState = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {allCoins.map((coin: RawCoinInfoWithLogo) => handleRenderCoin(coin))}
    </ScrollView>
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bottomButton: JSX.Element = (
    <PetraPillButton
      buttonDesign={PillButtonDesign.default}
      onPress={handleOnPressBuy}
      text={i18nmock('assets:buyApt')}
    />
  );

  const renderNoCoinsState = () => (
    <ListViewEmptyState
      headingText={i18nmock('assets:noCoinsYet.title')}
      subText={i18nmock('assets:noCoinsYet.subtext')}
      svgComponent={<Image source={tokenEmpty} />}
    />
  );

  return (
    <View style={styles.container}>
      {totalCoins === 0 ? renderNoCoinsState() : renderYesCoinsState()}
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    marginTop: 20,
  },
}));
