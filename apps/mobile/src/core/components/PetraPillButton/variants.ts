// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';

export enum PillButtonDesign {
  clearWithDarkText = 'clearWithDarkText',
  clearWithWhiteText = 'clearWithWhiteText',
  // salmon color with white text
  default = 'default',
  // green background + white text
  success = 'success',
}

export interface ButtonVariantStateStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export interface ButtonVariantStyle {
  default: ButtonVariantStateStyle;
  disabled?: ButtonVariantStateStyle;
  pressed?: ButtonVariantStateStyle;
}

export const variantStylesMap: Record<PillButtonDesign, ButtonVariantStyle> = {
  clearWithDarkText: {
    default: {
      backgroundColor: customColors.white,
      borderColor: customColors.navy['100'],
      textColor: customColors.navy['900'],
    },
    disabled: {
      backgroundColor: customColors.lightGray,
      borderColor: customColors.navy['200'],
      textColor: customColors.navy['300'],
    },
    pressed: {
      backgroundColor: customColors.navy['50'],
      borderColor: customColors.navy['100'],
      textColor: customColors.navy['900'],
    },
  },
  clearWithWhiteText: {
    default: {
      backgroundColor: 'transparent',
      borderColor: customColors.navy['100'],
      textColor: customColors.white,
    },
    disabled: {
      backgroundColor: 'transparent',
      borderColor: customColors.navy['400'],
      textColor: customColors.navy['300'],
    },
    pressed: {
      backgroundColor: customColors.whiteOpacity.fourPercent,
      borderColor: customColors.navy['100'],
      textColor: customColors.navy['50'],
    },
  },
  default: {
    default: {
      backgroundColor: customColors.salmon['500'],
      borderColor: customColors.salmon['500'],
      textColor: customColors.white,
    },
    disabled: {
      backgroundColor: customColors.salmon['100'],
      borderColor: customColors.salmon['100'],
      textColor: customColors.white,
    },
    pressed: {
      backgroundColor: customColors.salmon['600'],
      borderColor: customColors.salmon['600'],
      textColor: customColors.white,
    },
  },
  success: {
    default: {
      backgroundColor: customColors.green['500'],
      borderColor: customColors.green['500'],
      textColor: customColors.white,
    },
    disabled: {
      backgroundColor: customColors.green['300'],
      borderColor: customColors.green['300'],
      textColor: customColors.white,
    },
    pressed: {
      backgroundColor: customColors.green['600'],
      borderColor: customColors.green['600'],
      textColor: customColors.white,
    },
  },
};
