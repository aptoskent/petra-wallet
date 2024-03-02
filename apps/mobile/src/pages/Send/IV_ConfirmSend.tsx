// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import RefetchInterval from '@petra/core/hooks/constants';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import useTransactions from '@petra/core/hooks/useTransactions';
import { useAccountExists } from '@petra/core/queries/account';
import {
  maxGasFeeFromEstimated,
  TransactionOptions,
} from '@petra/core/transactions';
import { OnChainTransaction } from '@petra/core/types';
import { formatAmount, formatCoin } from '@petra/core/utils/coin';
import collapseHexString from '@petra/core/utils/hex';
import { BlurView } from '@react-native-community/blur';
import { Header } from '@react-navigation/stack';
import {
  AccountAvatar,
  PetraPillButton,
  PillButtonDesign,
} from 'core/components';
import Typography from 'core/components/Typography';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import InfoCard from 'pages/Send/components/InfoCard';
import { CoinInfoWithMetadata } from 'pages/Send/hooks/useAccountCoinResources';
import React, { useMemo, useRef, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addressDisplay, DROP_SHADOW, HIT_SLOPS } from 'shared';
import { AlertIconSVG, ArrowDown } from 'shared/assets/svgs';
import { i18nmock } from 'strings';
import { Contact } from 'core/hooks/useRecentContacts';
import makeStyles from 'core/utils/makeStyles';
import BlurOverlay from 'core/components/BlurOverlay';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { coinEvents } from '@petra/core/utils/analytics/events';
import useCoinTransferPayload from './hooks/useCoinTransferPayload';
import useTransactionSimulation from './hooks/useTransactionSimulation';
import CoinIcon from './components/CoinIcon';

// region SendCard

interface SendCardProps {
  amount: bigint;
  coinInfo: CoinInfoWithMetadata;
  contact: Contact;
}

function SendCard({ amount, coinInfo, contact }: SendCardProps): JSX.Element {
  const styles = useStyles();
  const formattedAmount = formatAmount(amount, coinInfo, {
    prefix: false,
  });

  const formattedAddress = collapseHexString(contact.address, 8);

  return (
    <View style={[styles.topCard, DROP_SHADOW.default]}>
      <View style={styles.blockInfo}>
        <View style={styles.coinInfo}>
          <CoinIcon coin={coinInfo} />
          <Typography color="navy.900" style={styles.coinName}>
            {coinInfo.name}
          </Typography>
        </View>
        <View style={styles.coinValues}>
          <View style={styles.coinQuantity}>
            <Typography
              color="navy.900"
              weight="600"
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {formattedAmount}
            </Typography>
          </View>
          {/* <Typography color="navy.600" style={{ lineHeight: 20 }}>
            $11.24
          </Typography> */}
        </View>
      </View>
      <View style={styles.arrowIconContainer}>
        <ArrowDown color="navy.300" />
      </View>
      <View style={styles.blockInfo}>
        <View style={styles.coinInfo}>
          <AccountAvatar accountAddress={contact.address} size={48} />
          <View style={{ marginLeft: 12 }}>
            <Typography color="navy.900" weight="600">
              {contact.name ? contact.name : formattedAddress}
            </Typography>
            {contact.name ? (
              <Typography color="navy.500">{formattedAddress}</Typography>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

// endregion

// region TransactionDetails

interface TransactionDetailsRowProps {
  onShowDetails?: () => void;
  text: string;
  value?: string;
}

function TransactionDetailsRow({
  onShowDetails,
  text,
  value,
}: TransactionDetailsRowProps) {
  const styles = useStyles();
  return (
    <View style={styles.detailsRow}>
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <Typography color="navy.500" style={{ paddingRight: 4 }}>
          {text}
        </Typography>
        {onShowDetails !== undefined ? (
          <TouchableOpacity
            onPress={onShowDetails}
            hitSlop={HIT_SLOPS.smallSlop}
          >
            <AlertIconSVG size={16} color="navy.300" />
          </TouchableOpacity>
        ) : null}
      </View>
      <Typography color="navy.900" style={{ fontWeight: '600' }}>
        {value}
      </Typography>
    </View>
  );
}

interface TransactionDetailsProps {
  simulation?: OnChainTransaction;
}

function TransactionDetails({ simulation }: TransactionDetailsProps) {
  const styles = useStyles();
  const { activeAccountAddress } = useActiveAccount();
  const { activeNetworkName } = useNetworks();

  const gasFee = useMemo(() => {
    if (simulation) {
      return formatCoin(simulation.gasFee * simulation.gasUnitPrice, {
        decimals: 8,
      });
    }
    return undefined;
  }, [simulation]);

  const onShowNetworkFeeInfo = () => {
    Alert.alert(
      i18nmock('assets:sendFlow.transactionDetails.networkFee'),
      i18nmock('assets:sendFlow.transactionDetails.networkFeeInfo'),
    );
  };

  // TODO: up for discussion whether we should show total cost
  // const onShowTotalCostInfo = () => {
  //   Alert.alert(
  //     i18nmock('assets:sendFlow.transactionDetails.totalCost'),
  //     i18nmock('assets:sendFlow.transactionDetails.totalCostInfo'),
  //   );
  // };

  // TODO: this will cause problems if bigint is not supported
  // const totalCost = gasFee ? amount + gasFee : undefined;
  // const totalCostFormatted =

  return (
    <View style={styles.detailsContainer}>
      <TransactionDetailsRow
        text={i18nmock('assets:sendFlow.transactionDetails.addressUsed')}
        value={addressDisplay(activeAccountAddress, false)}
      />
      <TransactionDetailsRow
        text={i18nmock('assets:sendFlow.transactionDetails.network')}
        value={activeNetworkName}
      />
      <TransactionDetailsRow
        text={i18nmock('assets:sendFlow.transactionDetails.networkFee')}
        value={gasFee}
        onShowDetails={onShowNetworkFeeInfo}
      />
      {/* <TransactionDetailsRow
        text={i18nmock('assets:sendFlow.transactionDetails.totalCost')}
        value={totalCost}
        onShowDetails={onShowTotalCostInfo}
      /> */}
      {/* <View style={styles.totalCostFiatContainer}>
        <Text style={styles.secondaryText}>{totalCostFiat}</Text>
       </View> */}
    </View>
  );
}

// endregion

type ConfirmSendProps = RootAuthenticatedStackScreenProps<'SendFlow4'>;

export default function ConfirmSend({ navigation, route }: ConfirmSendProps) {
  const styles = useStyles();
  const { amount, coinInfo, contact } = route.params;
  const safeAreaInsets = useSafeAreaInsets();
  const { trackEvent } = useTrackEvent();

  // Big ints cannot be serialized as route params, deserializing here
  const amountNumeric = BigInt(amount);

  // region Simulation

  const doesRecipientExist = useAccountExists({ address: contact.address });

  const payload = useCoinTransferPayload(
    contact.address,
    amountNumeric,
    coinInfo.type,
    doesRecipientExist.data,
  );

  const txnOptions = useRef<TransactionOptions>({});
  const simulation = useTransactionSimulation(payload, {
    enabled: doesRecipientExist.isSuccess,
    keepPreviousData: true,
    onSuccess: ({ gasFee, gasUnitPrice }) => {
      txnOptions.current.gasUnitPrice = gasUnitPrice;
      txnOptions.current.maxGasAmount = maxGasFeeFromEstimated(gasFee);
    },
    refetchInterval: RefetchInterval.STANDARD,
  });

  // endregion

  const { buildRawTransaction, signTransaction, submitTransaction } =
    useTransactions();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const onConfirm = async () => {
    if (payload === undefined) {
      return;
    }

    // Apply blur wrapper to header while submitting
    navigation.setOptions({
      gestureEnabled: false,
      header: (props) => (
        <View>
          <BlurView
            style={styles.headerBlur}
            blurType="xlight"
            blurAmount={1}
          />
          <Header {...props} />
        </View>
      ),
    });

    setIsSubmitting(true);
    let startTransactionTime = 0;
    let endTransactionTime = 0;
    try {
      const rawTxn = await buildRawTransaction(payload, txnOptions.current);
      const signedTxn = await signTransaction(rawTxn);
      startTransactionTime = new Date().getTime();
      await submitTransaction(signedTxn);
      endTransactionTime = new Date().getTime();
      if (coinInfo.type === '0x1::aptos_coin::AptosCoin') {
        void trackEvent({
          eventType: coinEvents.TRANSFER_APTOS_COIN,
          params: {
            transactionDurationShown: `${
              endTransactionTime - startTransactionTime
            }`,
          },
        });
      } else {
        void trackEvent({
          eventType: coinEvents.TRANSFER_COIN,
          params: {
            transactionDurationShown: `${
              endTransactionTime - startTransactionTime
            }`,
          },
        });
      }
    } catch (err) {
      const errMessage =
        err instanceof Error ? err.message : JSON.stringify(err);
      Alert.alert('Transaction error', errMessage);
      if (coinInfo.type === '0x1::aptos_coin::AptosCoin') {
        void trackEvent({
          eventType: coinEvents.ERROR_TRANSFER_APTOS_COIN,
        });
      } else {
        void trackEvent({
          eventType: coinEvents.ERROR_TRANSFER_COIN,
        });
      }
      return;
    } finally {
      setIsSubmitting(false);
      // Reset header implementation
      navigation.setOptions({
        gestureEnabled: undefined,
        header: undefined,
      });
    }

    navigation.navigate('SendFlow5', {
      amount,
      coinInfo,
      transactionDuration: endTransactionTime - startTransactionTime,
      usdAmount: 0,
    });
  };

  const onCancel = () => {
    Alert.alert(
      i18nmock('assets:sendFlow.cancelTransaction.title'),
      i18nmock('assets:sendFlow.cancelTransaction.subtext'),
      [
        {
          onPress: () => {}, // do nothing,
          style: 'cancel',
          text: i18nmock('assets:sendFlow.cancelTransaction.abortCancel'),
        },
        {
          onPress: () => navigation.popToTop(),
          style: 'destructive',
          text: i18nmock('assets:sendFlow.cancelTransaction.confirmCancel'),
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  let errorMessage: string | undefined;
  if (simulation.isError) {
    if (simulation.error instanceof Error) {
      errorMessage = simulation.error.message;
    } else {
      errorMessage = JSON.stringify(simulation.error);
    }
  } else if (simulation.isSuccess && simulation.data.error !== undefined) {
    errorMessage = simulation.data.error.description;
  }

  return (
    <View style={styles.container}>
      {isSubmitting ? <BlurOverlay /> : null}
      <SendCard contact={contact} amount={amountNumeric} coinInfo={coinInfo} />
      <TransactionDetails simulation={simulation.data} />

      {!doesRecipientExist.data ? (
        <InfoCard
          type="warning"
          title={i18nmock('send:confirmation.newAccountWarningTitle')}
          content={i18nmock('send:confirmation.newAccountWarningText')}
          style={{ margin: 16 }}
        />
      ) : null}

      {errorMessage !== undefined ? (
        <InfoCard
          type="error"
          title="Simulation error"
          content={errorMessage}
          style={{ margin: 16 }}
        />
      ) : null}

      <View
        style={[
          styles.buttonsContainer,
          { marginBottom: safeAreaInsets.bottom },
        ]}
      >
        <PetraPillButton
          buttonDesign={PillButtonDesign.clearWithDarkText}
          containerStyleOverride={{ flex: 1 }}
          onPress={onCancel}
          text={i18nmock('general:cancel')}
        />
        <PetraPillButton
          disabled={!simulation.data?.success}
          buttonDesign={PillButtonDesign.default}
          containerStyleOverride={{ flex: 1, marginLeft: 8 }}
          onPress={onConfirm}
          text={i18nmock('general:confirm')}
        />
      </View>
    </View>
  );
}

const iconSize = 48;
const useStyles = makeStyles((theme) => ({
  arrowIconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    width: iconSize,
  },
  blockInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 72,
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  coinInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  coinName: {
    fontWeight: '600',
    marginLeft: 12,
  },
  coinQuantity: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  coinValues: {
    alignItems: 'flex-end',
    flexDirection: 'column',
    flexShrink: 1,
    justifyContent: 'center',
    marginLeft: 12,
  },
  container: {
    alignItems: 'stretch',
    backgroundColor: theme.background.secondary,
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
    width: '100%',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerBlur: {
    alignItems: 'center',
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 3,
  },
  topCard: {
    backgroundColor: theme.background.secondary,
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  totalCostFiatContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
}));
