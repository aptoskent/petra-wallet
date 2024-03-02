// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Typography from 'core/components/Typography';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import makeStyles from 'core/utils/makeStyles';
import { DROP_SHADOW, PADDING } from 'shared/constants';
import Cluster from 'core/components/Layouts/Cluster';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { i18nmock } from 'strings';
import PetraAddress from 'core/components/PetraAddress';
import { getPossibleRewards } from '@petra/core/queries/staking/getPossibleRewards';
import { StakeOperation } from '@petra/core/queries/staking/types';
import { fullDate } from '@petra/core/utils/date';
import { useStakeTransaction } from '@petra/core/queries/staking/useStakeTransaction';
import { customColors } from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { ArrowDown, InfoIconSVG, TotalStakedIcon } from 'shared/assets/svgs';
import { addressDisplay } from 'shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { DefaultNetworks } from '@petra/core/types';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { AccountAvatar } from 'core/components/PetraAvatar';
import { stakingEvents } from '@petra/core/utils/analytics/events';
import { StakingRow } from '../Components/StakingRow';
import { StakingFacet } from '../Components/StakingFacet';
import PossibleRewardsSheetContent from '../Sheets/PossibleRewardsSheetContent';
import { StakingCoin } from '../Components/StakingCoin';
import { StakingLabel, StakingLabelProps } from '../Components/StakingLabel';

type ConfirmStakeProps =
  RootAuthenticatedStackScreenProps<'StakeFlowConfirmStake'>;

const SPACING = 24;
const SPACING_LARGE = 32;

function AccountRow({
  address,
  Icon = <AccountAvatar accountAddress={address} size={48} />,
}: {
  Icon?: JSX.Element;
  address: string;
}): JSX.Element {
  const styles = useStyles();
  return (
    <Cluster align="center" space={12} style={styles.accountRow}>
      {Icon}
      <PetraAddress address={address} underline={false} bold />
    </Cluster>
  );
}

export default function ConfirmStake({ navigation, route }: ConfirmStakeProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { activeNetworkName } = useNetworks();
  const { amount, info } = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeAccountAddress } = useActiveAccount();
  const { trackEvent } = useTrackEvent();

  const { error, gas, isLoading, submitTransaction } = useStakeTransaction({
    address: info.validator.owner_address,
    amount,
    operation: StakeOperation.STAKE,
  });

  const adjustedGas = (gas?.gasFee ?? 0) * (gas?.gasUnitPrice ?? 0);
  const total = Number(amount) + adjustedGas;
  const lockedUntil = fullDate(info.delegationPool.lockedUntilTimestamp ?? 0);
  const possibleRewards = getPossibleRewards(amount, info);
  const possibleRewardsColor: StakingLabelProps['color'] =
    possibleRewards === '0' ? 'error' : 'primary';
  const infoCardContent = (
    i18nmock('stake:confirmStake.infoCard') as string
  ).replace('{ADDRESS}', addressDisplay(info.validator.owner_address, false));

  function goBack() {
    navigation.pop();
  }

  const showPossibleRewardsBottomSheet = useCallback(
    () => <PossibleRewardsSheetContent amount={amount} info={info} />,
    [amount, info],
  );

  const onConfirm = useCallback(async () => {
    try {
      if (error) {
        throw new Error(error);
      }

      setIsSubmitting(true);
      const txn = await submitTransaction();

      void trackEvent({
        eventType: stakingEvents.STAKE_SUCCESS,
        params: {
          txnHash: txn.hash,
        },
      });

      navigation.push('StakeFlowTerminal', {
        amount: amount.toString(),
        type: 'stake-success',
      });
    } catch (err: any) {
      void trackEvent({
        eventType: stakingEvents.STAKE_SUCCESS,
      });
      navigation.push('StakeFlowTerminal', {
        message: err?.message,
        type: 'stake-error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, navigation, submitTransaction, error, trackEvent]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <StakingRow>
            <AccountRow address={activeAccountAddress} />

            <StakingCoin
              amount={amount}
              titleType="coin"
              titleBold
              titleColor="primary"
              subtitleType="usd"
              align="right"
              subtitleColor="muted"
            />
          </StakingRow>

          <View style={{ paddingHorizontal: 10 }}>
            <ArrowDown color={customColors.navy[300]} />
          </View>

          <StakingRow>
            <AccountRow
              address={info.validator.owner_address}
              Icon={<TotalStakedIcon />}
            />
          </StakingRow>
        </View>

        <StakingRow marginTop={SPACING}>
          <StakingFacet
            color="muted"
            title={i18nmock('stake:confirmStake.possibleRewards')}
            subtitle={i18nmock('stake:confirmStake.in30Days')}
            subtitleSize="xsmall"
            renderBottomSheetContent={showPossibleRewardsBottomSheet}
          />

          <StakingCoin
            amount={possibleRewards}
            titleType="coin"
            titleBold
            titleColor={possibleRewardsColor}
            align="right"
          />
        </StakingRow>

        <StakingRow marginTop={SPACING}>
          <StakingLabel
            color="muted"
            title="stake:confirmStake.nextUnlockDate"
            subtitle={
              activeNetworkName === DefaultNetworks.Testnet
                ? 'stake:confirmStake.unlocksEvery2Hours'
                : 'stake:confirmStake.unlocksEvery30Days'
            }
            subtitleSize="xsmall"
            term={{
              definition:
                'stake:confirmStake.terms.withdrawlAvailable.definition',
              title: 'stake:confirmStake.terms.withdrawlAvailable.title',
            }}
          />

          <StakingFacet
            title={lockedUntil}
            titleBold
            titleColor="primary"
            align="right"
          />
        </StakingRow>

        <View style={styles.divider} />

        <StakingRow marginTop={SPACING}>
          <StakingLabel
            color="muted"
            title="stake:confirmStake.networkFee"
            term={{
              definition: 'stake:confirmStake.terms.networkFee.definition',
              title: 'stake:confirmStake.terms.networkFee.title',
            }}
          />

          {gas ? (
            <StakingCoin
              titleType="coin"
              titleBold
              titleColor="primary"
              subtitleType="usd"
              subtitleColor="muted"
              align="right"
              amount={adjustedGas.toString() ?? '0'}
            />
          ) : null}
        </StakingRow>

        <StakingRow marginTop={SPACING}>
          <StakingLabel
            color="primary"
            title="stake:confirmStake.total"
            titleBold
          />

          <StakingCoin
            titleType="coin"
            titleBold
            titleColor="primary"
            subtitleType="usd"
            subtitleColor="muted"
            align="right"
            amount={total.toString()}
          />
        </StakingRow>

        <Cluster style={styles.infoCard} align="flex-start" space={8} noWrap>
          <InfoIconSVG color={customColors.navy[700]} />
          <Typography style={{ flex: 1, flexShrink: 1 }}>
            {infoCardContent}
          </Typography>
        </Cluster>
      </ScrollView>

      <Cluster
        space={8}
        style={[
          styles.buttonRow,
          { paddingBottom: Math.max(insets.bottom, PADDING.container) },
        ]}
      >
        <PetraPillButton
          text={i18nmock('general:cancel')}
          onPress={() => goBack()}
          buttonDesign={PillButtonDesign.clearWithDarkText}
          containerStyleOverride={styles.button}
        />

        <PetraPillButton
          text={i18nmock('general:confirm')}
          onPress={onConfirm}
          isLoading={isLoading || isSubmitting}
          disabled={isLoading || isSubmitting}
          containerStyleOverride={styles.button}
          buttonDesign={PillButtonDesign.default}
        />
      </Cluster>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  accountRow: {
    flex: 1,
    flexShrink: 1,
  },
  button: {
    flex: 1,
  },
  buttonRow: {
    backgroundColor: theme.background.secondary,
    padding: PADDING.container,
  },
  card: {
    backgroundColor: theme.background.tertiary,
    borderRadius: 8,
    gap: SPACING,
    marginBottom: PADDING.container,
    marginTop: PADDING.container,
    paddingHorizontal: PADDING.container,
    paddingVertical: SPACING_LARGE,
    ...DROP_SHADOW.cardMinimal,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    paddingHorizontal: PADDING.container,
  },
  divider: {
    backgroundColor: customColors.navy[100],
    height: 1,
    marginTop: SPACING,
    width: '100%',
  },
  infoCard: {
    backgroundColor: customColors.navy[50],
    borderRadius: 8,
    marginBottom: SPACING_LARGE,
    marginTop: SPACING,
    padding: PADDING.container,
  },
}));
