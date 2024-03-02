// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import checkVersion from 'react-native-store-version';
import { useEffect } from 'react';
import useFlag from '@petra/core/flags/useFlag';
import DeviceInfo from 'react-native-device-info';
import { APPSTORE_LINK, PLAYSTORE_LINK } from 'shared/constants';
import { useAlertModalContext } from 'core/providers/AlertModalProvider';
import { getForceUpdateModalContent } from './PetraAlertModalContent';

export default function ForceUpdate() {
  const forceUpdateFlag = useFlag('force-update');
  const { showAlertModal } = useAlertModalContext();
  useEffect(() => {
    const init = async () => {
      try {
        const check = await checkVersion({
          androidStoreURL: PLAYSTORE_LINK,
          country: 'us',
          iosStoreURL: APPSTORE_LINK,
          version: DeviceInfo.getVersion(), // app local version
        });
        if (check.result === 'new') {
          // if app store version is new, show forceUpdate Alert Modal
          showAlertModal(getForceUpdateModalContent('forceUpdate'));
        } else {
          // show underConstruction Alert Modal
          showAlertModal(getForceUpdateModalContent('underConstruction'));
        }
      } catch (e) {
        /* empty */
      }
    };
    if (forceUpdateFlag) {
      init();
    }
  }, [forceUpdateFlag, showAlertModal]);
  return null;
}
