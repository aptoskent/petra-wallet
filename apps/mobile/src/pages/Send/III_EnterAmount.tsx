// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import RefetchInterval from '@petra/core/hooks/constants';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useDebounce from '@petra/core/hooks/useDebounce';
import { useAccountExists } from '@petra/core/queries/account';
import { formatAmount, formatCoin } from '@petra/core/utils/coin';
import collapseHexString from '@petra/core/utils/hex';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import Typography from 'core/components/Typography';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AlertOctagonFillIcon from 'shared/assets/svgs/alert_octagon_fill_icon';
import AlertTriangleFillIcon from 'shared/assets/svgs/alert_triangle_fill_icon';
import { i18nmock } from 'strings';
import makeStyles from 'core/utils/makeStyles';
import { PADDING, isShortScreen } from 'shared/constants';
import BottomSafeAreaView from '../../core/components/BottomSafeAreaView';
import CoinAmountInput from './components/CoinAmountInput';
import { useAccountCoinResources } from './hooks/useAccountCoinResources';
import useCoinTransferPayload from './hooks/useCoinTransferPayload';
import useTransactionSimulation from './hooks/useTransactionSimulation';

type EnterAmountProps = RootAuthenticatedStackScreenProps<'SendFlow3'>;

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

export default function EnterAmount({ navigation, route }: EnterAmountProps) {
  const styles = useStyles();
  const { coinInfo, contact } = route.params;
  const [amount, setAmount] = useState<bigint>(BigInt(0));

  const doesRecipientExist = useAccountExists({ address: contact.address });
  const balance = useCoinBalance(coinInfo.type);
  const isBalanceEnough = (balance ?? 0) > amount;

  // Debounce amount to prevent unnecessary simulation requests
  const { debouncedValue: debouncedAmount, isLoading: isDebouncing } =
    useDebounce(amount);
  const payload = useCoinTransferPayload(
    contact.address,
    debouncedAmount,
    coinInfo.type,
    doesRecipientExist.data,
  );

  const debouncedIsBalanceEnough = (balance ?? 0) > debouncedAmount;
  const simulation = useTransactionSimulation(payload, {
    enabled: doesRecipientExist.isSuccess && debouncedIsBalanceEnough,
    keepPreviousData: true,
    refetchInterval: RefetchInterval.STANDARD,
  });

  // region UI variables

  const onContinue = () => {
    if (!canProceed) {
      return;
    }
    navigation.navigate('SendFlow4', {
      amount: amount.toString(),
      coinInfo: route.params.coinInfo,
      contact: route.params.contact,
      txnOptions: {},
    });
  };

  const collapsedRecipientAddress = collapseHexString(contact.address, 8);
  const isNewAccount = doesRecipientExist.data === false;

  const amountColor =
    amount > BigInt(0) ? customColors.navy['900'] : customColors.navy['400'];
  const formattedGasFee = formatCoin(simulation.data?.gasFee ?? 0);

  let errorMessage: string | undefined;
  if (!isBalanceEnough) {
    errorMessage = i18nmock('send:amountInput.insufficientBalance');
  } else if (simulation.isError) {
    if (simulation.error instanceof Error) {
      errorMessage = simulation.error.message;
    } else {
      errorMessage = JSON.stringify(simulation.error);
    }
  } else if (simulation.isSuccess && simulation.data.error !== undefined) {
    errorMessage = simulation.data.error.description;
  }
  const isError = errorMessage !== undefined;

  const formattedBalance =
    balance !== undefined
      ? formatAmount(balance, coinInfo, {
          decimals: 4,
          prefix: false,
        })
      : undefined;

  const canProceed =
    amount > BigInt(0) && !isDebouncing && !isError && simulation.data?.success;

  // endregion

  return (
    <BottomSafeAreaView style={styles.container}>
      <PetraKeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.topInfoContainer}>
          <View style={styles.infoContainerRow}>
            <Typography color="navy.600" weight="600">
              {i18nmock('general:to')}
            </Typography>
            <Typography
              color="navy.900"
              weight="600"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ flex: 1 }}
            >
              &nbsp;
              {contact.name ?? collapsedRecipientAddress}
              {contact.name ? (
                <Typography color="navy.500">{` (${collapsedRecipientAddress})`}</Typography>
              ) : null}
            </Typography>
          </View>
          {isNewAccount ? (
            <View style={[styles.infoContainerRow, { marginTop: 8 }]}>
              <AlertTriangleFillIcon size={24} color="orange.600" />
              <Typography
                color="orange.600"
                weight="600"
                style={{ marginLeft: 8 }}
              >
                {i18nmock('send:amountInput.newAccountInfo')}
              </Typography>
            </View>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          {/* Wrapper required to make keyboard animation smooth */}
          <View style={{ alignItems: 'center' }}>
            <CoinAmountInput
              color={isError ? 'red.500' : amountColor}
              coinInfo={coinInfo}
              onChange={setAmount}
              onSubmit={onContinue}
            />
            <Typography
              color={isError ? 'red.500' : amountColor}
              variant={isShortScreen ? 'small' : 'body'}
              style={{ fontWeight: '600', marginTop: isShortScreen ? 0 : 4 }}
            >
              {`${i18nmock('general:fees')}: ${formattedGasFee}`}
            </Typography>
          </View>
        </View>

        <View style={styles.bottomInfoContainer}>
          {errorMessage !== undefined ? (
            <View style={styles.infoContainerRow}>
              <AlertOctagonFillIcon
                size={isShortScreen ? 12 : 24}
                color="red.500"
              />
              <Typography
                color="red.500"
                weight="600"
                style={{ marginLeft: 8 }}
                variant={isShortScreen ? 'small' : 'body'}
              >
                {errorMessage}
              </Typography>
            </View>
          ) : null}
          <View
            style={[
              styles.infoContainerRow,
              { marginTop: isShortScreen ? 0 : 8 },
            ]}
          >
            <Typography
              color={isError ? 'red.500' : 'navy.900'}
              variant={isShortScreen ? 'small' : 'body'}
            >
              {`${i18nmock('general:balance')} ${formattedBalance ?? ''}`}
            </Typography>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PetraPillButton
            disabled={!canProceed}
            buttonDesign={PillButtonDesign.default}
            onPress={onContinue}
            text={i18nmock('assets:send')}
          />
        </View>
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  bottomInfoContainer: {
    justifyContent: 'flex-end',
    minHeight: 22,
    padding: PADDING.container,
    paddingVertical: isShortScreen ? 4 : 16,
  },
  buttonContainer: {
    borderTopColor: customColors.navy['200'],
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: PADDING.container,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
  },
  infoContainerRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  topInfoContainer: {
    justifyContent: 'flex-start',
    minHeight: 22,
    padding: PADDING.container,
    paddingVertical: isShortScreen ? 4 : 16,
  },
}));
