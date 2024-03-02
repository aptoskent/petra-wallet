// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { handleOnCopyPress, handleOnViewQRPress } from 'core/utils/helpers';
import Typography from 'core/components/Typography';
import CopyIcon24SVG from 'shared/assets/svgs/copy_icon';
import QRCodeIconSVG from 'shared/assets/svgs/qr_code_icon';
import PetraPillButton, {
  PillButtonDesign,
} from 'core/components/PetraPillButton';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { customColors } from '@petra/core/colors';
import { i18nmock } from 'strings';
import { StyleSheet, View } from 'react-native';
import { usePrompt } from 'core/providers/PromptProvider';
import { useFlag } from '@petra/core/flags';
import useTrackEvent from 'core/hooks/useTrackEvent';

function RecieveModalBody() {
  const { activeAccountAddress } = useActiveAccount();
  const { showSuccessToast } = usePetraToastContext();
  const { setPromptVisible, showPrompt } = usePrompt();
  const { trackEvent } = useTrackEvent();
  const isQrSupportEnabled = useFlag('qr-support');
  return (
    <View style={styles.bottomSheetContainer}>
      <PetraPillButton
        onPress={handleOnCopyPress({
          message: activeAccountAddress,
          setPromptVisible,
          showSuccessToast,
        })}
        leftIcon={() => <CopyIcon24SVG color={customColors.navy['900']} />}
        text={i18nmock('settings:accountAddressPopover.copyAddress')}
        buttonDesign={PillButtonDesign.clearWithDarkText}
      />
      {isQrSupportEnabled ? (
        <View style={styles.spacingAbove}>
          <PetraPillButton
            onPress={handleOnViewQRPress({
              showPrompt,
              trackEvent,
            })}
            leftIcon={() => <QRCodeIconSVG color={customColors.navy['900']} />}
            text={i18nmock('settings:accountAddressPopover.qrCode')}
            buttonDesign={PillButtonDesign.clearWithDarkText}
          />
        </View>
      ) : null}
      <Typography
        style={styles.spacingAbove}
        variant="small"
        color={customColors.navy['600']}
      >
        {i18nmock('assets:receive.description')}
      </Typography>
    </View>
  );
}

export default RecieveModalBody;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  spacingAbove: {
    marginTop: 20,
    textAlign: 'center',
  },
});
