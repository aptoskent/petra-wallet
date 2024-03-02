// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTheme } from 'core/providers/ThemeProvider';
import Typography, { TypographyProps } from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import { DROP_SHADOW, PADDING } from 'shared/constants';
import { collapseHexString } from '@petra/core/utils/hex';
import { i18nmock } from 'strings';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import useSteadyRefresh from 'core/hooks/useSteadyRefresh';
import { useDelegationPool } from '@petra/core/queries/staking/useDelegationPool';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import useStakeTransaction from '@petra/core/queries/staking/useStakeTransaction';
import { StakeOperation } from '@petra/core/queries/staking/types';
import useInterval from '@petra/core/hooks/useInterval';
import { StakeStates } from '@petra/core/queries/useStaking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import fullDate from '@petra/core/utils/date';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { stakingEvents } from '@petra/core/utils/analytics/events';
import timeUntilFormatted from '../../../util/timeUntilFormatted';
import { StakingRow } from '../Components/StakingRow';
import { StakingFacet } from '../Components/StakingFacet';
import { StakingLabel } from '../Components/StakingLabel';
import { StakingAmountRow } from '../Components/StakingAmountRow';
import { StakingCoin } from '../Components/StakingCoin';

function StakingDetailsCountdown({
  lockedUntilTimestamp,
  state,
  ...props
}: TypographyProps & {
  lockedUntilTimestamp?: number | null;
  state: StakeStates;
}): JSX.Element {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();

  useInterval(
    useCallback(() => {
      if (state === 'withdrawReady') {
        setMessage(
          i18nmock('stake:stakesDetails.withdrawHelperTextAvailableNow'),
        );
      }

      if (state === 'withdrawPending') {
        const countdown = timeUntilFormatted(lockedUntilTimestamp || 0);
        if (countdown) {
          setMessage(
            i18nmock('stake:stakesDetails.withdrawHelperText').replace(
              '{DURATION}',
              countdown,
            ),
          );
        }
      }
    }, [lockedUntilTimestamp, state]),
    1000,
  );

  return (
    <Typography
      variant="xsmall"
      align="center"
      color={theme.typography.primaryDisabled}
      {...props}
    >
      {message}
    </Typography>
  );
}

const stateToOperation: Record<StakeStates, StakeOperation> = {
  active: StakeOperation.UNLOCK,
  withdrawPending: StakeOperation.WITHDRAW,
  withdrawReady: StakeOperation.WITHDRAW,
};

type StakingDetailsProps =
  RootAuthenticatedStackScreenProps<'StakeFlowStakingDetails'>;

interface PillButtonProps {
  buttonDesign: PillButtonDesign;
  onPress: () => void;
  text: string;
}

export default function StakingDetails({
  navigation,
  route,
}: StakingDetailsProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { stake, state } = route.params;
  const delegationPoolQuery = useDelegationPool(stake.poolAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSteadyRefreshing, steadyRefresh] = useSteadyRefresh(() =>
    Promise.all([delegationPoolQuery.refetch()]),
  );
  const { trackEvent } = useTrackEvent();

  const stakeAmount = useMemo(() => {
    switch (state) {
      case 'active':
        return stake.active;
      case 'withdrawPending':
        return stake.withdrawPending;
      case 'withdrawReady':
        return stake.withdrawReady;
      default:
        return '';
    }
  }, [state, stake]);

  const totalRewards = useMemo(() => {
    switch (state) {
      case 'active':
        return stake.totalRewards.active;
      case 'withdrawPending':
        return stake.totalRewards.pendingWithdraw;
      default:
        return 0;
    }
  }, [stake, state]);

  const { error, isLoading, submitTransaction } = useStakeTransaction({
    address: delegationPoolQuery.data?.validator.owner_address || '',
    amount: stakeAmount.toString(),
    operation: stateToOperation[route.params.state],
  });

  const onWithdrawPress = useCallback(async () => {
    try {
      if (error) throw new Error(error);

      setIsSubmitting(true);
      const txn = await submitTransaction();
      void trackEvent({
        eventType: stakingEvents.WITHDRAW_SUCCESS,
        params: {
          txnHash: txn.hash,
        },
      });
      navigation.navigate('StakeFlowTerminal', {
        amount: stakeAmount.toString(),
        type: 'withdraw-success',
      });
    } catch (e: any) {
      void trackEvent({
        eventType: stakingEvents.WITHDRAW_ERROR,
      });
      navigation.navigate('StakeFlowTerminal', {
        message: e?.message,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [submitTransaction, navigation, stakeAmount, error, trackEvent]);

  const buttonProps = useMemo<PillButtonProps | null>(() => {
    if (!delegationPoolQuery.data) return null;

    switch (state) {
      case 'active':
        return {
          buttonDesign: PillButtonDesign.clearWithDarkText,
          onPress: () => {
            if (!delegationPoolQuery.data) return;

            navigation.navigate('StakeFlowEnterUnstakeAmount', {
              address: delegationPoolQuery.data.validator.owner_address,
              lockedUntilTimestamp:
                delegationPoolQuery.data.delegationPool.lockedUntilTimestamp ??
                0,
              stake,
            });
          },
          text: i18nmock('stake:stakesDetails.unstake'),
        };
      case 'withdrawPending':
        return {
          buttonDesign: PillButtonDesign.clearWithDarkText,
          disabled: true,
          onPress: () => null,
          text: i18nmock('stake:stakesDetails.withdraw'),
        };
      case 'withdrawReady':
        return {
          buttonDesign: PillButtonDesign.default,
          disabled: isLoading || isSubmitting,
          isLoading: isLoading || isSubmitting,
          onPress: onWithdrawPress,
          text: i18nmock('stake:stakesDetails.withdraw'),
        };
      default:
        return null;
    }
  }, [
    delegationPoolQuery.data,
    state,
    isLoading,
    isSubmitting,
    onWithdrawPress,
    navigation,
    stake,
  ]);

  if (delegationPoolQuery.isLoading) {
    return (
      <View style={[styles.body, { justifyContent: 'center' }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (delegationPoolQuery.isError || !delegationPoolQuery.data) {
    return (
      <View
        style={[
          styles.body,
          { alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        <Typography variant="bodyLarge">
          {i18nmock('stake:stakes.errorMessage')}
        </Typography>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isSteadyRefreshing}
            onRefresh={steadyRefresh}
          />
        }
      >
        <View style={styles.body}>
          <View style={styles.card}>
            <StakingAmountRow
              label={collapseHexString(
                delegationPoolQuery.data.validator.owner_address,
                8,
              )}
              aptAmount={stakeAmount}
            />
            {!!totalRewards && (
              <StakingRow marginTop={32}>
                <StakingLabel
                  title="stake:stakesDetails.totalRewards"
                  titleBold
                  titleColor="primary"
                />
                <StakingCoin
                  amount={totalRewards.toString()}
                  align="right"
                  titleType="coin"
                  titleBold
                  titleColor="primary"
                  subtitleType="usd"
                  subtitleColor="green"
                />
              </StakingRow>
            )}
          </View>
          <StakingRow marginTop={16}>
            <StakingLabel
              title="stake:stakesDetails.rewardRate"
              titleSize="small"
              flexPriority
              term={{
                definition: 'stake:stakesDetails.stakingRewardInfo',
                title: 'stake:stakesDetails.rewardRate',
              }}
            />
            <StakingFacet
              align="right"
              bold
              color="primary"
              title={`${(
                delegationPoolQuery.data.delegationPool.rewardsRate * 100
              ).toFixed(0)}%`}
            />
          </StakingRow>
          <StakingRow>
            <StakingLabel
              title="stake:stakesDetails.performanceRate"
              titleSize="small"
              flexPriority
              term={{
                definition: 'stake:stakesDetails.validatorPerformanceRateInfo',
                title: 'stake:stakesDetails.performanceRate',
              }}
            />
            <StakingFacet
              align="right"
              bold
              color="primary"
              title={`${delegationPoolQuery.data.validator.rewards_growth}%`}
            />
          </StakingRow>
          <StakingRow>
            <StakingLabel
              title="stake:stakesDetails.commissionRate"
              titleSize="small"
              flexPriority
              term={{
                definition: 'stake:stakesDetails.validatorCommissionRateInfo',
                title: 'stake:stakesDetails.commissionRate',
              }}
            />
            <StakingFacet
              align="right"
              bold
              color="primary"
              title={`${delegationPoolQuery.data.delegationPool.commission}%`}
            />
          </StakingRow>
          <StakingRow>
            <StakingLabel
              title="stake:stakesDetails.operatorAddress"
              titleSize="small"
              flexPriority
              term={{
                definition: 'stake:stakesDetails.operatorAddressInfo',
                title: 'stake:stakesDetails.operatorAddress',
              }}
            />
            <StakingFacet
              align="right"
              bold
              flexPriority
              color="primary"
              title={collapseHexString(
                delegationPoolQuery.data.validator.operator_address,
                8,
              )}
            />
          </StakingRow>
          <StakingRow>
            <StakingLabel
              title="stake:stakesDetails.withdrawalAvailable"
              titleSize="small"
              flexPriority
              term={{
                definition:
                  'stake:confirmStake.terms.withdrawlAvailable.definition',
                title: 'stake:confirmStake.terms.withdrawlAvailable.title',
              }}
            />
            <StakingFacet
              align="right"
              bold
              flexPriority
              color="primary"
              title={fullDate(
                delegationPoolQuery.data.delegationPool.lockedUntilTimestamp ??
                  '',
              )}
            />
          </StakingRow>
        </View>
      </ScrollView>
      {buttonProps ? (
        <View
          style={[
            styles.buttonRow,
            {
              paddingBottom: Math.max(insets.bottom, PADDING.container),
            },
          ]}
        >
          <PetraPillButton {...buttonProps} />
          <StakingDetailsCountdown
            state={state}
            lockedUntilTimestamp={
              delegationPoolQuery.data.delegationPool.lockedUntilTimestamp
            }
          />
        </View>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    gap: 20,
    padding: 4,
    paddingBottom: 40,
    paddingTop: 40,
  },
  buttonRow: {
    backgroundColor: theme.background.secondary,
    gap: 8,
    justifyContent: 'center',
    padding: PADDING.container,
  },
  card: {
    backgroundColor: theme.background.secondary,
    borderRadius: 10,
    padding: PADDING.container,
    ...DROP_SHADOW.cardMinimal,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    paddingHorizontal: PADDING.container,
  },
}));
