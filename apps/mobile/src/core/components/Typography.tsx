// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors, parseColor } from '@petra/core/colors';
import React, { PropsWithChildren } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

type TypographyVariants =
  | 'display'
  | 'heading'
  | 'subheading'
  | 'bodyLarge'
  | 'body'
  | 'small'
  | 'xsmall';

type TypographyWeight = '400' | '500' | '600' | '700' | '800' | '900';

export interface TypographyProps extends PropsWithChildren, TextProps {
  align?: 'center' | 'left' | 'right';
  color?: string;
  marginTop?: boolean | number;
  underline?: boolean;
  variant?: TypographyVariants;
  weight?: TypographyWeight;
}

function getWeight(weight: TypographyWeight) {
  switch (weight) {
    case '500':
      return 'WorkSans-Medium';
    case '600':
      return 'WorkSans-SemiBold';
    case '700':
    case '800':
      return 'WorkSans-Bold';
    case '900':
      return 'WorkSans-ExtraBold';
    case '400':
    default:
      return 'WorkSans-Regular';
  }
}

export default function Typography({
  align,
  children,
  color = customColors.navy['900'],
  marginTop,
  style,
  underline,
  variant = 'body',
  weight,
  ...props
}: TypographyProps): JSX.Element {
  const styles: Record<TypographyVariants, TextStyle> = {
    body: {
      fontFamily: getWeight('400'),
      fontSize: 16,
      lineHeight: 24,
    },
    bodyLarge: {
      fontFamily: getWeight('600'),
      fontSize: 18,
      lineHeight: 27,
    },
    display: {
      fontFamily: getWeight('800'),
      fontSize: 30,
      lineHeight: 30,
    },
    heading: {
      fontFamily: getWeight('600'),
      fontSize: 24,
      lineHeight: 27,
    },
    small: {
      fontFamily: getWeight('400'),
      fontSize: 14,
      lineHeight: 22,
    },
    subheading: {
      fontFamily: getWeight('500'),
      fontSize: 20,
      lineHeight: 21,
    },
    xsmall: {
      fontFamily: getWeight('400'),
      fontSize: 12,
      lineHeight: 18,
    },
  };

  const currentStyle = styles[variant];

  return (
    <Text
      style={[
        currentStyle,
        !!align && { textAlign: align, width: '100%' },
        !!underline && { textDecorationLine: 'underline' },
        { color: parseColor(color) },
        !!weight && { fontFamily: getWeight(weight) },
        !!marginTop && {
          marginTop:
            typeof marginTop === 'boolean'
              ? 0.5 * (currentStyle.fontSize ?? 16)
              : marginTop,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
