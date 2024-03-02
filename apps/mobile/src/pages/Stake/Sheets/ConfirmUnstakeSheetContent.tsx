// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Image, View } from 'react-native';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import Typography from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';
import { useTheme } from 'core/providers/ThemeProvider';
import Cluster from 'core/components/Layouts/Cluster';
import { confirmUnstake } from 'shared/assets/images';
import fullDate from '@petra/core/utils/date';
import AlertOctagonFillIcon from 'shared/assets/svgs/alert_octagon_fill_icon';
import useStakeTransaction from '@petra/core/queries/staking/useStakeTransaction';
import { StakeOperation } from '@petra/core/queries/staking/types';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { stakingEvents } from '@petra/core/utils/analytics/events';
import { useFormatApt } from '../utils/useFormatApt';

interface ConfirmUnstakeSheetContentProps {
  address: string;
  amount: string;
  lockedUntilTimestamp: number;
  onCancel: () => void;
  onFailure: (message: string) => void;
  onSuccess: () => void;
  warningMessage?: string;
}

export default function ConfirmUnstakeSheetContent({
  address,
  amount,
  lockedUntilTimestamp,
  onCancel,
  onFailure,
  onSuccess,
  warningMessage,
}: ConfirmUnstakeSheetContentProps): JSX.Element {
  const { theme } = useTheme();
  const styles = useStyles();
  const { coin } = useFormatApt(amount);
  const date = fullDate(lockedUntilTimestamp);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { trackEvent } = useTrackEvent();

  const { error, isLoading, submitTransaction } = useStakeTransaction({
    address,
    amount,
    operation: StakeOperation.UNLOCK,
  });

  const handleOnStake = async () => {
    try {
      setIsSubmitting(true);
      if (error) throw new Error(error);
      const txn = await submitTransaction();
      void trackEvent({
        eventType: stakingEvents.UNSTAKE_SUCCESS,
        params: {
          txnHash: txn.hash,
        },
      });

      onSuccess();
    } catch (err: any) {
      onFailure(err?.message ?? i18nmock('general:tryAgain'));
      void trackEvent({
        eventType: stakingEvents.UNSTAKE_SUCCESS,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, styles.spacingMedium]}>
      <Typography align="center" variant="subheading">
        {i18nmock('stake:confirmUnstakeSheet.title')}
      </Typography>

      <Image
        source={confirmUnstake}
        style={{ height: 140, width: 140, ...styles.spacingLarge }}
      />
      {warningMessage ? (
        <View style={styles.warningMessageRow}>
          <AlertOctagonFillIcon size={24} color={theme.palette.warning} />
          <Typography
            color={theme.palette.warning}
            weight="600"
            style={styles.warningMessage}
          >
            {warningMessage.replace('{AMOUNT}', coin)}
          </Typography>
        </View>
      ) : null}

      <Typography align="center" weight="600" style={styles.spacingLarge}>
        {i18nmock('stake:confirmUnstakeSheet.subtitle').replace(
          '{AMOUNT}',
          coin,
        )}
      </Typography>

      <Typography
        variant="small"
        align="center"
        color={theme.typography.primaryDisabled}
        style={styles.spacingMedium}
      >
        {i18nmock('stake:confirmUnstakeSheet.description').replace(
          '{DATE}',
          date,
        )}
      </Typography>

      <Cluster noWrap space={8} style={styles.spacingMedium}>
        <PetraPillButton
          onPress={onCancel}
          buttonDesign={PillButtonDesign.clearWithDarkText}
          text={i18nmock('general:cancel')}
          containerStyleOverride={styles.button}
          disabled={isSubmitting}
        />
        <PetraPillButton
          onPress={handleOnStake}
          buttonDesign={PillButtonDesign.default}
          text={i18nmock('stake:confirmUnstakeSheet.unstake')}
          containerStyleOverride={styles.button}
          disabled={isLoading || isSubmitting}
          isLoading={isLoading || isSubmitting}
        />
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
  warningMessage: { flex: 1, flexWrap: 'wrap', marginLeft: 8 },
  warningMessageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 10,
  },
}));
