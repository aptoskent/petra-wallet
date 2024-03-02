// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { customColors } from '@petra/core/colors';
import makeStyles from 'core/utils/makeStyles';
import { testProps } from 'e2e/config/testProps';
import { TouchableOpacity } from 'react-native';
import { HIT_SLOPS } from 'shared';
import { SettingsGearIconSVG } from 'shared/assets/svgs';

interface PetraSettingsButtonProps {
  onPress?: () => void;
}

function PetraSettingsButton({
  onPress,
}: PetraSettingsButtonProps): JSX.Element {
  const styles = useStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={HIT_SLOPS.smallSlop}
      style={styles.gearButtonContainer}
      {...testProps('button-settings')}
    >
      <SettingsGearIconSVG color={customColors.navy['800']} />
    </TouchableOpacity>
  );
}

export default PetraSettingsButton;

const useStyles = makeStyles(() => ({
  gearButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
}));
