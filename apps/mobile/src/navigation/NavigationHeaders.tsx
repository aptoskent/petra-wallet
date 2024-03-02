// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { CoinsListHeader, NFTsListHeader, StakingHeader } from 'pages/Assets';

export const coinListHeader = (navigation: any, route: any) => (
  <CoinsListHeader navigation={navigation} route={route} />
);

export const stakingHeader = (navigation: any, route: any) => (
  <StakingHeader navigation={navigation} route={route} />
);

export const nftListHeader = (navigation: any, route: any) => (
  <NFTsListHeader
    goBack={navigation.goBack}
    isNames={route.params?.isNames ?? false}
  />
);
