// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useMemo, useRef } from 'react';
import { Keyboard, StyleSheet, TextInput } from 'react-native';
import { customColors } from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { AptosPriceInfo, useCoinGecko } from '@petra/core/hooks/useCoinGecko';
import { StakeOperation } from '@petra/core/queries/staking/types';
import sanitizeUnstakeAmount from '@petra/core/queries/staking/unstakeCalculator';
import useCoinDisplay from 'pages/Assets/useCoinDisplay';
import useDebounce from '@petra/core/hooks/useDebounce';
import { usePrompt } from 'core/providers/PromptProvider';
import ConfirmUnstakeSheetContent from 'pages/Stake/Sheets/ConfirmUnstakeSheetContent';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import { i18nmock } from 'strings';
import makeStyles from 'core/utils/makeStyles';
import {
  APTOS_COIN_INFO,
  PADDING,
  MINIMUM_APT_IN_POOL_IN_OCTA,
  MINIMUM_APT_IN_POOL,
} from 'shared/constants';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import useStakeTransaction from '@petra/core/queries/staking/useStakeTransaction';
import { formatAmount } from '@petra/core/utils/coin';
import {
  computeFiatDollarValue,
  fiatDollarValueDisplay,
} from 'pages/Assets/Shared/utils';
import { useAccountCoinResources } from 'pages/Send/hooks/useAccountCoinResources';
import {
  MINIMUM_APT_FOR_UNSTAKE,
  MINIMUM_APT_FOR_UNSTAKE_OCTA,
} from '@petra/core/constants';
import {
  DEBOUNCE_TIME_MS,
  ErrorAndButtonContainer,
  isValidPrice,
  StakingCalculator,
} from 'pages/Stake/Views/EnterStakeAmount';
import {
  calculateAptStringFromCurrency,
  calculateCurrencyStringFromApt,
  convertStringToBigIntableStringWithOcta,
  generateStringFromBigInt,
  handleSwitchToCurrency,
  scrubUserEntry,
  shouldRemovePeriod,
} from 'pages/Stake/utils/enterStakeUtils';
import { useIsKeyboardShown } from 'pages/Send/components/CoinAmountInput';
import { Stake } from '@petra/core/queries/useStaking';

type EnterUnstakeAmountProps =
  RootAuthenticatedStackScreenProps<'StakeFlowEnterUnstakeAmount'> & {
    aptosPriceInfo: AptosPriceInfo;
  };

type EnterUnstakeAmountContainerProps =
  RootAuthenticatedStackScreenProps<'StakeFlowEnterUnstakeAmount'>;

type EnterUnstakeAmountSimplifiedProps =
  RootAuthenticatedStackScreenProps<'StakeFlowEnterUnstakeAmount'>;

function useCoinBalance(coinType: string) {
  const { activeAccountAddress } = useActiveAccount();
  const coinResources = useAccountCoinResources(activeAccountAddress, {
    keepPreviousData: true,
  });

  const coinResource = coinResources.isSuccess
    ? coinResources.data.find((res) => res.type === coinType)
    : undefined;

  return coinResource?.balance;
}

const coinInfo = APTOS_COIN_INFO;

function useUnstakeAmount(aptRawString: string, stake: Stake, address: string) {
  const amount: bigint = BigInt(
    convertStringToBigIntableStringWithOcta(aptRawString),
  );
  // Debounce amount to 700ms according to design feedback
  const { debouncedValue: debouncedAmount, isLoading: isAmountDebouncing } =
    useDebounce(amount, DEBOUNCE_TIME_MS);
  const balance = useCoinBalance(coinInfo.type);

  // Warm up the cache
  const { isLoading } = useStakeTransaction({
    address: address ?? '0x1',
    amount: balance?.toString() ?? '0',
    operation: StakeOperation.UNLOCK,
  });
  const pendingInactiveStake = stake.withdrawPending;
  const activeStake = stake.active;
  const minStake =
    pendingInactiveStake < MINIMUM_APT_IN_POOL_IN_OCTA
      ? MINIMUM_APT_IN_POOL_IN_OCTA - pendingInactiveStake
      : MINIMUM_APT_IN_POOL_IN_OCTA;
  const suggestedMaxStake =
    activeStake > MINIMUM_APT_IN_POOL_IN_OCTA &&
    activeStake - MINIMUM_APT_IN_POOL_IN_OCTA > minStake
      ? activeStake - MINIMUM_APT_IN_POOL_IN_OCTA
      : null;

  const amountAboveStakedAmount = amount > stake.active;

  const metMinUnstakeRequirement = Number(debouncedAmount) >= minStake;
  const metMaxUnstakeRequirement = suggestedMaxStake
    ? Number(debouncedAmount) < suggestedMaxStake
    : false;

  // previously we were looking if the debouncedAmount exactly equalled the stake.active
  // on switching between USD and APT, with a hundreths place limit in USD, the recalculation
  // of APT on switching to USD leaves a few fractions of a cent leftover.
  const isMaxAmountStaked =
    Math.abs(Number(debouncedAmount) - stake.active) < 1000000;

  return {
    activeStake,
    amount,
    amountAboveStakedAmount,
    isAmountDebouncing,
    isLoading,
    isMaxAmountStaked,
    metMaxUnstakeRequirement,
    metMinUnstakeRequirement,
  };
}

function EnterUnstakeAmountSimplified({
  navigation,
  route,
}: EnterUnstakeAmountSimplifiedProps) {
  const styles = useStyles();
  const isKeyboardShown = useIsKeyboardShown();
  const { setPromptContent, setPromptVisible } = usePrompt();

  const { address, lockedUntilTimestamp, stake } = route.params;
  const [aptRawString, setAptRawString] = useState('');
  const aptInputRef = useRef<TextInput>(null);

  const {
    activeStake,
    amount,
    amountAboveStakedAmount,
    isAmountDebouncing,
    isLoading,
    isMaxAmountStaked,
    metMaxUnstakeRequirement,
    metMinUnstakeRequirement,
  } = useUnstakeAmount(aptRawString, stake, address);

  const formattedUnstakedAmount = formatAmount(stake.active, coinInfo, {
    decimals: 4,
    prefix: false,
  });

  const warningMessage = useMemo(() => {
    if (isMaxAmountStaked || isAmountDebouncing || aptRawString.length === 0) {
      return undefined;
    }

    const minForUnstake = `${MINIMUM_APT_FOR_UNSTAKE} APT`;
    const minForStake = `${MINIMUM_APT_IN_POOL} APT`;

    if (amountAboveStakedAmount) {
      return i18nmock('stake:enterUnstakeAmount.overMaximumStakeWarning');
    }

    if (!metMinUnstakeRequirement && !metMaxUnstakeRequirement) {
      return i18nmock('stake:enterUnstakeAmount.minMaximumUnstakeWarning')
        .replaceAll('{AMOUNT_UNSTAKE}', minForUnstake)
        .replaceAll('{AMOUNT_STAKE}', minForStake);
    }

    if (!metMinUnstakeRequirement) {
      return i18nmock('stake:enterUnstakeAmount.minimumUnstakeWarning').replace(
        '{AMOUNT}',
        minForUnstake,
      );
    }
    if (!metMaxUnstakeRequirement) {
      return i18nmock('stake:enterUnstakeAmount.maximumUnstakeWarning').replace(
        '{AMOUNT}',
        minForStake,
      );
    }

    return undefined;
  }, [
    amountAboveStakedAmount,
    aptRawString,
    isAmountDebouncing,
    isMaxAmountStaked,
    metMaxUnstakeRequirement,
    metMinUnstakeRequirement,
  ]);

  const isWarning = warningMessage !== undefined;

  const onPressMaxStake = () => {
    const stakeActiveAsString = generateStringFromBigInt(BigInt(stake.active));
    setAptRawString(stakeActiveAsString);
  };

  const onChangeAptText = (e: string) => {
    const isPeriodRemoval = shouldRemovePeriod(aptRawString, e);
    const newValidAptRawString = scrubUserEntry(e, isPeriodRemoval, true);
    setAptRawString(newValidAptRawString);
  };

  const onInputPress = () => {
    if (!isKeyboardShown()) {
      if (aptInputRef.current?.isFocused()) {
        aptInputRef.current?.blur();
      }
      aptInputRef.current?.focus();
    }
  };

  const onContinue = () => {
    Keyboard.dismiss();

    const adjustedStakeAmount = sanitizeUnstakeAmount(
      amount,
      BigInt(activeStake),
    );

    setPromptContent(
      <ConfirmUnstakeSheetContent
        amount={String(adjustedStakeAmount)}
        address={address}
        lockedUntilTimestamp={lockedUntilTimestamp}
        onCancel={() => {
          setPromptVisible(false);
        }}
        onFailure={(message) => {
          setPromptVisible(false);
          navigation.navigate('StakeFlowTerminal', {
            message,
            type: 'error',
          });
        }}
        onSuccess={() => {
          setPromptVisible(false);
          navigation.navigate('StakeFlowTerminal', {
            amount: String(adjustedStakeAmount),
            lockedUntilTimestamp,
            type: 'unstake-success',
          });
        }}
      />,
    );
    setPromptVisible(true);
  };

  const canProceed =
    !amountAboveStakedAmount &&
    !isLoading &&
    !isAmountDebouncing &&
    aptRawString.length > 0;

  return (
    <BottomSafeAreaView style={styles.container}>
      <PetraKeyboardAvoidingView style={styles.keyboard}>
        <StakingCalculator
          aptInputRef={aptInputRef}
          aptRawString={aptRawString}
          isError={isWarning}
          isWarningColor
          onChangeAptText={onChangeAptText}
          onInputPress={onInputPress}
        />
        <ErrorAndButtonContainer
          errorMessage={warningMessage}
          isError={isWarning}
          isLoading={isLoading}
          isWarningColor
          maxAmountDisplay={formattedUnstakedAmount}
          nextButtonDisabled={!canProceed}
          onContinue={onContinue}
          onPressMaxStake={onPressMaxStake}
        />
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}
function EnterUnstakeAmount({
  aptosPriceInfo,
  navigation,
  route,
}: EnterUnstakeAmountProps) {
  const styles = useStyles();
  const { aptosCoin } = useCoinDisplay();
  const isKeyboardShown = useIsKeyboardShown();

  const { setPromptContent, setPromptVisible } = usePrompt();
  const { address, lockedUntilTimestamp, stake } = route.params;

  const [currencyMode, setCurrencyMode] = useState<'apt' | 'usd'>('apt');
  const [aptRawString, setAptRawString] = useState('');
  const [currencyRawString, setCurrencyRawString] = useState('');

  const aptInputRef = useRef<TextInput>(null);
  const currencyInputRef = useRef<TextInput>(null);

  const {
    activeStake,
    amount,
    amountAboveStakedAmount,
    isAmountDebouncing,
    isLoading,
    isMaxAmountStaked,
    metMaxUnstakeRequirement,
    metMinUnstakeRequirement,
  } = useUnstakeAmount(aptRawString, stake, address);

  const formattedUnstakedAmount = formatAmount(stake.active, coinInfo, {
    decimals: 4,
    prefix: false,
  });

  const maxUnstakedAmountDisplay = React.useMemo(() => {
    const formattedDisplay = formattedUnstakedAmount ?? '';

    const maxDisplay =
      currencyMode === 'usd' && aptosPriceInfo
        ? `${fiatDollarValueDisplay(
            computeFiatDollarValue(
              aptosPriceInfo.currentPrice,
              aptosCoin,
              BigInt(stake.active),
            ),
          )}`
        : formattedDisplay;

    return maxDisplay;
  }, [
    aptosCoin,
    aptosPriceInfo,
    currencyMode,
    formattedUnstakedAmount,
    stake.active,
  ]);

  const warningMessage = useMemo(() => {
    if (isMaxAmountStaked || isAmountDebouncing || aptRawString.length === 0) {
      return undefined;
    }

    const minForUnstakeUSD =
      aptosPriceInfo && aptosCoin && aptosCoin.info
        ? fiatDollarValueDisplay(
            computeFiatDollarValue(
              aptosPriceInfo.currentPrice,
              aptosCoin,
              BigInt(MINIMUM_APT_FOR_UNSTAKE_OCTA),
            ),
          )
        : '';

    const minForStakeUSD =
      aptosPriceInfo && aptosCoin && aptosCoin.info
        ? fiatDollarValueDisplay(
            computeFiatDollarValue(
              aptosPriceInfo.currentPrice,
              aptosCoin,
              BigInt(MINIMUM_APT_IN_POOL_IN_OCTA),
            ),
          )
        : '';

    const minForUnstake =
      currencyMode === 'apt'
        ? `${MINIMUM_APT_FOR_UNSTAKE} APT`
        : minForUnstakeUSD;

    const minForStake =
      currencyMode === 'apt' ? `${MINIMUM_APT_IN_POOL} APT` : minForStakeUSD;

    if (amountAboveStakedAmount) {
      return i18nmock('stake:enterUnstakeAmount.overMaximumStakeWarning');
    }

    if (!metMinUnstakeRequirement && !metMaxUnstakeRequirement) {
      return i18nmock('stake:enterUnstakeAmount.minMaximumUnstakeWarning')
        .replaceAll('{AMOUNT_UNSTAKE}', minForUnstake)
        .replaceAll('{AMOUNT_STAKE}', minForStake);
    }

    if (!metMinUnstakeRequirement) {
      return i18nmock('stake:enterUnstakeAmount.minimumUnstakeWarning').replace(
        '{AMOUNT}',
        minForUnstake,
      );
    }
    if (!metMaxUnstakeRequirement) {
      return i18nmock('stake:enterUnstakeAmount.maximumUnstakeWarning').replace(
        '{AMOUNT}',
        minForStake,
      );
    }

    return undefined;
  }, [
    amountAboveStakedAmount,
    aptosCoin,
    aptosPriceInfo,
    aptRawString,
    currencyMode,
    isAmountDebouncing,
    isMaxAmountStaked,
    metMaxUnstakeRequirement,
    metMinUnstakeRequirement,
  ]);

  const isWarning = warningMessage !== undefined;

  const onPressMaxStake = () => {
    const stakeActiveAsString = generateStringFromBigInt(BigInt(stake.active));
    const newCurrencyRawString = calculateCurrencyStringFromApt(
      aptosPriceInfo,
      stakeActiveAsString,
    );
    setAptRawString(stakeActiveAsString);
    setCurrencyRawString(newCurrencyRawString);
  };

  const onChangeAptText = (e: string) => {
    const isPeriodRemoval = shouldRemovePeriod(aptRawString, e);
    const newValidAptRawString = scrubUserEntry(e, isPeriodRemoval, true);
    setAptRawString(newValidAptRawString);

    // update the non-source of truth with a calculated value
    const newCurrencyString = calculateCurrencyStringFromApt(
      aptosPriceInfo,
      newValidAptRawString,
    );
    setCurrencyRawString(newCurrencyString);
  };
  const onChangeCurrencyText = (e: string) => {
    const isPeriodRemoval = shouldRemovePeriod(currencyRawString, e);
    const newValidCurrencyRawString = scrubUserEntry(e, isPeriodRemoval, false);
    setCurrencyRawString(newValidCurrencyRawString);

    // update the non-source of truth with a calculated value
    const newAptString = calculateAptStringFromCurrency(
      aptosPriceInfo,
      newValidCurrencyRawString,
    );
    setAptRawString(newAptString);
  };

  const handleToggleCurrencyMode = () => {
    if (currencyMode === 'apt') {
      currencyInputRef.current?.focus();
    } else {
      aptInputRef.current?.focus();
    }

    if (currencyMode === 'apt') {
      const { newAptString, newCurrencyString } = handleSwitchToCurrency(
        aptRawString,
        currencyRawString,
        aptosPriceInfo,
      );
      setAptRawString(newAptString);
      setCurrencyRawString(newCurrencyString);
    }

    setCurrencyMode(currencyMode === 'apt' ? 'usd' : 'apt');
  };

  const onInputPress = () => {
    if (!isKeyboardShown()) {
      if (aptInputRef.current?.isFocused()) {
        aptInputRef.current?.blur();
      }
      aptInputRef.current?.focus();
    }
  };

  const onContinue = () => {
    Keyboard.dismiss();

    const adjustedStakeAmount = sanitizeUnstakeAmount(
      amount,
      BigInt(activeStake),
    );

    setPromptContent(
      <ConfirmUnstakeSheetContent
        amount={String(adjustedStakeAmount)}
        address={address}
        lockedUntilTimestamp={lockedUntilTimestamp}
        onCancel={() => {
          setPromptVisible(false);
        }}
        onFailure={(message) => {
          setPromptVisible(false);
          navigation.navigate('StakeFlowTerminal', {
            message,
            type: 'error',
          });
        }}
        onSuccess={() => {
          setPromptVisible(false);
          navigation.navigate('StakeFlowTerminal', {
            amount: String(adjustedStakeAmount),
            lockedUntilTimestamp,
            type: 'unstake-success',
          });
        }}
      />,
    );
    setPromptVisible(true);
  };

  const canProceed =
    !amountAboveStakedAmount &&
    !isLoading &&
    !isAmountDebouncing &&
    aptRawString.length > 0;

  return (
    <BottomSafeAreaView style={styles.container}>
      <PetraKeyboardAvoidingView style={styles.keyboard}>
        <StakingCalculator
          aptInputRef={aptInputRef}
          aptRawString={aptRawString}
          currencyInputRef={currencyInputRef}
          currencyMode={currencyMode}
          currencyRawString={currencyRawString}
          handleToggleCurrencyMode={handleToggleCurrencyMode}
          isError={isWarning}
          isWarningColor
          onChangeAptText={onChangeAptText}
          onChangeCurrencyText={onChangeCurrencyText}
          onInputPress={onInputPress}
        />
        <ErrorAndButtonContainer
          errorMessage={warningMessage}
          isError={isWarning}
          isLoading={isLoading}
          isWarningColor
          maxAmountDisplay={maxUnstakedAmountDisplay}
          nextButtonDisabled={!canProceed}
          onContinue={onContinue}
          onPressMaxStake={onPressMaxStake}
        />
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}

export default function EnterUnstakeAmountContainer({
  navigation,
  route,
}: EnterUnstakeAmountContainerProps) {
  const { aptosPriceInfo } = useCoinGecko();

  if (
    aptosPriceInfo === null ||
    aptosPriceInfo === undefined ||
    !isValidPrice(aptosPriceInfo?.currentPrice ?? '')
  ) {
    return (
      <EnterUnstakeAmountSimplified navigation={navigation} route={route} />
    );
  }

  return (
    <EnterUnstakeAmount
      aptosPriceInfo={aptosPriceInfo}
      navigation={navigation}
      route={route}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  bottomInfoContainer: {
    gap: 12,
    justifyContent: 'center',
    minHeight: 88,
    padding: PADDING.container,
  },
  buttonContainer: {
    borderTopColor: customColors.navy['200'],
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: PADDING.container,
  },
  centerContainer: { alignItems: 'center', flex: 1 },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
  },
  errorMessage: { marginLeft: 8 },
  errorMessageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginRight: 12,
    padding: 4,
  },
  inputContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: PADDING.container,
  },
  keyboard: { flex: 1 },
  petraPillButtonText: {
    fontFamily: 'WorkSans-Bold',
  },
  petraPillContainer: {
    marginTop: 12,
  },
  swapButton: {
    alignItems: 'center',
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: 48,
  },
  swapButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  swapContainer: {
    justifyContent: 'center',
    minWidth: 48,
    position: 'absolute',
    right: 10,
  },
  swapIcon: {
    paddingLeft: 8,
  },
  topInfoContainer: {
    justifyContent: 'flex-start',
    minHeight: 88,
    padding: PADDING.container,
  },
  usdAmount: {
    marginTop: 24,
  },
}));
