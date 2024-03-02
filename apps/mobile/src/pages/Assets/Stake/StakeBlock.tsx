// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { TouchableOpacity } from 'react-native';
import makeStyles from 'core/utils/makeStyles';
import Typography from 'core/components/Typography';
import { PADDING } from 'shared/constants';
import Cluster from 'core/components/Layouts/Cluster';
import { customColors } from '@petra/core/colors';
import { PetraPillButton } from 'core/components';
import { Stake, UseStakingReturnType } from '@petra/core/queries/useStaking';
import { fullDate } from '@petra/core/utils/date';
import { TotalStakedIcon } from 'shared/assets/svgs';
import { i18nmock } from 'strings';
import { useTheme } from 'core/providers/ThemeProvider';
import useFormatApt from 'pages/Stake/utils/useFormatApt';
import StakingAmountRow from 'pages/Stake/Components/StakingAmountRow';
import GenericBlock from '../GenericBlock';

interface StakeBlockProps {
  onStakingPress: () => void;
  onWithdrawPress: (stake: Stake) => void;
  stakes: UseStakingReturnType;
}

export default function StakeBlock({
  onStakingPress,
  onWithdrawPress,
  stakes,
}: StakeBlockProps): JSX.Element | null {
  const styles = useStyles();
  const { theme } = useTheme();
  const readyToWithdrawTotal = useFormatApt(
    stakes.totals.withdrawReady.toString(),
    1,
  );

  if (!stakes.total) return null;

  const stakeCounts = stakes.stakes.reduce(
    (acc, stake) => {
      let { active, pending, ready } = acc;
      if (stake.active) active += 1;
      if (stake.withdrawReady) ready += 1;
      if (stake.withdrawPending) pending += 1;
      return { active, pending, ready };
    },
    { active: 0, pending: 0, ready: 0 },
  );

  const renderNumberOfActiveStakes = () => {
    const numberOfActive = stakeCounts.active;
    const totalStakes =
      stakeCounts.active + stakeCounts.ready + stakeCounts.pending;

    const of = i18nmock('general:of');
    const active = i18nmock('stake:homeScreenStakeCard.active');
    const numberOfActiveStakesText = `${numberOfActive} ${of} ${totalStakes} ${active}`;

    return (
      <Typography variant="small" color={theme.typography.primaryDisabled}>
        {numberOfActiveStakesText}
      </Typography>
    );
  };

  const renderTotalStaked = () => (
    <TouchableOpacity onPress={onStakingPress}>
      <StakingAmountRow
        aptAmount={stakes.total.toString() ?? '0'}
        label={i18nmock('stake:homeScreenStakeCard.totalStaked')}
        Icon={() => <TotalStakedIcon />}
        style={{ marginVertical: 24 }}
      />
    </TouchableOpacity>
  );

  const renderPendingWithdrawCard = () => {
    const earliestPendingStake = stakes.stakes
      .filter((s) => s.withdrawPending)
      .sort((a, b) => Number(a.lockedUntil || 0) - Number(b.lockedUntil || 0))
      .shift();

    const unlockDate = earliestPendingStake?.lockedUntil
      ? fullDate(earliestPendingStake.lockedUntil)
      : null;

    let pendingWithdrawText: string | null = null;
    if (stakeCounts.pending === 1) {
      pendingWithdrawText = i18nmock(
        'stake:homeScreenStakeCard.pendingWithdraw.singular',
      ).replace('{DATE}', unlockDate);
    }
    if (stakeCounts.pending > 1) {
      pendingWithdrawText = i18nmock(
        'stake:homeScreenStakeCard.pendingWithdraw.plural',
      )
        .replace('{COUNT}', stakeCounts.pending)
        .replace('{DATE}', unlockDate);
    }

    if (!pendingWithdrawText) return null;

    return (
      <TouchableOpacity style={styles.innerCard} onPress={onStakingPress}>
        <Typography>{pendingWithdrawText}</Typography>
      </TouchableOpacity>
    );
  };

  const renderReadyToWithdrawCard = () => {
    const earliestReadyWithdrawal = stakes.stakes.find((s) => s.withdrawReady);
    const showWithdrawButton = Boolean(
      stakeCounts.ready === 1 && earliestReadyWithdrawal,
    );

    let readyToWithdrawText: string | null = null;
    if (stakeCounts.ready === 1) {
      readyToWithdrawText = i18nmock(
        'stake:homeScreenStakeCard.readyToWithdraw.singular',
      );
    }
    if (stakeCounts.ready > 1) {
      readyToWithdrawText = i18nmock(
        'stake:homeScreenStakeCard.readyToWithdraw.plural',
      ).replace('{COUNT}', stakeCounts.ready);
    }

    if (!readyToWithdrawText) return null;

    return (
      <TouchableOpacity
        disabled={showWithdrawButton}
        style={styles.innerCard}
        onPress={onStakingPress}
      >
        <Typography>{readyToWithdrawText}</Typography>
        <Cluster space={4} style={{ marginTop: PADDING.container }}>
          <Typography weight="600">{readyToWithdrawTotal.coin}</Typography>
          <Typography>{readyToWithdrawTotal.usd}</Typography>
        </Cluster>

        {showWithdrawButton ? (
          <PetraPillButton
            text={i18nmock('stake:homeScreenStakeCard.withdraw')}
            onPress={() => {
              onWithdrawPress(earliestReadyWithdrawal!);
            }}
            containerStyleOverride={{ marginTop: PADDING.container }}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <GenericBlock
      handleOnTopBarPress={onStakingPress}
      headingText={i18nmock('stake:homeScreenStakeCard.title')}
      renderUpperRight={renderNumberOfActiveStakes}
    >
      {renderTotalStaked()}
      {renderPendingWithdrawCard()}
      {renderReadyToWithdrawCard()}
    </GenericBlock>
  );
}

const useStyles = makeStyles(() => ({
  innerCard: {
    backgroundColor: customColors.orange[100],
    borderRadius: 8,
    marginBottom: 8,
    padding: PADDING.container,
  },
}));
