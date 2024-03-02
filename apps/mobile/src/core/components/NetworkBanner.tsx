// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { customColors } from '@petra/core/colors';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import makeStyles from 'core/utils/makeStyles';
import {
  Alert,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useMutation } from 'react-query';
import DotIconSVG from 'shared/assets/svgs/dot_icon';
import ExchangeHorizontalIcon from 'shared/assets/svgs/exchange_horizontal_icon.svg';
import { i18nmock } from 'strings';
import { usePetraNavigationContext } from 'core/providers/NavigationChangeProvider';
import Typography from './Typography';

export const BANNER_HEIGHT = 40;

interface NetworkBannerProps {
  style?: StyleProp<ViewStyle>;
}

const sendFlowRouteNames: Set<string> = new Set([
  // send coin
  'SendFlow1',
  'SendFlow2',
  'SendFlow3',
  'SendFlow4',
]);

const stakingRouteNames: Set<string> = new Set([
  // staking
  'StakeFlowStaking',
  'StakeFlowStakingDetails',
  'StakeFlowEnterUnstakeAmount',
  'StakeFlowTerminal',
  'StakeFlowFAQ',
  'StakeFlowConfirmStake',
  'StakeFlowSelectPool',
  'StakeFlowEnterAmount',
]);

const unswitchableRouteNames: Set<string> = new Set([
  ...sendFlowRouteNames,
  ...stakingRouteNames,
]);
function NetworkBanner({ style }: NetworkBannerProps): JSX.Element | null {
  const { activeNetworkName, switchNetwork } = useNetworks();
  const { showSuccessToast } = usePetraToastContext();
  const { handleResetRoot, routeName } = usePetraNavigationContext();
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: switchNetwork,
    mutationKey: 'switchNetwork',
  });
  const styles = useStyles();

  const isUnswitchable = unswitchableRouteNames.has(routeName);

  const handleSwitchToMainnet = async () => {
    await mutateAsync('Mainnet');
    showSuccessToast({
      text: i18nmock('general:networkBanner.successToast'),
      toastPosition: 'bottom',
    });
  };

  const action = useMemo(() => {
    if (sendFlowRouteNames.has(routeName)) {
      return 'Send';
    }
    if (stakingRouteNames.has(routeName)) {
      return 'Stake';
    }

    return '';
  }, [routeName]);

  const actionPresentTense = useMemo(() => {
    if (sendFlowRouteNames.has(routeName)) {
      return 'Sending';
    }
    if (stakingRouteNames.has(routeName)) {
      return 'Staking';
    }

    return '';
  }, [routeName]);

  const handleOnPressSwitchToMainnet = async () => {
    if (isUnswitchable) {
      Alert.alert(
        i18nmock('general:networkBanner.unswitchableAlert.title').replaceAll(
          '{{ACTION}}',
          `${actionPresentTense}`,
        ),
        i18nmock('general:networkBanner.unswitchableAlert.body').replaceAll(
          '{{ACTION}}',
          action,
        ),
        [
          {
            onPress: () => {}, // do nothing,
            style: 'cancel',
            text: i18nmock(
              'general:networkBanner.unswitchableAlert.continueOnTestnet',
            ).replaceAll('{{ACTION}}', action),
          },
          {
            onPress: () => {
              handleResetRoot();
              void handleSwitchToMainnet();
            },
            style: 'destructive',
            text: i18nmock(
              'general:networkBanner.unswitchableAlert.exitOption',
            ).replaceAll('{{ACTION}}', action),
          },
        ],
        {
          cancelable: true,
        },
      );
    } else {
      void handleSwitchToMainnet();
    }
  };

  const bannerSwitchTextColor = isUnswitchable
    ? customColors.navy['500']
    : customColors.navy['900'];

  return (
    <View style={[styles.bannerContainer, style]}>
      <View style={styles.leftItem}>
        <DotIconSVG color={customColors.green['500']} />
        <Typography variant="body" weight="600">
          {activeNetworkName}
        </Typography>
      </View>
      <TouchableOpacity
        style={styles.rightItem}
        onPress={handleOnPressSwitchToMainnet}
        disabled={isLoading}
      >
        <Typography variant="small" weight="600" color={bannerSwitchTextColor}>
          {isLoading
            ? i18nmock('general:networkBanner.action.loading')
            : i18nmock('general:networkBanner.action.text')}
        </Typography>
        <ExchangeHorizontalIcon color={bannerSwitchTextColor} />
      </TouchableOpacity>
    </View>
  );
}

export default NetworkBanner;

const useStyles = makeStyles(() => ({
  bannerContainer: {
    alignItems: 'center',
    backgroundColor: customColors.navy['50'],
    flexDirection: 'row',
    height: BANNER_HEIGHT,
    paddingHorizontal: 16,
    width: '100%',
  },
  leftItem: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  rightItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
}));
