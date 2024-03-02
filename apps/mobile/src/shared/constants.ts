// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */
// octodecimal values are hex values with 2 appended values for the opacity
// reference: https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4

import { customColors } from '@petra/core/colors';
import { CoinInfoData } from '@petra/core/types';
import { Dimensions } from 'react-native';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

// @TODO - Links should be shared between the apps - but they also need to be localized (probably)
export const ANS_LINK = 'https://www.aptosnames.com';
export const PETRA_LINK = 'https://www.petra.app';
export const PETRA_FAQ_LINK = 'https://www.petra.app/faq';
export const PLAYSTORE_LINK =
  'https://play.google.com/store/apps/details?id=com.aptoslabs.petra.wallet';
export const APPSTORE_LINK =
  'https://apps.apple.com/us/app/petra-wallet/id6446259840';

export const HELP_SUPPORT_LINK = 'https://discord.com/invite/petrawallet';

export const StorageKeys = {
  dappHistory: 'dappExploreHistoryStorageKey',
  firstTimeStaking: 'firstTimeStaking',
};

/**
 * from aptos-labs/explorer/src/pages/DelegatoryValidator/constants.ts
 */
export const MINIMUM_APT_IN_POOL_FOR_WALLET = 11;
export const MINIMUM_APT_IN_POOL = 10;
export const OCTA = 100000000;
export const MINIMUM_APT_IN_POOL_IN_OCTA = MINIMUM_APT_IN_POOL * OCTA;

export const APTOS_COIN_TYPE = '0x1::aptos_coin::AptosCoin';
export const APTOS_SYMBOL = 'APT';
export const APTOS_COIN_INFO: CoinInfoData = {
  type: APTOS_COIN_TYPE,
  name: 'Aptos Coin',
  symbol: APTOS_SYMBOL,
  decimals: 8,
};

export const HIT_SLOPS = {
  midSlop: {
    bottom: 20,
    left: 20,
    right: 20,
    top: 20,
  },
  sloppy: {
    bottom: 50,
    left: 50,
    right: 50,
    top: 50,
  },
  smallSlop: {
    bottom: 10,
    left: 10,
    right: 10,
    top: 10,
  },
};

export const HEADER_HEIGHT = 44;

// This constant is to distingish if we are using a device with a small screen based on height. If the
// screen is short it would typically need to have smaller components or srollable components.
export const isShortScreen = windowHeight < 700;

export const PADDING = {
  container: 16,
  topography: 4,
};

export const DROP_SHADOW = {
  default: {
    shadowColor: customColors.black,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  card: {
    shadowColor: customColors.black,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.08,
    shadowRadius: 50,
    elevation: 3,
  },
  cardMinimal: {
    shadowColor: customColors.black,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
};

export const TOP_Z_INDEX = 9999;
