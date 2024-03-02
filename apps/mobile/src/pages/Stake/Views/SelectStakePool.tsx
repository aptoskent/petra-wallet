// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import React, { useEffect, useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import makeStyles from 'core/utils/makeStyles';
import { APTOS_COIN_INFO, DROP_SHADOW, PADDING } from 'shared/constants';
import { useDelegationPools } from '@petra/core/queries/staking/useDelegationPools';
import PetraAddress from 'core/components/PetraAddress';
import Cluster from 'core/components/Layouts/Cluster';
import { PetraStakingInfo } from '@petra/core/queries/staking/types';
import { formatAmount } from '@petra/core/utils/coin';
import { useTheme } from 'core/providers/ThemeProvider';
import useSteadyRefresh from 'core/hooks/useSteadyRefresh';
import getPossibleRewards from '@petra/core/queries/staking/getPossibleRewards';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { i18nmock } from 'strings';
import { customColors } from '@petra/core/colors';
import { SearchIconSVG, SortIcon } from 'shared/assets/svgs';
import { usePrompt } from 'core/providers/PromptProvider';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { useDynamicConfig, useFlag } from '@petra/core/flags';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { stakingEvents } from '@petra/core/utils/analytics/events';
import { StakingRow } from '../Components/StakingRow';
import PossibleRewardsSheetContent from '../Sheets/PossibleRewardsSheetContent';
import { StakingFacet } from '../Components/StakingFacet';
import { StakingLabel, StakingLabelProps } from '../Components/StakingLabel';
import { StakingCoin } from '../Components/StakingCoin';
import SortPoolsSheetContent, {
  SortOption,
} from '../Sheets/SortPoolsSheetContent';

interface FilterState {
  mode: 'advanced' | 'simple';
  search: string;
  showInactive: boolean;
  sort: SortOption;
}

const DEFAULT_SORT_OPTION = SortOption.projected;

function rewardsLessThanPercent(
  topRewardsPoolRewardAsFloat: number,
  amount: string,
  pool: PetraStakingInfo,
  percentGate: number,
): boolean {
  const rewardForPool: string = getPossibleRewards(amount, pool);
  const rewardForPoolAsFloat = parseFloat(rewardForPool);

  if (rewardForPoolAsFloat < topRewardsPoolRewardAsFloat * percentGate) {
    return false;
  }

  return true;
}

// remove pools that do not meet a percent of top rewards
function filterAndSortPoolsTopRewards(
  pools: PetraStakingInfo[],
  state: FilterState,
  amount: string,
  percentGate: number,
): PetraStakingInfo[] {
  if (pools.length === 0) {
    return [];
  }
  const sortedByPossibleRewards = pools
    .slice()
    .filter((pool) => {
      if (state.search) {
        return pool.validator.owner_address.includes(state.search);
      }

      return pool;
    })
    .sort(
      (a, b) =>
        Number(getPossibleRewards(amount, b)) -
        Number(getPossibleRewards(amount, a)),
    );
  const topRewardsPool: PetraStakingInfo = sortedByPossibleRewards[0];
  const topRewardsPoolReward: string = getPossibleRewards(
    amount,
    topRewardsPool,
  );
  const topRewardsPoolRewardAsFloat: number = parseFloat(topRewardsPoolReward);
  return sortedByPossibleRewards.filter((pool: PetraStakingInfo) =>
    rewardsLessThanPercent(
      topRewardsPoolRewardAsFloat,
      amount,
      pool,
      percentGate,
    ),
  );
}
function filterAndSortPools(
  pools: PetraStakingInfo[],
  state: FilterState,
  amount: string,
): PetraStakingInfo[] {
  if (pools.length === 0) {
    return [];
  }
  return pools
    .slice()
    .filter((pool) => {
      if (state.search) {
        return pool.validator.owner_address.includes(state.search);
      }

      return pool;
    })
    .sort((a, b) => {
      if (state.sort === SortOption.commission) {
        return a.delegationPool.commission - b.delegationPool.commission;
      }

      if (state.sort === SortOption.staked) {
        return (
          Number(b.delegationPool.delegatedStakeAmount) -
          Number(a.delegationPool.delegatedStakeAmount)
        );
      }

      if (state.sort === SortOption.lifetimeRewards) {
        return (
          Number(b.delegationPool.delegatedStakeAmount) -
          Number(a.delegationPool.delegatedStakeAmount)
        );
      }

      if (state.sort === SortOption.numDelegators) {
        return (
          b.delegationPool.numberOfDelegators -
          a.delegationPool.numberOfDelegators
        );
      }

      // Projected
      return (
        Number(getPossibleRewards(amount, b)) -
        Number(getPossibleRewards(amount, a))
      );
    });
}

interface StakeHeaderProps {
  onChange: (nextState: FilterState) => void;
  state: FilterState;
}

function StakeHeader({ onChange, state }: StakeHeaderProps) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { promptVisible, setPromptContent, setPromptVisible } = usePrompt();
  const [focused, setFocused] = React.useState(false);
  const { trackEvent } = useTrackEvent();

  function toggleSort() {
    setPromptVisible(!promptVisible);
  }

  function toggleMode() {
    void trackEvent({
      eventType: stakingEvents.ADVANCED_MODE_TOGGLED,
      params: {
        selectStakePoolMode: state.mode,
      },
    });

    onChange({
      ...state,
      mode: state.mode === 'advanced' ? 'simple' : 'advanced',
    });
  }

  function updateSearch(search: string) {
    onChange({ ...state, search });
  }

  const toggleInactiveValidators = () => {
    onChange({ ...state, showInactive: !state.showInactive });
  };

  useEffect(() => {
    setPromptContent(
      <SortPoolsSheetContent
        toggleInactiveValidators={toggleInactiveValidators}
        inactiveValidators={state.showInactive}
        sort={state.sort}
        onSort={(sort) => {
          setPromptVisible(false);
          onChange({ ...state, sort });
        }}
      />,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Cluster noWrap space={8} style={styles.padded}>
      <Cluster
        space={8}
        noWrap
        style={[styles.searchBar, focused ? styles.searchBarFocused : {}]}
      >
        <SearchIconSVG size={16} color="navy.400" />
        <TextInput
          style={styles.searchText}
          placeholderTextColor={theme.typography.primaryDisabled}
          placeholder={i18nmock('stake:selectPool.searchPlaceholder')}
          onChangeText={(text) => updateSearch(text)}
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically
          keyboardType="web-search"
          selectTextOnFocus
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Cluster>

      <PetraPillButton
        onPress={() => toggleMode()}
        buttonDesign={PillButtonDesign.clearWithDarkText}
        buttonStyleOverride={{ paddingHorizontal: 20 }}
        text={
          state.mode === 'advanced'
            ? i18nmock('stake:selectPool.simple')
            : i18nmock('stake:selectPool.advanced')
        }
      />

      {state.mode === 'advanced' ? (
        <PetraPillButton
          onPress={() => toggleSort()}
          buttonDesign={PillButtonDesign.clearWithDarkText}
          buttonStyleOverride={{ paddingHorizontal: 20 }}
          leftIcon={() => <SortIcon color={theme.typography.primary} />}
        />
      ) : null}
    </Cluster>
  );
}

function StakeCell({
  amount,
  info,
  mode,
  onPress,
}: {
  amount: string;
  info: PetraStakingInfo;
  mode: 'advanced' | 'simple';
  onPress: () => void;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  const possibleRewards = getPossibleRewards(amount, info);
  const formattedRewards = formatAmount(
    BigInt(possibleRewards),
    APTOS_COIN_INFO,
    { decimals: 8, prefix: false },
  );
  const rewardsColor: StakingLabelProps['color'] =
    possibleRewards === '0' ? 'error' : 'primary';

  const advanced = (
    <>
      <PetraAddress
        underline={false}
        bold
        address={info.validator.owner_address}
        style={{ marginBottom: 8 }}
      />

      <StakingRow marginTop>
        <StakingLabel
          flexPriority
          title="stake:stakesDetails.rewardRate"
          titleSize="small"
        />
        <StakingFacet
          title={`${(info.delegationPool.rewardsRate * 100).toFixed()}%`}
          titleSize="small"
          align="right"
        />
      </StakingRow>
      <StakingRow marginTop>
        <StakingLabel
          flexPriority
          title="stake:selectPool.advancedTable.commission"
          titleSize="small"
        />
        <StakingFacet
          title={`${info.delegationPool.commission}%`}
          titleSize="small"
          align="right"
        />
      </StakingRow>
      <StakingRow marginTop>
        <StakingLabel
          titleSize="small"
          title="stake:selectPool.advancedTable.performanceRate"
        />
        <StakingFacet
          align="right"
          titleSize="small"
          title={`${info.validator.rewards_growth}%`}
        />
      </StakingRow>
      <StakingRow marginTop>
        <StakingLabel
          titleSize="small"
          title="stake:selectPool.advancedTable.totalDelegatedAmount"
        />
        <StakingCoin
          align="right"
          titleSize="small"
          flexPriority
          titleType="coin"
          decimals={1}
          bold
          amount={info.delegationPool.delegatedStakeAmount}
        />
      </StakingRow>
      <StakingRow marginTop>
        <StakingLabel
          titleSize="small"
          title="stake:selectPool.advancedTable.totalDelegators"
        />
        <StakingFacet
          align="right"
          titleSize="small"
          title={`${info.delegationPool.numberOfDelegators ?? 0}`}
        />
      </StakingRow>
      <StakingRow marginTop>
        <StakingLabel
          titleSize="small"
          title="stake:selectPool.advancedTable.totalLifetimeRewards"
        />
        <StakingFacet
          align="right"
          titleSize="small"
          title={`${Number(info.validator.apt_rewards_distributed).toFixed(0)}`}
        />
      </StakingRow>
      <StakingRow marginTop>
        <StakingLabel
          titleSize="small"
          title="stake:selectPool.advancedTable.poolAddress"
        />
        <PetraAddress
          underline={false}
          color={theme.typography.primaryDisabled}
          address={info.validator.owner_address}
          variant="small"
        />
      </StakingRow>
      <StakingRow marginTop>
        <StakingLabel
          titleSize="small"
          title="stake:selectPool.advancedTable.monthlyRewards"
          subtitleSize="xsmall"
        />
        <StakingFacet
          align="right"
          color={rewardsColor}
          titleSize="small"
          flexPriority
          bold
          title={formattedRewards}
        />
      </StakingRow>
    </>
  );

  const simple = (
    <StakingRow>
      <PetraAddress
        address={info.validator.owner_address}
        bold
        underline={false}
      />
      <StakingCoin
        color={rewardsColor}
        amount={possibleRewards}
        titleType="coin"
        align="right"
      />
    </StakingRow>
  );

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.row}>{mode === 'advanced' ? advanced : simple}</View>
    </TouchableOpacity>
  );
}

type SelectStakePoolProps =
  RootAuthenticatedStackScreenProps<'StakeFlowSelectPool'>;

// eslint-disable-next-line no-empty-pattern
export default function SelectStakePool({
  navigation,
  route,
}: SelectStakePoolProps) {
  // adds ability to turn off low rank pools if we see they are being disproportionately selected
  const isLowRankGated = useFlag('low-rank-pools-gate');
  // threshold in the low-rank-pools-percent also needs to be set once the low-rank-pools-gate is
  // turned on.
  // to show only validators that are within 15% of the top validator rewards, set `threshold: 0.85`
  // to show only validators that are within 40% of the top validator rewards, set `threshold: 0.6`
  // to show only validators that are within 80% of the top validator rewards, set `threshold: 0.2`
  // as of July 21 - 7 validators, 1 is zero rewards (ignore).  The bottom validator is 94% that of
  // the top validator - a feature gate of 0.93 => validators within 7% of top, would show all 6
  // validators leaving out the zero rewards validator
  const lowRankPayload = useDynamicConfig('low-rank-pools-percent');
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { trackEvent } = useTrackEvent();

  const [state, setState] = React.useState<FilterState>({
    mode: 'simple',
    search: '',
    showInactive: false,
    sort: DEFAULT_SORT_OPTION,
  });

  const poolRes = useDelegationPools({ includeInactive: state.showInactive });

  const poolData = useMemo(() => {
    let sortedPools: PetraStakingInfo[] = filterAndSortPools(
      poolRes.data ?? [],
      state,
      route.params.amount,
    );

    if (isLowRankGated) {
      const percent: number =
        lowRankPayload?.value == null ? 0 : lowRankPayload?.value?.threshold;
      // do additional sorting if we have to turn the LowRankGate on
      sortedPools = filterAndSortPoolsTopRewards(
        sortedPools ?? [],
        state,
        route.params.amount,
        percent,
      );
    }
    return sortedPools;
  }, [
    poolRes,
    isLowRankGated,
    state,
    route.params.amount,
    lowRankPayload?.value,
  ]);

  const [isSteadyRefreshing, steadyRefresh] = useSteadyRefresh(() =>
    Promise.all([poolRes.refetch()]),
  );

  useEffect(() => {
    poolRes.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.showInactive]);

  function handleSelectPool(pool: PetraStakingInfo) {
    const orderedByProjectedPools = filterAndSortPools(
      poolRes.data ?? [],
      {
        mode: 'simple',
        search: '',
        showInactive: false,
        sort: SortOption.projected,
      },
      route.params.amount,
    );

    const rankOfValidator = orderedByProjectedPools.findIndex(
      (p: PetraStakingInfo) =>
        p.validator.operator_address === pool.validator.operator_address,
    );
    // track metric for which was the best deal
    void trackEvent({
      eventType: stakingEvents.STAKE_POOL_SELECTED,
      params: {
        // add plus one so it's not array indeces
        validatorSelectionRank: rankOfValidator + 1,
        validatorTotalOptions: orderedByProjectedPools?.length ?? 0,
      },
    });

    navigation.push('StakeFlowConfirmStake', {
      amount: route.params.amount,
      info: pool,
    });
  }

  const renderPossibleRewardsSheet = () => (
    <PossibleRewardsSheetContent amount={route.params.amount} />
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isSteadyRefreshing || poolRes.isLoading}
          onRefresh={steadyRefresh}
        />
      }
    >
      <StakeHeader state={state} onChange={setState} />

      {state.mode === 'simple' ? (
        <View style={styles.padded}>
          <StakingRow>
            <StakingLabel
              bold
              title="stake:selectPool.simpleTable.validatorColumnTitle"
            />
            <StakingFacet
              align="right"
              title={i18nmock(
                'stake:selectPool.simpleTable.rewardsColumnTitle',
              )}
              titleBold
              subtitle={i18nmock(
                'stake:selectPool.simpleTable.rewardsColumnSubtitle',
              )}
              subtitleSize="xsmall"
              renderBottomSheetContent={renderPossibleRewardsSheet}
            />
          </StakingRow>
        </View>
      ) : null}

      {poolData.map((info) => (
        <StakeCell
          info={info}
          key={info.validator.owner_address}
          onPress={() => handleSelectPool(info)}
          mode={state.mode}
          amount={route.params.amount}
        />
      ))}
    </ScrollView>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
  },
  padded: {
    padding: PADDING.container,
  },
  row: {
    backgroundColor: theme.background.tertiary,
    borderRadius: 8,
    marginBottom: PADDING.container,
    marginHorizontal: PADDING.container,
    padding: PADDING.container,
    ...DROP_SHADOW.cardMinimal,
  },
  searchBar: {
    backgroundColor: customColors.navy['50'],
    borderColor: 'transparent',
    borderRadius: 50,
    borderWidth: 1,
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOpacity: 0,
  },
  searchBarFocused: {
    borderColor: customColors.navy['900'],
  },
  searchText: {
    color: theme.typography.primary,
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    padding: 0,
  },
}));
