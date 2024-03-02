// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import PetraAlert from 'core/components/PetraAlert';
import { useAlertModalContext } from 'core/providers/AlertModalProvider';
import React from 'react';
import { SendToWalletSVG } from 'shared/assets/svgs';
import { i18nmock } from 'strings';

interface RenfieldAlertProps {
  onClose: () => void;
  onOk?: () => Promise<void> | void;
  visible: boolean;
}

export default function RenfieldAlert({
  onClose,
  onOk,
  visible,
}: RenfieldAlertProps) {
  const { dismissAlertModal } = useAlertModalContext();
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <PetraAlert
      dismissAlertModal={dismissAlertModal}
      message={i18nmock('general:renfield.description')}
      title={i18nmock('general:renfield.title')}
      visible={visible}
      renderIcon={() => <SendToWalletSVG />}
      buttons={[
        {
          onPress: () => onClose(),
          style: 'cancel',
          text: i18nmock('general:cancel'),
        },
        {
          isLoading,
          onPress: async () => {
            if (onOk) {
              setIsLoading(true);
              await onOk();
              setIsLoading(false);
            }
            onClose();
          },
          text: i18nmock('general:ok'),
        },
      ]}
    />
  );
}
