// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { customColors } from '@petra/core/colors';
import { addressDisplay } from 'shared';
import Clipboard from '@react-native-clipboard/clipboard';
import { i18nmock } from 'strings';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import { AptosIdentity } from '@petra/core/activity';
import addressTextFromIdentity from 'pages/Activity/util';
import { GestureResponderEvent, StyleProp, TextStyle } from 'react-native';
import Typography, { TypographyProps } from './Typography';

interface PetraAddressProps {
  address: string | AptosIdentity;
  bold?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
  underline?: boolean;
  variant?: TypographyProps['variant'];
}

export default function PetraAddress({
  address,
  color = customColors.navy['700'],
  bold = false,
  variant = 'body',
  underline = true,
  style,
}: PetraAddressProps): JSX.Element {
  const { showSuccessToast } = usePetraToastContext();

  const isIdentity = typeof address !== 'string';
  const sanitizedAddress = isIdentity ? address.address : address;

  const onPress = useCallback(
    (e: GestureResponderEvent) => {
      e.preventDefault();
      Clipboard.setString(sanitizedAddress);
      showSuccessToast({
        hideOnPress: true,
        text: i18nmock('assets:toast.copyAddress'),
        toastPosition: 'bottomWithButton',
      });
    },
    [sanitizedAddress, showSuccessToast],
  );

  return (
    <Typography
      style={style}
      variant={variant}
      underline={underline}
      weight={bold ? '600' : '400'}
      color={color}
      onPress={onPress}
      accessible
      role="button"
      accessibilityLabel={i18nmock('a11y:copyAddress')}
    >
      {isIdentity
        ? addressTextFromIdentity(address)
        : addressDisplay(sanitizedAddress, false)}
    </Typography>
  );
}
