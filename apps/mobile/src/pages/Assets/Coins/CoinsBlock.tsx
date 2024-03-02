// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { i18nmock } from 'strings';
import GenericBlock from 'pages/Assets/GenericBlock';
import { RootAuthenticatedStackParamList } from 'navigation/types';
import useCoinDisplay from 'pages/Assets/useCoinDisplay';
import { RawCoinInfoWithLogo } from 'pages/Assets/shared';
import { useTheme } from 'core/providers/ThemeProvider';
import Typography from 'core/components/Typography';
import { CoinsBlockLoaders } from 'core/components/loaders/AssetsLoaders';

interface CoinsBlockProps {
  handleNavigateToCoinDetails: (coin: string) => void;
  handleNavigation: (
    routeName: keyof RootAuthenticatedStackParamList,
    options?: any,
  ) => void;
}

export default function CoinsBlock({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleNavigateToCoinDetails,
  handleNavigation,
}: CoinsBlockProps): JSX.Element {
  const { theme } = useTheme();
  const { allCoins, handleRenderCoin, isLoading, totalCoins } =
    useCoinDisplay();
  const handleOnTopBarPress = () => {
    handleNavigation('CoinsList');
  };

  const handleCoinPress = () => {
    handleNavigation('CoinsList');
  };

  const renderTotal = () => (
    <Typography
      variant="small"
      color={theme.typography.primaryDisabled}
    >{`${totalCoins} ${i18nmock('assets:total')}`}</Typography>
  );

  return (
    <GenericBlock
      renderUpperRight={renderTotal}
      handleOnTopBarPress={handleOnTopBarPress}
      headingText={i18nmock('assets:coins')}
    >
      {isLoading ? (
        <CoinsBlockLoaders />
      ) : (
        allCoins
          .slice(0, 3)
          .map(
            (coin: RawCoinInfoWithLogo): JSX.Element =>
              handleRenderCoin(coin, handleCoinPress),
          )
      )}
    </GenericBlock>
  );
}
