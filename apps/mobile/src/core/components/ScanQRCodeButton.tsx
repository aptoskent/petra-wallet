// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { customColors } from '@petra/core/colors';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import QRCodeIconSVG from 'shared/assets/svgs/qr_code_icon';

export default function ScanQrCodeButton(props: TouchableOpacityProps) {
  const navigation = useNavigation();
  const navigateToScanner = () => {
    navigation.navigate('Scanner');
  };
  return (
    <TouchableOpacity onPress={navigateToScanner} {...props}>
      <QRCodeIconSVG color={customColors.navy['900']} />
    </TouchableOpacity>
  );
}
