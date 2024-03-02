// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import makeStyles from 'core/utils/makeStyles';
import Typography from 'core/components/Typography';
import { APTOS_COIN_INFO, DROP_SHADOW, OCTA, PADDING } from 'shared/constants';
import { i18nmock } from 'strings';
import { customColors } from '@petra/core/colors';
import Cluster from 'core/components/Layouts/Cluster';
import { StakingFirstTimeIcon } from 'shared/assets/svgs';
import useCoinBalance from 'core/hooks/useCoinBalance';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { stakingEvents } from '@petra/core/utils/analytics/events';
import { MINIMUM_APT_FOR_STAKE } from '@petra/core/constants';

interface StakeBannerProps {
  onPress: () => void;
}

export default function StakeBanner({
  onPress,
}: StakeBannerProps): JSX.Element {
  const styles = useStyles();
  const balance = useCoinBalance(APTOS_COIN_INFO.type);
  const { trackEvent } = useTrackEvent();

  const handleOnPress = () => {
    if (balance) {
      void trackEvent({
        eventType: stakingEvents.VIEW_STAKING_TERM,
        params: {
          hasMinimumToStake: Number(balance) / OCTA > MINIMUM_APT_FOR_STAKE,
          stakingScreen: 'first time stake banner',
        },
      });
    }

    onPress();
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View style={styles.container}>
        <Cluster noWrap space={8} justify="space-between" align="flex-start">
          <View style={{ flex: 1, flexShrink: 1 }}>
            <Typography variant="bodyLarge" weight="600">
              {i18nmock('assets:stakeFlow.firstTimeBanner.title')}
            </Typography>
            <Typography variant="small" marginTop>
              {i18nmock('assets:stakeFlow.firstTimeBanner.description')}
            </Typography>
          </View>

          <StakingFirstTimeIcon />
        </Cluster>
      </View>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: customColors.green[100],
    borderRadius: 12,
    flex: 1,
    marginHorizontal: PADDING.container,
    marginVertical: 8,
    minHeight: 80,
    padding: PADDING.container,
    ...DROP_SHADOW.cardMinimal,
  },
}));
