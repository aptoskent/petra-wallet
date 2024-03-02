// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import Typography from 'core/components/Typography';
import {
  fiatDollarValueDisplay,
  fiatDollarValueExists,
  percentChangeDisplayRounded,
} from 'pages/Assets/Shared/utils';
import { RawCoinInfoWithLogo, coinBalanceDisplay } from 'pages/Assets/shared';
import CoinIcon from 'pages/Send/components/CoinIcon';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const coinIconDimensions = 44;

interface ExtraDisplayData {
  fiatDollarValue?: string;
  percentChange?: number;
  quantityDisplay?: string;
}

interface RowElementsProps {
  coin: RawCoinInfoWithLogo;
  extraData: ExtraDisplayData;
  handleNavigateToDetails?: (coinType: string) => void;
}

interface RowElementsLimitedProps {
  coin: RawCoinInfoWithLogo;
  handleOnPress?: (coinType: string) => void;
}

// CoinRow used for showing dollar value along with percent change in contrast
// to CoinRowLimited which shows name & quantity but no associated dollar value or percent change
export default function CoinRow({
  coin,
  extraData,
  handleNavigateToDetails,
}: RowElementsProps) {
  const { info } = coin;

  const { fiatDollarValue, percentChange, quantityDisplay } = extraData;

  const negPercentChange = (percentChange ?? 0) < 0;
  const percentChangeColor = negPercentChange
    ? customColors.navy['500']
    : customColors.green['500'];

  const showFiat = fiatDollarValueExists(fiatDollarValue);
  const showPercent =
    percentChange !== undefined && !Number.isNaN(percentChange);
  return (
    <TouchableOpacity
      style={styles.coinRow}
      disabled={!handleNavigateToDetails}
      onPress={() =>
        handleNavigateToDetails && handleNavigateToDetails(coin.type)
      }
    >
      <CoinIcon size={coinIconDimensions} coin={coin} />
      <View style={styles.coinContent}>
        <View style={styles.coinContentRow}>
          <Text style={styles.coinContentTopRowText}>{info.name}</Text>
          {showFiat ? (
            <Text style={styles.coinContentTopRowText}>
              {fiatDollarValueDisplay(fiatDollarValue ?? '')}
            </Text>
          ) : null}
        </View>
        <View style={styles.coinContentRow}>
          <Text numberOfLines={1} style={styles.coinContentBottomTextLeft}>
            {quantityDisplay}
          </Text>
          {showPercent ? (
            <Typography color={percentChangeColor}>
              {percentChangeDisplayRounded(negPercentChange, percentChange)}
            </Typography>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Coin Row that does not show associated dollar value & does not show percentChange
export function CoinRowLimited({
  coin,
  handleOnPress,
}: RowElementsLimitedProps) {
  const { info, type } = coin;
  const coinBalance = coinBalanceDisplay(coin);

  return (
    <TouchableOpacity
      style={styles.coinRow}
      disabled={!handleOnPress}
      onPress={() => handleOnPress && handleOnPress(type)}
    >
      <View style={styles.coinIconContainer}>
        <CoinIcon size={coinIconDimensions} coin={coin} />
      </View>
      <View style={styles.coinContent}>
        <View style={styles.coinContentRow}>
          <Text style={styles.coinContentTopRowText}>{info.name}</Text>
        </View>
        <View style={styles.coinContentRow}>
          <Text numberOfLines={1} style={styles.coinContentBottomTextLeft}>
            {coinBalance}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  coinContent: {
    flex: 1,
    paddingLeft: 16,
  },
  coinContentBottomTextLeft: {
    color: customColors.navy['500'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    lineHeight: 19,
    maxWidth: '70%',
  },
  coinContentBottomTextRight: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
    lineHeight: 19,
  },
  coinContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coinContentTopRowText: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  coinIconContainer: {
    height: coinIconDimensions,
    width: coinIconDimensions,
  },
  coinIconContainerNoIcon: {
    backgroundColor: customColors.navy['400'],
    borderRadius: Math.floor(coinIconDimensions / 2),
    height: coinIconDimensions,
    width: coinIconDimensions,
  },
  coinRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 80,
    width: '100%',
  },
});
