// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { aptosCoinStructTag } from '@petra/core/constants';
import { CoinAvatar } from 'core/components';
import PetraImage from 'core/components/PetraImage';
import { RawCoinInfoWithLogo } from 'pages/Assets/shared';
import React from 'react';
import { TetherCoinSVG, USDCoinSVG } from 'shared/assets/svgs';
import AptosLogoSVG from 'shared/assets/svgs/aptos_logo';
import { CoinInfoWithMetadata } from '../hooks/useAccountCoinResources';

export interface CoinIconProps {
  coin: CoinInfoWithMetadata | RawCoinInfoWithLogo;
  size?: number;
}

export default function CoinIcon({ coin, size = 48 }: CoinIconProps) {
  const { type } = coin;

  // Extract the logoUrl from the coin object
  let logoUrl: string | undefined;
  if ('metadata' in coin) logoUrl = coin.metadata?.logoUrl;
  else if ('logoUrl' in coin) logoUrl = coin.logoUrl;

  if (type === aptosCoinStructTag) {
    return <AptosLogoSVG size={size} color={customColors.black} />;
  }
  if (type === '0x1::coin::TetherCoin') {
    return <TetherCoinSVG size={size} />;
  }
  if (type === '0x1::coin::USDCoin') {
    return <USDCoinSVG size={size} />;
  }

  if (logoUrl === undefined) {
    return <CoinAvatar size={size} accountAddress={type ?? ''} />;
  }

  return <PetraImage size={size} uri={logoUrl} />;
}
