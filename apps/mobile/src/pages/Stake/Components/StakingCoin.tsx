// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StakingFacet, StakingFacetProps } from './StakingFacet';
import { useFormatApt } from '../utils/useFormatApt';

type CoinRenderType = 'usd' | 'coin';

export interface StakingCoinProps
  extends Omit<
    StakingFacetProps,
    'title' | 'subtitle' | 'renderBottomSheetContent'
  > {
  amount: string;
  decimals?: number;
  subtitleType?: CoinRenderType;
  titleType?: CoinRenderType;
}
export function StakingCoin({
  amount,
  decimals,
  subtitleType,
  titleType,
  ...props
}: StakingCoinProps) {
  const { coin, usd } = useFormatApt(amount, decimals);

  let title;
  if (titleType === 'coin') title = coin;
  if (titleType === 'usd') title = `${usd}`;

  let subtitle;
  if (subtitleType === 'coin') subtitle = coin;
  if (subtitleType === 'usd') subtitle = `${usd}`;

  return (
    <StakingFacet {...props} title={title || ''} subtitle={subtitle || ''} />
  );
}
