// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  ViewStyle,
  TouchableOpacity,
  RefreshControl,
  StyleProp,
} from 'react-native';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useSteadyRefresh from 'core/hooks/useSteadyRefresh';
import { collapseHexString } from '@petra/core/utils/hex';
import Typography, { TypographyProps } from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import { customColors } from '@petra/core/colors';
import { PADDING, DROP_SHADOW, APTOS_COIN_INFO } from 'shared/constants';
import { useTheme } from 'core/providers/ThemeProvider';
import { i18nmock } from 'strings';
import {
  useStaking,
  Stake as StakeTyped,
  StakeStates,
} from '@petra/core/queries/useStaking';
import { ValidatorStatus } from '@petra/core/queries/staking/types';
import {
  ChevronDownIconSVG,
  ChevronUpIconSVG,
  DotIconSVG,
  AlertOctagonFillIconSVG,
  TotalStakedIcon,
} from 'shared/assets/svgs';
import Cluster from 'core/components/Layouts/Cluster';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useCoinBalance from 'core/hooks/useCoinBalance';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { stakingEvents } from '@petra/core/utils/analytics/events';
import { MINIMUM_APT_FOR_STAKE, OCTA } from '@petra/core/constants';
import { StakingCoin } from '../Components/StakingCoin';
import { StakingAmountRow } from '../Components/StakingAmountRow';

interface StakingCardProps {
  aptAmount: number;
  isStakeActive: boolean;
  label: string;
  stakeState?: StakeStates;
  style?: StyleProp<ViewStyle>;
  validatorStatus: ValidatorStatus;
}

function StakingCard({
  aptAmount,
  isStakeActive,
  label,
  stakeState,
  style,
  validatorStatus,
}: StakingCardProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={[styles.stakingCard, style]}>
      <Cluster
        noWrap
        justify="space-between"
        align="center"
        space={12}
        padding={4}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.stakingBlockRow}>
            <Typography variant="body" weight="600" style={{ flex: 1 }}>
              {label}
            </Typography>
          </View>
          <StakingCoin
            align="left"
            color="primary"
            amount={`${aptAmount}`}
            titleColor="muted"
            titleType="coin"
          />
        </View>
        <StakingCoin
          align="right"
          bold
          color="primary"
          amount={`${aptAmount}`}
          titleColor="primary"
          titleType="usd"
        />
      </Cluster>
      {isStakeActive &&
        stakeState === 'active' &&
        validatorStatus === ValidatorStatus.inactive && (
          <Cluster
            space={8}
            padding={16}
            justify="space-between"
            align="flex-start"
            style={styles.cautionContainer}
          >
            <AlertOctagonFillIconSVG color={customColors.error} />
            <View style={{ flex: 1 }}>
              <Typography
                color={theme.typography.primary}
                weight="600"
                variant="small"
              >
                {i18nmock('stake:stakes.attention')}
              </Typography>
              <Typography color={theme.typography.primary} variant="xsmall">
                {i18nmock('stake:stakes.attentionMessage')}
              </Typography>
            </View>
          </Cluster>
        )}
    </View>
  );
}

interface StakingSectionProps {
  getAmount: (stake: StakeTyped) => number;
  heading: string;
  headingRightIcon?: JSX.Element;
  headingStyles: TypographyProps;
  stakeState: StakeStates;
  stakes: StakeTyped[];
  subHeading: string;
}

function StakingSection({
  getAmount,
  heading,
  headingRightIcon,
  headingStyles,
  stakeState,
  stakes,
  subHeading,
}: StakingSectionProps) {
  const styles = useStyles();
  const navigation = useNavigation();
  const { theme } = useTheme();

  if (stakes.length === 0) {
    return null;
  }

  return (
    <View>
      <View style={{ marginBottom: 8 }}>
        <View style={styles.stakingSectionTitle}>
          <Typography {...headingStyles}>{heading}</Typography>
          {headingRightIcon}
        </View>
        <Typography color={theme.typography.primaryDisabled} variant="xsmall">
          {subHeading}
        </Typography>
      </View>
      <View style={styles.stakingList}>
        {stakes.map((stake: StakeTyped) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('StakeFlowStakingDetails', {
                stake,
                state: stakeState,
              })
            }
            key={stake.poolAddress}
          >
            <StakingCard
              aptAmount={getAmount(stake)}
              label={collapseHexString(stake.poolAddress, 8)}
              isStakeActive={stake.active !== 0}
              stakeState={stakeState}
              validatorStatus={stake.validatorStatus}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

type StakingProps = RootAuthenticatedStackScreenProps<'StakeFlowStaking'>;

export default function Staking({ navigation }: StakingProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { activeAccountAddress } = useActiveAccount();
  const [showPastWithdrawals, setShowPastWithdrawals] =
    useState<boolean>(false);

  const stakingQuery = useStaking({
    address: activeAccountAddress,
    options: {
      refetchOnMount: true,
    },
  });
  const [isSteadyRefreshing, steadyRefresh] = useSteadyRefresh(() =>
    Promise.all([stakingQuery.refetch()]),
  );

  const balance = useCoinBalance(APTOS_COIN_INFO.type);
  const { trackEvent } = useTrackEvent();

  const handleToggleShowPastWithdrawals = () => {
    setShowPastWithdrawals((isShown) => !isShown);
  };

  const handleNavigateToEnterAmount = () => {
    if (balance) {
      void trackEvent({
        eventType: stakingEvents.VIEW_STAKING_TERM,
        params: {
          hasMinimumToStake: Number(balance) / OCTA > MINIMUM_APT_FOR_STAKE,
          stakingScreen: 'first time stake banner',
        },
      });
    }
    navigation.push('StakeFlowEnterAmount');
  };

  if (stakingQuery.isLoading) {
    return (
      <View style={[styles.stakingBody, { justifyContent: 'center' }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (stakingQuery.isError || !stakingQuery.data) {
    return (
      <View
        style={[
          styles.stakingBody,
          { alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        <Typography variant="bodyLarge">
          {i18nmock('stake:stakes.errorMessage')}
        </Typography>
      </View>
    );
  }

  const stakesReadyToWithdraw = stakingQuery.data.stakes.filter(
    (s: StakeTyped) => s.withdrawReady !== 0,
  );

  const stakesActive = stakingQuery.data.stakes.filter(
    (s: StakeTyped) => s.active !== 0,
  );
  const stakesWithdrawPending = stakingQuery.data.stakes.filter(
    (s: StakeTyped) => s.withdrawPending !== 0,
  );

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
        <View style={styles.stakingBody}>
          <StakingAmountRow
            Icon={() => <TotalStakedIcon />}
            aptAmount={stakingQuery.data.total}
            label={i18nmock('stake:stakes.totalStaked')}
          />
          <StakingSection
            stakes={stakesReadyToWithdraw}
            heading={i18nmock('stake:stakes.readyToWithdraw')}
            subHeading={i18nmock('stake:stakes.readyToWithdrawSubheading')}
            headingRightIcon={<DotIconSVG color={customColors.salmon[400]} />}
            headingStyles={{
              color: customColors.salmon[400],
              variant: 'bodyLarge',
              weight: '600',
            }}
            getAmount={(stake: StakeTyped) => stake.withdrawReady}
            stakeState="withdrawReady"
          />
          <StakingSection
            stakes={stakesActive}
            heading={i18nmock('stake:stakes.activeStake')}
            headingStyles={{
              variant: 'bodyLarge',
              weight: '600',
            }}
            subHeading={i18nmock('stake:stakes.activeStakeSubheading')}
            getAmount={(stake: StakeTyped) => stake.active}
            stakeState="active"
          />
          <StakingSection
            stakes={stakesWithdrawPending}
            heading={i18nmock('stake:stakes.withdrawPending')}
            headingStyles={{
              variant: 'bodyLarge',
              weight: '600',
            }}
            subHeading={i18nmock('stake:stakes.withdrawPendingSubheading')}
            getAmount={(stake: StakeTyped) => stake.withdrawPending}
            stakeState="withdrawPending"
          />
          {/* temporarily hide this until we have data for it */}
          {false && (
            <TouchableOpacity
              style={{ flexDirection: 'row', gap: 4 }}
              onPress={handleToggleShowPastWithdrawals}
            >
              <Typography
                weight="600"
                variant="body"
                color={customColors.navy[600]}
              >
                {showPastWithdrawals
                  ? i18nmock('stake:stakes.hidePastWithdrawals')
                  : i18nmock('stake:stakes.showPastWithdrawals')}
              </Typography>
              {showPastWithdrawals ? (
                <ChevronUpIconSVG color={customColors.navy[600]} />
              ) : (
                <ChevronDownIconSVG color={customColors.navy[600]} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.buttonRow,
          {
            paddingBottom: Math.max(insets.bottom, PADDING.container),
          },
        ]}
      >
        <PetraPillButton
          text={i18nmock('stake:stakes.stakeCTA')}
          onPress={handleNavigateToEnterAmount}
          buttonDesign={PillButtonDesign.default}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  buttonRow: {
    backgroundColor: theme.background.secondary,
    gap: 8,
    justifyContent: 'center',
    padding: PADDING.container,
  },
  cautionContainer: {
    backgroundColor: customColors.salmon['50'],
    borderRadius: 8,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    paddingHorizontal: PADDING.container,
  },
  noData: {
    borderColor: customColors.navy[100],
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  stakingBlockRow: { flexDirection: 'row', width: '100%' },
  stakingBody: {
    flex: 1,
    gap: 36,
    padding: 4,
    paddingBottom: 40,
    paddingTop: 40,
  },
  stakingCard: {
    backgroundColor: theme.background.secondary,
    borderRadius: 10,
    gap: 8,
    padding: 16,
    ...DROP_SHADOW.cardMinimal,
  },
  stakingList: { gap: 12 },
  stakingSectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
}));
