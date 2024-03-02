// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, {
  RefObject,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { customColors } from '@petra/core/colors';
import {
  formatAmount,
  getAmountIntegralFractional,
  formatSplitNumber,
} from '@petra/core/utils/coin';
import useDebounce from '@petra/core/hooks/useDebounce';
import { AptosPriceInfo, useCoinGecko } from '@petra/core/hooks/useCoinGecko';
import useCoinDisplay from 'pages/Assets/useCoinDisplay';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import Typography from 'core/components/Typography';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AlertOctagonFillIcon from 'shared/assets/svgs/alert_octagon_fill_icon';
import { i18nmock } from 'strings';
import makeStyles from 'core/utils/makeStyles';
import {
  APTOS_COIN_INFO,
  PADDING,
  OCTA,
  MINIMUM_APT_IN_POOL_FOR_WALLET,
  isShortScreen,
} from 'shared/constants';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import { useTheme, Theme } from 'core/providers/ThemeProvider';
import { SwapIconSVG } from 'shared/assets/svgs';
import useDelegationPools from '@petra/core/queries/staking/useDelegationPools';
import useStakeTransaction from '@petra/core/queries/staking/useStakeTransaction';
import { StakeOperation } from '@petra/core/queries/staking/types';
import { computeFiatDollarValue } from 'pages/Assets/Shared/utils';
import useCoinBalance from 'core/hooks/useCoinBalance';
import {
  calculateAptStringFromCurrency,
  calculateCurrencyStringFromApt,
  convertStringToBigIntableStringWithOcta,
  formatAptRawString,
  formatCurrencyRawString,
  generateStringFromBigInt,
  handleSwitchToCurrency,
  scrubUserEntry,
  shouldRemovePeriod,
} from 'pages/Stake/utils/enterStakeUtils';
import { useIsKeyboardShown } from 'pages/Send/components/CoinAmountInput';

type EnterStakeAmountContainerProps =
  RootAuthenticatedStackScreenProps<'StakeFlowEnterAmount'>;

type EnterStakeAmountSimplifiedProps = Omit<
  RootAuthenticatedStackScreenProps<'StakeFlowEnterAmount'>,
  'route'
>;

type EnterStakeAmountProps = Omit<
  RootAuthenticatedStackScreenProps<'StakeFlowEnterAmount'>,
  'route'
> & { aptosPriceInfo: AptosPriceInfo };

function aptDisplay(aptRawString: string): string {
  return `${formatAptRawString(aptRawString)} APT`;
}

function currencyDisplay(currencyRawString: string): string {
  return `${formatCurrencyRawString(currencyRawString)}`;
}

export function isValidPrice(price: string): boolean {
  try {
    const priceFloat = parseFloat(price);
    const dividable = 1 / priceFloat;
    const multipliable = 1 * priceFloat;
    // dividing by a zero value should throw, multiplying by 1 should be a valid number
    return !!dividable && !!multipliable;
  } catch {
    // could throw because of divide by zero or other unexpected behavior.
    return false;
  }
}

const coinInfo = APTOS_COIN_INFO;

export const DEBOUNCE_TIME_MS = 700;

function useStakeAmount(aptRawString: string) {
  // Debounce amount to 700ms according to design feedback
  const { debouncedValue: debouncedAmount, isLoading: isAmountDebouncing } =
    useDebounce(
      BigInt(convertStringToBigIntableStringWithOcta(aptRawString)),
      DEBOUNCE_TIME_MS,
    );

  const balance = useCoinBalance(coinInfo.type);

  // Warm up the cache for the next screen
  const poolRes = useDelegationPools();
  const firstPool = (poolRes?.data || [])[0];
  const { gas, isLoading } = useStakeTransaction({
    address: firstPool?.validator.owner_address ?? '0x1',
    amount: balance?.toString() ?? '0',
    operation: StakeOperation.STAKE,
  });

  const totalGas = BigInt((gas?.gasFee ?? 0) * (gas?.gasUnitPrice ?? 0));
  const isBalanceMinusGasFeeEnough = (balance ?? BigInt(0)) >= debouncedAmount;
  const isBalanceEnough =
    (balance ?? BigInt(0)) >= debouncedAmount + BigInt(3) * totalGas;
  const totalBalanceMinus3xGas = (balance ?? BigInt(0)) - BigInt(3) * totalGas;
  const metMinimumStakeAmount =
    debouncedAmount >= MINIMUM_APT_IN_POOL_FOR_WALLET * OCTA;

  return {
    debouncedAmount,
    isAmountDebouncing,
    isBalanceEnough,
    isBalanceMinusGasFeeEnough,
    isLoading,
    metMinimumStakeAmount,
    totalBalanceMinus3xGas,
  };
}

function fontColor(
  isError: boolean,
  isZeroLength: boolean,
  theme: Theme,
  isWarningColor: boolean,
) {
  if (isError) {
    return isWarningColor ? theme.palette.warning : theme.palette.error;
  }
  if (isZeroLength) {
    return theme.typography.secondaryDisabled;
  }
  return theme.typography.primary;
}

interface ErrorAndButtonContainerProps {
  errorMessage: string;
  isError: boolean;
  isLoading: boolean;
  isWarningColor: boolean;
  maxAmountDisplay: string;
  nextButtonDisabled: boolean;
  onContinue: () => void;
  onPressMaxStake: () => void;
}
export function ErrorAndButtonContainer({
  errorMessage,
  isError,
  isLoading,
  isWarningColor,
  maxAmountDisplay,
  nextButtonDisabled,
  onContinue,
  onPressMaxStake,
}: ErrorAndButtonContainerProps) {
  const styles = useStyles();
  const { theme } = useTheme();
  const messageColor = isWarningColor
    ? theme.palette.warning
    : theme.palette.error;
  return (
    <>
      <View style={styles.bottomInfoContainer}>
        <View style={styles.errorMessageContainer}>
          {isError ? (
            <View style={styles.errorMessageRow}>
              <AlertOctagonFillIcon
                size={isShortScreen ? 12 : 24}
                color={messageColor}
              />
              <Typography
                color={messageColor}
                weight="600"
                style={styles.errorMessage}
                variant={isShortScreen ? 'small' : 'body'}
              >
                {errorMessage}
              </Typography>
            </View>
          ) : null}
        </View>

        <PetraPillButton
          isLoading={isLoading}
          buttonDesign={PillButtonDesign.clearWithDarkText}
          onPress={onPressMaxStake}
          text={
            maxAmountDisplay
              ? `${i18nmock('general:max')} ${maxAmountDisplay}`
              : `${i18nmock('stake:enterStakeAmount.unavailableBalance')}`
          }
        />
      </View>

      <View style={styles.buttonContainer}>
        <PetraPillButton
          disabled={nextButtonDisabled}
          isLoading={isLoading}
          buttonDesign={PillButtonDesign.default}
          onPress={onContinue}
          text={i18nmock('general:next')}
        />
      </View>
    </>
  );
}

interface StakingProps {
  aptInputRef: RefObject<TextInput>;
  aptRawString: string;
  currencyInputRef?: RefObject<TextInput>;
  currencyMode?: string;
  currencyRawString?: string;
  handleToggleCurrencyMode?: () => void;
  isError: boolean;
  isWarningColor: boolean;
  onChangeAptText: (s: string) => void;
  onChangeCurrencyText?: (s: string) => void;
  onInputPress: () => void;
}

export function StakingCalculator({
  aptInputRef,
  aptRawString,
  currencyInputRef,
  currencyMode,
  currencyRawString,
  handleToggleCurrencyMode,
  isError,
  isWarningColor,
  onChangeAptText,
  onChangeCurrencyText,
  onInputPress,
}: StakingProps) {
  const styles = useStyles();
  const { theme } = useTheme();
  const getTextDisplayStyle = (type: 'apt' | 'usd') => {
    // only two types - if currencyMode matches the text type, then return the
    // large text display, otherwise return the small text display

    // if currency mode is undefined - no price info to calculate the dollar value - then
    // also return the large font size
    if (type === currencyMode || currencyMode === undefined) {
      return {
        color: fontColor(
          isError,
          aptRawString.length === 0,
          theme,
          isWarningColor,
        ),
        fontSize: isShortScreen ? 22 : 64,
        lineHeight: isShortScreen ? 22 : 64,
      };
    }

    return {
      color: fontColor(
        isError,
        aptRawString.length === 0,
        theme,
        isWarningColor,
      ),
      fontSize: 16,
      lineHeight: 16,
    };
  };
  const renderMainDisplay = () => (
    <TouchableWithoutFeedback
      style={styles.mainContentContainer}
      onPress={onInputPress}
    >
      <View
        style={[
          styles.mainContent,
          { flexDirection: isShortScreen ? 'row' : 'column' },
        ]}
      >
        <View style={styles.textContainer}>
          <Typography
            style={getTextDisplayStyle('apt')}
            variant="display"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {aptDisplay(aptRawString)}
          </Typography>
          <TextInput
            ref={aptInputRef}
            caretHidden
            // Note: focusing the input when a navigation `focus` event is triggered
            // doesn't work on Android, so keeping the `autoFocus` property for Android only
            autoFocus
            keyboardType="decimal-pad"
            onChangeText={onChangeAptText}
            blurOnSubmit={false}
            style={{
              // Need to be somewhat visible to allow triggering the keyboard on Android
              color: 'white',
              height: 1,
              padding: 0,
              width: 1,
            }}
            value={aptRawString}
          />
        </View>
        {currencyRawString !== undefined ? (
          <View style={styles.textContainer}>
            <Typography
              style={getTextDisplayStyle('usd')}
              variant="display"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {currencyDisplay(currencyRawString)}
            </Typography>
            <TextInput
              ref={currencyInputRef}
              caretHidden
              keyboardType="decimal-pad"
              onChangeText={onChangeCurrencyText}
              blurOnSubmit={false}
              style={{
                // Need to be somewhat visible to allow triggering the keyboard on Android
                color: 'white',
                height: 1,
                padding: 0,
                width: 1,
              }}
              // Feeding value back to enable text change prevention
              value={currencyRawString}
            />
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.inputContainer}>
      {renderMainDisplay()}

      {handleToggleCurrencyMode !== undefined ? (
        <View style={styles.swapContainer}>
          <PetraPillButton
            containerStyleOverride={styles.swapButtonContainer}
            buttonStyleOverride={styles.swapButton}
            buttonDesign={PillButtonDesign.clearWithDarkText}
            onPress={handleToggleCurrencyMode}
            leftIcon={() => (
              <View style={styles.swapIcon}>
                <SwapIconSVG color={customColors.navy['600']} />
              </View>
            )}
          />
        </View>
      ) : null}
    </View>
  );
}

function EnterStakeAmountSimplified({
  navigation,
}: EnterStakeAmountSimplifiedProps) {
  const styles = useStyles();
  const isKeyboardShown = useIsKeyboardShown();

  const [aptRawString, setAptRawString] = useState('');

  const aptInputRef = useRef<TextInput>(null);

  const {
    debouncedAmount,
    isAmountDebouncing,
    isBalanceEnough,
    isBalanceMinusGasFeeEnough,
    isLoading,
    metMinimumStakeAmount,
    totalBalanceMinus3xGas,
  } = useStakeAmount(aptRawString);

  const errorMessage = useMemo(() => {
    if (isAmountDebouncing || aptRawString.length === 0) return undefined;
    if (!isBalanceMinusGasFeeEnough) {
      return i18nmock('stake:amountInput.insufficientBalance');
    }
    if (!isBalanceEnough) {
      return i18nmock('stake:amountInput.insufficientBalanceAndFee');
    }
    if (!metMinimumStakeAmount) {
      return i18nmock('stake:amountInput.lessThanMinimumAmount').replaceAll(
        '{MIN_AMOUNT}',
        '11 APT',
      );
    }

    return undefined;
  }, [
    aptRawString,
    isAmountDebouncing,
    isBalanceEnough,
    isBalanceMinusGasFeeEnough,
    metMinimumStakeAmount,
  ]);

  const onContinue = useCallback(() => {
    if (errorMessage || isAmountDebouncing || aptRawString.length === 0) return;

    navigation.push('StakeFlowSelectPool', {
      amount: debouncedAmount.toString(),
    });
  }, [
    aptRawString,
    debouncedAmount,
    errorMessage,
    isAmountDebouncing,
    navigation,
  ]);

  const isError = !isAmountDebouncing && errorMessage !== undefined;

  const canProceed =
    !isError && !isAmountDebouncing && !isLoading && aptRawString.length > 0;

  const formattedBalance =
    totalBalanceMinus3xGas !== undefined
      ? formatAmount(totalBalanceMinus3xGas, coinInfo, {
          decimals: 4,
          prefix: false,
        })
      : undefined;

  const maxAmountDisplay = useMemo(() => {
    const formattedDisplay = formattedBalance ?? '';
    return formattedDisplay;
  }, [formattedBalance]);

  const onPressMaxStake = () => {
    const newAptRawString = generateStringFromBigInt(totalBalanceMinus3xGas);
    setAptRawString(newAptRawString);
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

  return (
    <BottomSafeAreaView style={styles.container}>
      <PetraKeyboardAvoidingView style={styles.keyboard}>
        <StakingCalculator
          aptInputRef={aptInputRef}
          aptRawString={aptRawString}
          isError={isError}
          isWarningColor={false}
          onChangeAptText={onChangeAptText}
          onInputPress={onInputPress}
        />
        <ErrorAndButtonContainer
          errorMessage={errorMessage}
          isError={isError}
          isLoading={isLoading}
          isWarningColor={false}
          maxAmountDisplay={maxAmountDisplay}
          nextButtonDisabled={!canProceed}
          onContinue={onContinue}
          onPressMaxStake={onPressMaxStake}
        />
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}
function EnterStakeAmount({
  aptosPriceInfo,
  navigation,
}: EnterStakeAmountProps) {
  const styles = useStyles();
  const { aptosCoin } = useCoinDisplay();
  const isKeyboardShown = useIsKeyboardShown();

  const [currencyMode, setCurrencyMode] = useState<'apt' | 'usd'>('apt');
  const [aptRawString, setAptRawString] = useState('');
  const [currencyRawString, setCurrencyRawString] = useState('');

  const aptInputRef = useRef<TextInput>(null);
  const currencyInputRef = useRef<TextInput>(null);

  const {
    debouncedAmount,
    isAmountDebouncing,
    isBalanceEnough,
    isBalanceMinusGasFeeEnough,
    isLoading,
    metMinimumStakeAmount,
    totalBalanceMinus3xGas,
  } = useStakeAmount(aptRawString);

  const { fiatDollarValue } = aptosCoin;

  const errorMessage = useMemo(() => {
    if (isAmountDebouncing || aptRawString.length === 0) return undefined;
    if (!isBalanceMinusGasFeeEnough) {
      return i18nmock('stake:amountInput.insufficientBalance');
    }
    if (!isBalanceEnough) {
      return i18nmock('stake:amountInput.insufficientBalanceAndFee');
    }
    if (!metMinimumStakeAmount) {
      return i18nmock('stake:amountInput.lessThanMinimumAmount').replaceAll(
        '{MIN_AMOUNT}',
        currencyMode === 'apt'
          ? '11 APT'
          : `$${
              aptosPriceInfo &&
              computeFiatDollarValue(
                aptosPriceInfo.currentPrice,
                aptosCoin,
                BigInt(11 * OCTA),
              )
            }`,
      );
    }

    return undefined;
  }, [
    aptosCoin,
    aptosPriceInfo,
    aptRawString,
    isAmountDebouncing,
    currencyMode,
    isBalanceEnough,
    isBalanceMinusGasFeeEnough,
    metMinimumStakeAmount,
  ]);

  const onContinue = useCallback(() => {
    if (errorMessage || isAmountDebouncing || aptRawString.length === 0) return;

    navigation.push('StakeFlowSelectPool', {
      amount: debouncedAmount.toString(),
    });
  }, [
    aptRawString,
    debouncedAmount,
    errorMessage,
    isAmountDebouncing,
    navigation,
  ]);

  const isError = !isAmountDebouncing && errorMessage !== undefined;

  const canProceed =
    !isError && !isAmountDebouncing && !isLoading && aptRawString.length > 0;

  const formattedBalance =
    totalBalanceMinus3xGas !== undefined
      ? formatAmount(totalBalanceMinus3xGas, coinInfo, {
          decimals: 4,
          prefix: false,
        })
      : undefined;

  const maxAmountDisplay = useMemo(() => {
    const formattedDisplay = formattedBalance ?? '';

    if (currencyMode === 'usd') {
      const numberParts = getAmountIntegralFractional(fiatDollarValue);

      if (!numberParts) return '';
      return `$${formatSplitNumber(numberParts)}`;
    }

    return formattedDisplay;
  }, [currencyMode, fiatDollarValue, formattedBalance]);

  const onPressMaxStake = () => {
    const newAptRawString = generateStringFromBigInt(totalBalanceMinus3xGas);
    const newCurrencyRawString = calculateCurrencyStringFromApt(
      aptosPriceInfo,
      newAptRawString,
    );
    setAptRawString(newAptRawString);
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
  // Just in case autofocus does not work as intended
  const onInputPress = () => {
    if (!isKeyboardShown()) {
      if (aptInputRef.current?.isFocused()) {
        aptInputRef.current?.blur();
      }
      aptInputRef.current?.focus();
    }
  };

  // The `autoFocus` property only focuses on mounting.
  // Listening to the `focus` event allows the keyboard to show when navigating back.
  // Note: doesn't work on Android, so as a fallback we still set the `autoFocus` property
  useEffect(() => {
    const onFocus = () => {
      aptInputRef.current?.focus();
      // make sure to also set the currencyMode
      setCurrencyMode('apt');
    };

    const onBlur = () => {
      aptInputRef.current?.blur();
    };

    navigation.addListener('focus', onFocus);
    navigation.addListener('blur', onBlur);
    return () => {
      navigation.removeListener('focus', onFocus);
      navigation.removeListener('blur', onBlur);
    };
  }, [navigation]);

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
          isError={isError}
          isWarningColor={false}
          onChangeAptText={onChangeAptText}
          onChangeCurrencyText={onChangeCurrencyText}
          onInputPress={onInputPress}
        />
        <ErrorAndButtonContainer
          errorMessage={errorMessage}
          isError={isError}
          isLoading={isLoading}
          isWarningColor={false}
          maxAmountDisplay={maxAmountDisplay}
          nextButtonDisabled={!canProceed}
          onContinue={onContinue}
          onPressMaxStake={onPressMaxStake}
        />
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}

export default function EnterStakeAmountContainer({
  navigation,
}: EnterStakeAmountContainerProps) {
  const { aptosPriceInfo } = useCoinGecko();

  if (
    aptosPriceInfo === null ||
    aptosPriceInfo === undefined ||
    !isValidPrice(aptosPriceInfo?.currentPrice)
  ) {
    return <EnterStakeAmountSimplified navigation={navigation} />;
  }

  return (
    <EnterStakeAmount aptosPriceInfo={aptosPriceInfo} navigation={navigation} />
  );
}

const useStyles = makeStyles((theme) => ({
  bottomInfoContainer: {
    gap: 12,
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
  errorMessageContainer: {
    minHeight: 30,
  },
  errorMessageRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: PADDING.container,
  },
  keyboard: { flex: 1 },
  mainContent: {
    flex: 1,
    paddingHorizontal: 48,
  },
  mainContentContainer: {
    flex: 1,
    height: '100%',
  },
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
  textContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
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
