// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Typography from 'core/components/Typography';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Image, View } from 'react-native';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import PetraPillButton, {
  PillButtonDesign,
} from 'core/components/PetraPillButton';
import { i18nmock } from 'strings';
import { stakeError, stakeSuccess } from 'shared/assets/images';
import { useTheme } from 'core/providers/ThemeProvider';
import fullDate from '@petra/core/utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from 'react-query';
import { STAKING_QUERY_KEY_PREFIX } from '@petra/core/constants';
import queryKeys from '@petra/core/queries/queryKeys';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useFormatApt } from '../utils/useFormatApt';

type StakeTerminalScreenProps =
  RootAuthenticatedStackScreenProps<'StakeFlowTerminal'>;

interface TerminalScreenProps {
  bodyLargeText?: string;
  descriptionText?: string;
  displayText: string;
  errorText?: string;
  image: JSX.Element;
  mutedText?: string;
  onDonePress: () => void;
}
function TerminalScreen({
  bodyLargeText,
  descriptionText,
  displayText,
  errorText,
  image,
  mutedText,
  onDonePress,
}: TerminalScreenProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <>
      <View style={styles.contentContainer}>
        {image}

        {bodyLargeText ? (
          <Typography weight="600" variant="bodyLarge" marginTop={32}>
            {bodyLargeText}
          </Typography>
        ) : null}

        <Typography weight="700" variant="display" marginTop={8}>
          {displayText}
        </Typography>

        {mutedText ? (
          <Typography color={theme.typography.primaryDisabled}>
            {mutedText}
          </Typography>
        ) : null}

        {descriptionText ? (
          <Typography marginTop={PADDING.container} align="center">
            {descriptionText}
          </Typography>
        ) : null}

        {errorText ? (
          <Typography
            color={theme.palette.error}
            marginTop={PADDING.container}
            align="center"
          >
            {errorText}
          </Typography>
        ) : null}
      </View>

      <View
        style={[
          styles.buttonContainer,
          { paddingBottom: Math.max(insets.bottom, PADDING.container) },
        ]}
      >
        <PetraPillButton
          containerStyleOverride={styles.button}
          onPress={onDonePress}
          buttonDesign={PillButtonDesign.default}
          text={i18nmock('general:done')}
        />
      </View>
    </>
  );
}

export default function StakeTerminalScreen({
  navigation,
  route,
}: StakeTerminalScreenProps) {
  const { activeAccountAddress } = useActiveAccount();
  const amount = useMemo(() => {
    switch (route.params.type) {
      case 'withdraw-success':
        return route.params.amount;
      case 'stake-success':
        return route.params.amount;
      case 'unstake-success':
        return route.params.amount;
      case 'stake-error':
      case 'error':
      default:
        return '0';
    }
  }, [route.params]);
  const { coin, usd } = useFormatApt(amount);
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(async () => {
    queryClient.invalidateQueries(STAKING_QUERY_KEY_PREFIX);

    const updateCoinResources =
      route.params.type === 'stake-success' ||
      route.params.type === 'withdraw-success';

    if (updateCoinResources) {
      await queryClient.invalidateQueries([
        queryKeys.getAccountResources,
        activeAccountAddress,
      ]);
      queryClient.invalidateQueries([
        queryKeys.getAccountOctaCoinBalance,
        activeAccountAddress,
      ]);
      queryClient.invalidateQueries([
        queryKeys.getAccountCoinResources,
        activeAccountAddress,
      ]);
    }
  }, [activeAccountAddress, queryClient, route.params.type]);

  useEffect(() => {
    void invalidateQueries();
  }, [invalidateQueries]);

  const goToStaking = useCallback(
    () => navigation.navigate('StakeFlowStaking'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (route.params.type === 'stake-success') {
    return (
      <TerminalScreen
        mutedText={usd}
        bodyLargeText={i18nmock('stake:terminal.stake-success.title')}
        displayText={coin}
        image={<Image source={stakeSuccess} />}
        onDonePress={goToStaking}
      />
    );
  }

  if (route.params.type === 'error') {
    return (
      <TerminalScreen
        descriptionText={i18nmock('general:tryAgain')}
        displayText={i18nmock('general:oops')}
        errorText={route.params.message}
        image={<Image source={stakeError} />}
        onDonePress={goToStaking}
      />
    );
  }

  if (route.params.type === 'stake-error') {
    return (
      <TerminalScreen
        bodyLargeText={i18nmock('stake:terminal.stake-error.subTitle')}
        displayText={i18nmock('stake:terminal.stake-error.title')}
        image={<Image source={stakeError} />}
        errorText={route.params.message}
        onDonePress={goToStaking}
      />
    );
  }

  if (route.params.type === 'unstake-success') {
    const description = i18nmock(
      'stake:terminal.unstake-success.description',
    ).replace('{DATE}', fullDate(route.params.lockedUntilTimestamp));

    return (
      <TerminalScreen
        bodyLargeText={i18nmock('stake:terminal.unstake-success.title')}
        displayText={coin}
        image={<Image source={stakeSuccess} />}
        mutedText={usd}
        descriptionText={description}
        onDonePress={goToStaking}
      />
    );
  }

  if (route.params.type === 'withdraw-success') {
    return (
      <TerminalScreen
        bodyLargeText={i18nmock('stake:terminal.withdraw-success.title')}
        displayText={coin}
        image={<Image source={stakeSuccess} />}
        mutedText={usd}
        onDonePress={goToStaking}
      />
    );
  }

  return null;
}

const useStyles = makeStyles((theme) => ({
  button: {
    flex: 1,
  },

  buttonContainer: {
    backgroundColor: theme.background.secondary,
    flexDirection: 'row',
    gap: 8,
    padding: PADDING.container,
  },

  contentContainer: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: PADDING.container,
  },
}));
