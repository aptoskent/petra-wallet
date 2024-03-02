// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useUnlockedAccounts } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { AptosAccount, HexString } from 'aptos';
import { useAlertModalContext } from 'core/providers/AlertModalProvider';
import { useDeeplink } from 'core/providers/DeeplinkProvider';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import { lookUpAndAddAccount } from 'core/utils';
import { useCallback, useEffect, useState } from 'react';
import { i18nmock } from 'strings';
import { deeplinkEvents } from '@petra/core/utils/analytics/events';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { getRenfieldContent } from './PetraAlertModalContent';

function DeeplinkRedirectRenfieldHandler() {
  const { deeplink, setDeeplink } = useDeeplink();
  const { trackEvent } = useTrackEvent();
  const { dismissAlertModal, modalAlertVisible, showAlertModal } =
    useAlertModalContext();

  const { addAccount } = useUnlockedAccounts();
  const { aptosClient } = useNetworks();
  const { showSuccessToast, showWarningToast } = usePetraToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const renfieldOkAction = useCallback(
    (key: string) =>
      lookUpAndAddAccount({
        accountName: 'Renfield',
        addAccount,
        aptosAccount: new AptosAccount(new HexString(key).toUint8Array()),
        aptosClient,
      })
        .then(() => {
          // DON'T EVER ADD ADDITIONAL PARAMS - RENFIELD DEEPLINKS CONTAIN PRIVATE KEYS.
          void trackEvent({
            eventType: deeplinkEvents.REDIRECT_RENFIELD,
          });
          showSuccessToast({
            hideOnPress: true,
            text: i18nmock('general:renfield.success'),
            toastPosition: 'bottom',
          });
        })
        .catch((e) => {
          void trackEvent({
            eventType: deeplinkEvents.ERROR_REDIRECT_RENFIELD,
          });
          showWarningToast({
            hideOnPress: true,
            text: e.message,
            toastPosition: 'bottom',
          });
        }),
    [addAccount, aptosClient, showSuccessToast, showWarningToast, trackEvent],
  );

  useEffect(() => {
    const onPress = async () => {
      if (deeplink?.renfield?.privateKey) {
        await setIsLoading(true);
        await renfieldOkAction(deeplink.renfield.privateKey);
        setIsLoading(false);
        setDeeplink(undefined);
      }
      dismissAlertModal();
    };
    const onCancel = () => {
      dismissAlertModal();
      setDeeplink(undefined);
    };
    if (deeplink?.renfield?.privateKey) {
      showAlertModal(getRenfieldContent({ isLoading, onCancel, onPress }));
    }
  }, [
    deeplink?.renfield?.privateKey,
    modalAlertVisible,
    isLoading,
    setDeeplink,
    showAlertModal,
    renfieldOkAction,
    dismissAlertModal,
  ]);
  return null;
}

export default DeeplinkRedirectRenfieldHandler;
