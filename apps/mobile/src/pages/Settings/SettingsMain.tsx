// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Alert, Image, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import PetraAccountHeader from 'core/components/PetraAccountHeader';
import { i18nmock } from 'strings';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import {
  useActiveAccount,
  useUnlockedAccounts,
} from '@petra/core/hooks/useAccounts';
import PetraAlert from 'core/components/PetraAlert';
import { addressDisplay } from 'shared/utils';
import { removeAccountIcon } from 'shared/assets/images';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import makeStyles from 'core/utils/makeStyles';
import { testProps } from 'e2e/config/testProps';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { removeAccountEvents } from '@petra/core/utils/analytics/events';
import { useAlertModalContext } from 'core/providers/AlertModalProvider';
import SettingsList from './SettingsList';

interface RemoveAccountModalProps {
  onClose: () => void;
  visible: boolean;
}

function RemoveAccountModal({ onClose, visible }: RemoveAccountModalProps) {
  const styles = useStyles();
  const { activeAccountAddress } = useActiveAccount();
  const { dismissAlertModal } = useAlertModalContext();
  const { removeAccounts } = useUnlockedAccounts();
  const { trackEvent } = useTrackEvent();

  const handleRemoveAccount = async () => {
    try {
      // try to remove the account
      await removeAccounts([activeAccountAddress]);
      // close the modal if successful
      void trackEvent({
        eventType: removeAccountEvents.REMOVE_ACCOUNT,
      });
      onClose();
    } catch {
      void trackEvent({
        eventType: removeAccountEvents.ERROR_REMOVE_ACCOUNT,
      });
      // if account removal fails, close the modal so they can try again.
      // let them know something went wrong
      onClose();
      Alert.alert(
        i18nmock('settings:removeAccount.error.title'),
        i18nmock('settings:removeAccount.error.message'),
      );
    }
  };

  return (
    <PetraAlert
      dismissAlertModal={dismissAlertModal}
      message={i18nmock('settings:removeAccount.message')}
      title={`${i18nmock('general:remove')} ${addressDisplay(
        activeAccountAddress,
        false,
      )}?`}
      visible={visible}
      renderIcon={() => (
        <Image source={removeAccountIcon} style={styles.image} />
      )}
      buttons={[
        {
          onPress: () => onClose(),
          style: 'cancel',
          text: i18nmock('general:cancel'),
        },
        {
          onPress: handleRemoveAccount,
          text: i18nmock('general:remove'),
        },
      ]}
    />
  );
}

function Settings({
  navigation,
}: RootAuthenticatedStackScreenProps<'Settings'>) {
  const styles = useStyles();
  const [removeAccountAlertVisible, setRemoveAccountAlertVisible] =
    useState<boolean>(false);

  const { activeAccount, activeAccountAddress } = useActiveAccount();
  const { showSuccessToast } = usePetraToastContext();

  const handleCopyPress = () => {
    Clipboard.setString(activeAccountAddress);
    showSuccessToast({
      hideOnPress: true,
      text: i18nmock('assets:toast.copyAddress'),
      toastPosition: 'bottom',
    });
  };

  const handleOnPressAccountAddress = () => {
    handleCopyPress();
  };

  const handleRemoveAccountPress = () => {
    setRemoveAccountAlertVisible(true);
  };

  const handleNavigateToRoute = (route: any, params: any = {}) => {
    navigation.navigate(route, params);
  };

  const handleRenderPetraAccountHeader = () => (
    <PetraAccountHeader
      accountName={activeAccount?.name ?? 'Account'}
      accountAddress={activeAccountAddress}
      onPressAccountAddress={handleOnPressAccountAddress}
    />
  );

  return (
    <View style={styles.container} {...testProps('Settings-screen')}>
      <SettingsList
        handleNavigateToRoute={handleNavigateToRoute}
        handleRemoveAccount={handleRemoveAccountPress}
        renderPetraHeader={handleRenderPetraAccountHeader}
      />
      <RemoveAccountModal
        visible={removeAccountAlertVisible}
        onClose={() => setRemoveAccountAlertVisible(false)}
      />
    </View>
  );
}

export default Settings;

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  image: {
    height: 200,
    width: 200,
  },
  popoverContainer: {
    borderRadius: 8,
    minWidth: 214,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowOffset: {
      height: 4,
      width: 4,
    },
  },
}));
