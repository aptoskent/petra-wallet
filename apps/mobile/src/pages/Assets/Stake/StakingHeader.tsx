// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { i18nmock } from 'strings';
import { customColors } from '@petra/core/colors';
import { CloseIconSVG } from 'shared/assets/svgs';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import Header from 'core/components/Header';
import Typography from 'core/components/Typography';

type StakingHeaderProps = RootAuthenticatedStackScreenProps<'StakeFlowStaking'>;

export default function StakingHeader({
  navigation,
}: NativeStackScreenProps<StakingHeaderProps>): JSX.Element {
  return (
    <Header
      renderRight={
        <TouchableOpacity onPress={() => navigation.popToTop()}>
          <CloseIconSVG color={customColors.navy[600]} />
        </TouchableOpacity>
      }
      renderLeft={
        <Typography variant="heading" weight="900">
          {i18nmock('stake:stakes.title')}
        </Typography>
      }
    />
  );
}
