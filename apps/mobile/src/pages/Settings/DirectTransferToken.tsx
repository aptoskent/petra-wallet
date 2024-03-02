// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { View, Switch, Text, ActivityIndicator } from 'react-native';
import { customColors } from '@petra/core/colors';
import useTokenStoreResource, {
  getTokenStoreResourceQueryKey,
} from '@petra/core/queries/useTokenStoreResource';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { useTransactionSimulation } from '@petra/core/queries/transaction';
import useOptInToTokenDirectTransfer, {
  optInDirectTransferSimulationQueryKey,
  buildOptInDirectTransferPayload,
} from '@petra/core/mutations/directTransfer';
import { formatCoin } from '@petra/core/utils/coin';
import { maxGasFeeFromEstimated } from '@petra/core/transactions';
import { simulationRefetchInterval } from '@petra/core/constants';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import collapseHexString from '@petra/core/utils/hex';
import { useQueryClient } from 'react-query';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';
import { PillButtonDesign } from 'core/components';
import InfoIconSVG from 'shared/assets/svgs/info_icon';
import AlertTriangleIconSVG from 'shared/assets/svgs/alert_triangle_icon';
import { AlertIconSVG } from 'shared/assets/svgs';
import NFTIconSVG from 'shared/assets/svgs/nft_icon';
import {
  PetraBottomSheet,
  PetraBottomSheetBlurOverlay,
  PetraBottomSheetContent,
  PetraBottomSheetFooter,
  PetraBottomSheetHeader,
} from 'core/components/PetraBottomSheet';
import PetraPillButton from 'core/components/PetraPillButton';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import makeStyles from 'core/utils/makeStyles';
import Typography from 'core/components/Typography';
import Device from '../../util/device';

const iconSize = 48;

function ErrorState({ error }: any) {
  const styles = useStyles();
  const errorDetails = useMemo(() => {
    switch (error.errorCode) {
      case 'account_not_found':
        return {
          body: i18nmock('settings:directTransferToken.accountNotFound.body'),
          icon: <InfoIconSVG color={customColors.navy['900']} />,
          label: i18nmock('settings:directTransferToken.accountNotFound.label'),
          styles: {
            backgroundColor: customColors.navy['100'],
            color: customColors.navy['900'],
          },
        };
      default:
        return {
          body: i18nmock(
            'settings:directTransferToken.failedToFetchUserOnChainData.body',
          ),
          icon: <AlertTriangleIconSVG color={customColors.orange['600']} />,
          label: i18nmock(
            'settings:directTransferToken.failedToFetchUserOnChainData.label',
          ),
          styles: {
            backgroundColor: customColors.orange['100'],
            color: customColors.navy['900'],
          },
        };
    }
  }, [error]);

  return (
    <View style={[styles.messageContainer, errorDetails.styles]}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>{errorDetails.icon}</View>
        <Typography style={{ ...errorDetails.styles }} weight="600">
          {errorDetails.label}
        </Typography>
      </View>
      <Typography
        variant="small"
        style={{
          marginTop: 4,
          ...errorDetails.styles,
        }}
      >
        {errorDetails.body}
      </Typography>
    </View>
  );
}

function DirectTransferInfo() {
  const styles = useStyles();
  const tokenStoreQuery = useTokenStoreResource();

  if (tokenStoreQuery.isError) {
    return <ErrorState error={tokenStoreQuery.error} />;
  }

  if (tokenStoreQuery.isLoading) {
    return null;
  }

  return (
    <View style={styles.directTransferInfoContainer}>
      <Text style={styles.directTransferInfoText}>
        {i18nmock('settings:directTransferToken.description')}
      </Text>
    </View>
  );
}

interface DirectTransferTokenModalProps {
  modalRef: RefObject<BottomSheetModal>;
  setIsDirectTransferEnabled: (isEnabled: boolean) => void;
  targetValue: boolean;
}

function DirectTransferTokenModal({
  modalRef,
  setIsDirectTransferEnabled,
  targetValue,
}: DirectTransferTokenModalProps) {
  const styles = useStyles();
  const { refetch } = useTokenStoreResource({
    refetchOnMount: true,
  });
  const { activeAccountAddress } = useActiveAccount();
  const { activeNetworkName } = useNetworks();
  const queryClient = useQueryClient();
  const { showDangerToast } = usePetraToastContext();
  const { data: coinBalance } = useAccountOctaCoinBalance(
    activeAccountAddress,
    {
      refetchInterval: simulationRefetchInterval,
    },
  );

  const payload = useMemo(
    () => buildOptInDirectTransferPayload(targetValue),
    [targetValue],
  );

  const simulation = useTransactionSimulation(
    [
      optInDirectTransferSimulationQueryKey,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    payload,
    {
      cacheTime: 0,
      enabled: coinBalance !== undefined,
      refetchInterval: simulationRefetchInterval,
    },
  );

  const optInToTokenDirectTransfer = useOptInToTokenDirectTransfer({
    gasUnitPrice: simulation.data?.gasUnitPrice,
    maxGasAmount: simulation.data?.gasFee
      ? maxGasFeeFromEstimated(simulation.data.gasFee)
      : undefined,
  });

  const gasFee = useMemo(() => {
    if (simulation.isSuccess) {
      return formatCoin(simulation.data.gasFee * simulation.data.gasUnitPrice, {
        decimals: 8,
      });
    }

    if (simulation.isLoading) {
      return <ActivityIndicator size="small" />;
    }

    return i18nmock(
      'settings:directTransferToken.fullModal.unableToEstimateGas',
    );
  }, [simulation]);

  const onConfirmPressed = async () => {
    if (!simulation.isSuccess || !simulation.data.success) {
      return;
    }
    try {
      await optInToTokenDirectTransfer.mutateAsync(targetValue);
      setIsDirectTransferEnabled(targetValue);
    } catch {
      showDangerToast({
        hideOnPress: true,
        text: targetValue
          ? i18nmock('settings:directTransferToken.toast.toggleOn')
          : i18nmock('settings:directTransferToken.toast.toggleOff'),
        toastPosition: 'bottomWithButton',
      });
    } finally {
      await queryClient.invalidateQueries(
        getTokenStoreResourceQueryKey(activeAccountAddress),
      );
      await refetch();
      modalRef.current?.dismiss();
    }
  };

  return (
    <PetraBottomSheet
      modalRef={modalRef}
      isDismissable={
        !optInToTokenDirectTransfer.isLoading &&
        !optInToTokenDirectTransfer.isSuccess
      }
    >
      {optInToTokenDirectTransfer.isLoading ? (
        <PetraBottomSheetBlurOverlay />
      ) : null}
      <PetraBottomSheetHeader showCloseButton>
        {i18nmock('settings:directTransferToken.fullModal.confirm')}
      </PetraBottomSheetHeader>
      <PetraBottomSheetContent contentContainerStyle={styles.contentContainer}>
        <View style={styles.automaticallyReceivedBanner}>
          <View style={styles.nftIcon}>
            <NFTIconSVG />
          </View>
          <Typography variant="body">
            {targetValue
              ? i18nmock('settings:directTransferToken.fullModal.onBannerText')
              : i18nmock(
                  'settings:directTransferToken.fullModal.offBannerText',
                )}
          </Typography>
        </View>
        <View style={[styles.rowContainer, { marginTop: 12 }]}>
          <Typography style={[styles.rowLabel]}>
            {i18nmock('settings:directTransferToken.fullModal.addressUsed')}
          </Typography>
          <Typography weight="600">
            {collapseHexString(activeAccountAddress)}
          </Typography>
        </View>
        <View style={styles.rowContainer}>
          <Typography style={[styles.rowLabel]}>
            {i18nmock('settings:directTransferToken.fullModal.network')}
          </Typography>
          <Typography weight="600">{`Aptos ${activeNetworkName}`}</Typography>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.networkFeeLabel}>
            <Typography style={[styles.rowLabel, { flex: 0, marginRight: 4 }]}>
              {i18nmock('settings:directTransferToken.fullModal.networkFee')}
            </Typography>
            <AlertIconSVG color={customColors.navy['500']} />
          </View>
          <Typography weight="600">{gasFee}</Typography>
        </View>
        <View
          style={[
            styles.messageContainer,
            { backgroundColor: customColors.navy['100'] },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <InfoIconSVG color={customColors.navy['900']} />
            </View>
            <Typography style={styles.infoText} variant="small">
              {i18nmock('settings:directTransferToken.fullModal.infoText')}
            </Typography>
          </View>
        </View>
      </PetraBottomSheetContent>
      <PetraBottomSheetFooter>
        <PetraPillButton
          isLoading={optInToTokenDirectTransfer.isLoading}
          disabled={
            !simulation.isSuccess || optInToTokenDirectTransfer.isLoading
          }
          buttonDesign={PillButtonDesign.default}
          onPress={onConfirmPressed}
          text={i18nmock('settings:directTransferToken.fullModal.confirm')}
        />
      </PetraBottomSheetFooter>
    </PetraBottomSheet>
  );
}

function DirectTransferToken() {
  const styles = useStyles();
  const {
    data: tokenStoreData,
    isError,
    isLoading,
  } = useTokenStoreResource({
    refetchOnMount: true,
  });

  const [isDirectTransferEnabled, setIsDirectTransferEnabled] = useState(false);

  useEffect(() => {
    setIsDirectTransferEnabled(tokenStoreData?.data?.direct_transfer ?? false);
  }, [tokenStoreData?.data?.direct_transfer]);

  const modalRef = useRef<BottomSheetModal>(null);
  const onSwitchPress = () => {
    modalRef.current?.present();
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleDirectTransferContainer}>
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}
        >
          <Typography weight="600" style={{ flex: 1 }}>
            {i18nmock('settings:directTransferToken.label')}
          </Typography>
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Switch
            trackColor={{ false: customColors.blackOpacity.twentyPercent }}
            onChange={onSwitchPress}
            value={isDirectTransferEnabled}
            disabled={isError || isLoading}
          />
        )}
      </View>
      <DirectTransferInfo />
      <DirectTransferTokenModal
        modalRef={modalRef}
        targetValue={!isDirectTransferEnabled}
        setIsDirectTransferEnabled={setIsDirectTransferEnabled}
      />
    </View>
  );
}

export default DirectTransferToken;

const useStyles = makeStyles((theme) => ({
  automaticallyReceivedBanner: {
    alignItems: 'center',
    backgroundColor: theme.background.tertiary,
    borderRadius: 12,
    elevation: 5,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 28,
    shadowColor: Device.isAndroid()
      ? customColors.blackOpacity.thirtyPercent
      : customColors.blackOpacity.tenPercent,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
  },
  blurView: {
    alignItems: 'center',
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  buttonOverride: {
    fontSize: 16,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 24,
    width: '100%',
  },
  contentContainer: {
    backgroundColor: theme.background.secondary,
    flexDirection: 'column',
    flexGrow: 1,
    padding: PADDING.container,
  },
  directTransferInfoContainer: {
    marginTop: 12,
    maxWidth: '75%',
  },
  directTransferInfoText: {
    color: theme.typography.primaryDisabled,
  },
  icon: {
    height: iconSize,
    marginRight: 8,
    resizeMode: 'contain',
    width: iconSize,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    marginRight: 12,
  },
  infoText: { flex: 1 },
  messageContainer: {
    borderRadius: 12,
    marginTop: 16,
    padding: 20,
    width: '100%',
  },
  networkFeeLabel: { alignItems: 'center', flex: 1, flexDirection: 'row' },
  nftIcon: {
    borderRadius: iconSize / 2,
    height: iconSize,
    marginRight: 10,
    width: iconSize,
  },
  row: { flexDirection: 'row' },
  rowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  rowLabel: {
    alignItems: 'center',
    color: customColors.navy['500'],
    flex: 1,
    justifyContent: 'center',
  },
  toggleDirectTransferContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
}));
