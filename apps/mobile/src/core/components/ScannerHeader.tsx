// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { customColors } from '@petra/core/colors';
import { useNavigation } from '@react-navigation/native';
import PetraBackButton from './PetraBackButton';
import Header from './Header';
import ScannerInfoButton from './ScannerInfoButton';

type ScannerHeaderProps = {
  color?: string;
  showInfo?: boolean;
};

export default function ScannerHeader({
  color = customColors.white,
  showInfo = true,
}: ScannerHeaderProps): JSX.Element {
  const navigation = useNavigation();
  return (
    <Header
      headerTransparent
      renderLeft={<PetraBackButton navigation={navigation} color={color} />}
      renderRight={showInfo ? <ScannerInfoButton /> : undefined}
    />
  );
}
