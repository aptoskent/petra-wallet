// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export const customColors = {
  black: '#000000',
  blackOpacity: {
    fiftyPercent: '#00000080',
    tenPercent: '#0000001A',
    thirtyPercent: '#0000004D',
    twentyPercent: '#00000033',
  },
  error: '#BC2626',
  errorTenPercent: '#cc00001A',
  green: {
    100: '#D8EEEC',
    200: '#B8E0DD',
    300: '#95D0CC',
    400: '#70C0BA',
    50: '#EDF9F8',
    500: '#4EB1AA',
    600: '#49A69F',
    700: '#3E8E88',
    800: '#306E69',
    900: '#214B47',
  },
  greenOpacity: {
    green500TenPercent: '#50C2BB1A',
  },
  lightGray: '#f5f5f5',
  navy: {
    100: '#DEE1E3',
    200: '#C2C7CC',
    300: '#B7BCBD',
    400: '#A1A9AF',
    50: '#F1F2F3',
    500: '#828C95',
    600: '#4d5c6d',
    700: '#324459',
    800: '#172B45',
    // primary
    900: '#1C2B43',
  },
  navyOpacity: {
    navy900ThirtyPercent: '#172B454D',
  },
  orange: {
    100: '#FDF4E7',
    200: '#FCEBD4',
    300: '#F9D4A4',
    400: '#F6BE74',
    50: '#FEF8F1',
    500: '#F3A845',
    600: '#F09114',
    700: '#D18B00',
    750: '#DA7B00',
    800: '#9E6900',
    900: '#306E69',
  },
  purple: {
    500: '#C798D6',
  },
  red: {
    100: '#f2d4d4',
    500: '#BC2626',
  },
  salmon: {
    100: '#FFBDBD',
    200: '#FF9E9E',
    300: '#FF8A8A',
    400: '#FF7575',
    50: '#FFF0F0',
    // primary
    500: '#FF5F5F',
    600: '#E15656',
    700: '#953232',
    800: '#6F2525',
    900: '#491818',
  },
  tan: {
    100: '#F9F9F6',
    400: '#DFE0DB',
    50: '#FBFBF9',
  },
  teal: {
    100: '#00CCCC',
  },
  white: '#ffffff',
  whiteOpacity: {
    fourPercent: '#ffffff10',
  },
};

export const avatarColors = [
  customColors.salmon['500'],
  customColors.purple['500'],
  customColors.green['200'],
  customColors.green['600'],
  customColors.navy['900'],
];

export function parseColor(color: string | undefined) {
  if (color === undefined) {
    return undefined;
  }
  const [name, value] = color.split('.');
  const palette: { [key: string]: string } = (customColors as any)[name];
  return palette && palette[value] ? palette[value] : color;
}

// Text

export const textColor = {
  dark: 'white',
  light: 'black',
};

export const secondaryAddressFontColor = {
  dark: 'gray.400',
  light: 'gray.500',
};

export const secondaryTextColor = {
  dark: 'gray.400',
  light: 'gray.500',
};

export const secondaryErrorMessageColor = {
  dark: 'red.200',
  light: 'red.500',
};

export const zeroStateHeadingColor = {
  dark: 'navy.200',
  light: 'navy.700',
};

export const zeroStateTextColor = {
  dark: 'navy.400',
  light: 'navy.500',
};

// Background

export const checkCircleSuccessBg = {
  dark: customColors.green[500],
  light: customColors.green[500],
};

export const mainBgColor = {
  dark: 'gray.900',
  light: 'navy.900',
};

export const newExtensionBgColor = {
  dark: 'gray.800',
  light: 'navy.900',
};

export const passwordBgColor = {
  dark: 'gray.800',
  light: 'navy.700',
};

export const secondaryBgColor = {
  dark: 'gray.900',
  light: 'white',
};

export const checkedBgColor = {
  dark: 'navy.800',
  light: 'navy.100',
};

export const accountViewBgColor = {
  dark: 'gray.600',
  light: 'gray.200',
};

export const secondaryBorderColor = {
  dark: 'whiteAlpha.200',
  light: 'blackAlpha.200',
};

export const secondaryLightBorderColor = {
  dark: 'whiteAlpha.300',
  light: 'blackAlpha.50',
};

export const secondaryMediumBorderColor = {
  dark: 'whiteAlpha.300',
  light: 'blackAlpha.300',
};

export const buttonBorderColor = {
  dark: 'gray.700',
  light: 'gray.200',
};

export const mnemonicBorderColor = {
  dark: 'gray.700',
  light: 'white',
};

export const secondaryHeaderInputBgColor = {
  dark: 'gray.700',
  light: 'gray.100',
};

export const secondaryHeaderBgColor = {
  dark: 'gray.700',
  light: 'gray.200',
};

export const secondaryHoverBgColor = {
  dark: 'gray.700',
  light: 'gray.200',
};

export const secondaryBackButtonBgColor = {
  dark: 'gray.600',
  light: 'gray.100',
};

export const secondaryGridHoverBgColor = {
  dark: 'gray.600',
  light: 'gray.200',
};

export const secondaryGridBgColor = {
  dark: 'gray.700',
  light: 'gray.100',
};

export const secondaryDisabledNetworkBgColor = {
  dark: 'gray.500',
  light: 'gray.50',
};

export const networkListItemSecondaryBorderColor = {
  dark: 'navy.700',
  light: 'navy.200',
};

export const primaryTextColor = {
  dark: 'white',
  light: 'navy.800',
};

export const negativeAmountColor = 'red.500';
export const positiveAmountColor = 'green.500';

// Other

export const secondaryDividerColor = {
  dark: 'whiteAlpha.300',
  light: 'gray.200',
};

export const secondaryWalletHomeCardBgColor = {
  dark: 'gray.800',
  light: 'gray.50',
};

export const iconBgColor = {
  dark: 'gray.700',
  light: 'gray.100',
};

export const iconColor = {
  dark: 'white',
  light: 'gray.600',
};

export const permissionRequestLayoutBgColor = {
  dark: 'gray.900',
  light: 'white',
};

export const permissionRequestBgColor = {
  dark: 'gray.900',
  light: 'rgb(247, 247, 247)',
};

export const permissionRequestTileBgColor = {
  dark: '#2e3038',
  light: 'white',
};

export const permissionRequestLoadingOverlayColor = {
  dark: '#2e3038b5',
  light: '#ffffffb5',
};

// Wallet

export const assetSecondaryBgColor = {
  dark: 'gray.800',
  light: 'gray.100',
};

export const assetSecondaryHoverBGColor = {
  dark: 'gray.700',
  light: '#F9FBFF',
};

export const secondaryButtonBgColor = {
  dark: 'gray.800',
  light: 'white',
};

export const disabledButtonBgColor = {
  dark: 'gray.800',
  light: 'gray.100',
};

export const searchInputBackground = {
  dark: 'navy.800',
  light: 'navy.100',
};

export const stepBorderColor = {
  dark: customColors.navy[100],
  light: customColors.navy[900],
};

export const bgColorButtonPopup = {
  dark: 'gray.800',
  light: 'white',
};

export const textColorPrimary = {
  dark: 'navy.200',
  light: 'navy.700',
};

export const textColorSecondary = {
  dark: 'navy.400',
  light: 'navy.600',
};

export const borderColor = {
  dark: 'navy.700',
  light: 'navy.300',
};

export const tokenBgColor = {
  dark: 'gray.800',
  light: 'navy.100',
};

export const tokenDetailsTextColor = {
  dark: 'navy.100',
  light: 'navy.900',
};

export const storageIconColor = {
  dark: 'white',
  light: 'navy.900',
};

export const secondaryAttributeColor = {
  dark: 'gray.200',
  light: 'gray.600',
};
