// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useTheme } from 'core/providers/ThemeProvider';
import makeStyles from 'core/utils/makeStyles';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { HIT_SLOPS } from 'shared';
import { InfoCircleEmptyIconSVG } from 'shared/assets/svgs';
import { PADDING } from 'shared/constants';

interface StakingFAQButtonProps {
  onPress?: () => void;
}

export default function StakingFAQButton({ onPress }: StakingFAQButtonProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={HIT_SLOPS.smallSlop}
      style={styles.container}
    >
      <InfoCircleEmptyIconSVG color={theme.typography.primary} />
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    paddingRight: PADDING.container,
  },
}));
