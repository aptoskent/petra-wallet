// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable react-hooks/exhaustive-deps */

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { customColors } from '@petra/core/colors';
import { useFlag } from '@petra/core/flags';
import {
  useAccounts,
  useActiveAccount,
  useUnlockedAccounts,
} from '@petra/core/hooks/useAccounts';
import Clipboard from '@react-native-clipboard/clipboard';
import { AccountAvatar } from 'core/components';
import {
  PetraBottomSheet,
  PetraBottomSheetContent,
  PetraBottomSheetHeader,
} from 'core/components/PetraBottomSheet';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import makeStyles from 'core/utils/makeStyles';
import { testProps } from 'e2e/config/testProps';
import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { HIT_SLOPS, addressDisplay } from 'shared';
import { ChevronDownIconSVG } from 'shared/assets/svgs';
import { i18nmock } from 'strings';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { switchAccountEvents } from '@petra/core/utils/analytics/events';
import AccountModalBody from './BottomModalBody/AccountModalBody';
import ScanQrCodeButton from './ScanQRCodeButton';

interface PetraHeaderProps {
  action?: JSX.Element;
  navigation: any;
}

const windowWidth = Dimensions.get('window').width;
const avatarDimensions = 32;

export default function PetraHeader({
  action,
  navigation,
}: PetraHeaderProps): JSX.Element {
  const isQrSupportEnabled = useFlag('qr-support');
  const styles = useStyles();
  const [isSwitchingAccount, setIsSwitchingAccount] =
    React.useState<boolean>(false);
  const { accounts } = useAccounts();
  const { activeAccount, activeAccountAddress } = useActiveAccount();
  const { switchAccount } = useUnlockedAccounts();
  const { showDangerToast, showToast } = usePetraToastContext();
  const { trackEvent } = useTrackEvent();
  const accountName = activeAccount?.name ?? 'Account';
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOnPressAccountAddress = () => {
    Clipboard.setString(activeAccountAddress);
    showToast({
      hideOnPress: true,
      text: i18nmock('assets:toast.copyAddress'),
      toastPosition: 'bottomWithButton',
    });
  };

  useEffect(() => {
    setIsSwitchingAccount(false);
    bottomSheetRef.current?.dismiss();
  }, [activeAccountAddress]);

  const handleUpdateActiveAccount = useCallback(
    async (address: string) => {
      setIsSwitchingAccount(true);
      try {
        await switchAccount(address);
        void trackEvent({
          eventType: switchAccountEvents.SWITCH_ACCOUNT,
        });
      } catch {
        showDangerToast({
          hideOnPress: true,
          text: i18nmock('assets:toast.failedSwitchAccount'),
          toastPosition: 'bottomWithButton',
        });
        void trackEvent({
          eventType: switchAccountEvents.ERROR_SWITCHING_ACCOUNT,
        });
      }
    },
    [showDangerToast, switchAccount],
  );

  const handleNavigateToAddAccount = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    navigation.navigate('AddAccountOptions');
  }, [navigation]);

  const handleOnPressAccount = () => {
    bottomSheetRef.current?.present();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingLeft}>
        <TouchableOpacity
          onPress={handleOnPressAccount}
          hitSlop={HIT_SLOPS.smallSlop}
          style={styles.accountButtonContainer}
          {...testProps('button-account-header')}
        >
          <AccountAvatar
            accountAddress={activeAccountAddress}
            size={avatarDimensions}
          />
          <View style={styles.nameTextContainer}>
            <Text numberOfLines={1} style={styles.headerAccountNameText}>
              {accountName}
            </Text>
          </View>
          <View>
            <ChevronDownIconSVG color={customColors.navy['500']} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOnPressAccountAddress}
          hitSlop={HIT_SLOPS.smallSlop}
          style={styles.addressContainer}
        >
          <Text
            style={styles.addressText}
            numberOfLines={1}
            ellipsizeMode="middle"
            {...testProps('assets-address')}
          >
            {addressDisplay(activeAccountAddress)}
          </Text>
        </TouchableOpacity>
      </View>
      {action ? (
        <View style={styles.headingRight}>
          {isQrSupportEnabled ? (
            <ScanQrCodeButton style={styles.iconSpacing} />
          ) : null}
          {action}
        </View>
      ) : null}
      <PetraBottomSheet modalRef={bottomSheetRef}>
        <PetraBottomSheetHeader>
          {i18nmock('assets:accounts')}
        </PetraBottomSheetHeader>
        <PetraBottomSheetContent>
          <AccountModalBody
            accounts={accounts}
            activeAccount={activeAccount}
            handleBottomRowPress={handleNavigateToAddAccount}
            handleOnPress={handleUpdateActiveAccount}
            isAddAccount
            isSwitchingAccount={isSwitchingAccount}
          />
        </PetraBottomSheetContent>
      </PetraBottomSheet>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  accountButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: '80%',
    minWidth: '30%',
  },
  accountNameText: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    marginRight: 10,
  },
  accountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    paddingLeft: 16,
    width: '100%',
  },
  addressContainer: {
    flex: 2,
    width: '100%',
  },
  addressText: {
    color: customColors.navy['600'],
    fontSize: 14,
    fontWeight: '500',
    width: '100%',
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Math.floor(windowWidth * 0.9),
  },
  gearButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerAccountNameText: {
    color: customColors.navy['900'],
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  headingLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  headingRight: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 24,
  },
  iconSpacing: {
    marginHorizontal: 12,
  },
  nameTextContainer: { maxWidth: '70%' },
}));
