// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Image, View } from 'react-native';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import Typography from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import { APTOS_COIN_INFO, PADDING } from 'shared/constants';
import { i18nmock } from 'strings';
import { useTheme } from 'core/providers/ThemeProvider';
import Cluster from 'core/components/Layouts/Cluster';
import { stakingIntro } from 'shared/assets/images';
import useCoinBalance from 'core/hooks/useCoinBalance';
import { MINIMUM_APT_FOR_STAKE, OCTA } from '@petra/core/constants';

interface FirstTimeStakeSheetContentProps {
  onContinue: () => void;
  onNavigateToBuy: () => void;
  onReadMore: () => void;
}

export default function FirstTimeStakeSheetContent({
  onContinue,
  onNavigateToBuy,
  onReadMore,
}: FirstTimeStakeSheetContentProps): JSX.Element {
  const balance = useCoinBalance(APTOS_COIN_INFO.type);
  const { theme } = useTheme();
  const styles = useStyles();

  const hasEnoughToStake = Number(balance) / OCTA > MINIMUM_APT_FOR_STAKE;

  return (
    <View style={[styles.container, styles.spacingMedium]}>
      <Image source={stakingIntro} style={{ height: 140, width: 140 }} />

      <Typography
        align="center"
        variant="subheading"
        style={styles.spacingLarge}
      >
        {i18nmock('stake:firstTimeStakeSheet.title')}
      </Typography>

      <Typography variant="display" align="center" style={styles.spacingSmall}>
        7%
      </Typography>

      <Typography align="center" color={theme.typography.primaryDisabled}>
        {i18nmock('stake:firstTimeStakeSheet.subtitle')}
      </Typography>

      <Typography
        variant="small"
        align="center"
        color={theme.typography.primaryDisabled}
        style={styles.spacingMedium}
      >
        {i18nmock('stake:firstTimeStakeSheet.fineText1')}
      </Typography>

      <Typography
        variant="small"
        align="center"
        color={theme.typography.primaryDisabled}
        style={styles.spacingSmall}
      >
        {i18nmock('stake:firstTimeStakeSheet.fineText2')}
      </Typography>

      <Typography
        variant="small"
        align="center"
        color={theme.typography.primaryDisabled}
        style={styles.spacingSmall}
      >
        {i18nmock('stake:firstTimeStakeSheet.fineText3')}
      </Typography>

      <Cluster noWrap space={8} style={styles.spacingMedium}>
        <PetraPillButton
          onPress={onReadMore}
          buttonDesign={PillButtonDesign.clearWithDarkText}
          text={i18nmock('stake:firstTimeStakeSheet.learnMore')}
          containerStyleOverride={styles.button}
        />
        {hasEnoughToStake ? (
          <PetraPillButton
            onPress={onContinue}
            buttonDesign={PillButtonDesign.default}
            text={i18nmock('general:continue')}
            containerStyleOverride={styles.button}
          />
        ) : (
          <PetraPillButton
            onPress={onNavigateToBuy}
            buttonDesign={PillButtonDesign.default}
            text={i18nmock('assets:buy')}
            containerStyleOverride={styles.button}
          />
        )}
      </Cluster>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  button: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: PADDING.container,
  },
  spacingLarge: {
    marginTop: 32,
  },
  spacingMedium: {
    marginTop: 24,
  },
  spacingSmall: {
    marginTop: PADDING.container,
  },
}));
