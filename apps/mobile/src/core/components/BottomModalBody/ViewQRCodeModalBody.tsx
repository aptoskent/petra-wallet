// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';

import { customColors } from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import Typography from 'core/components/Typography';
import useSearchContacts from 'core/hooks/useSearchContacts';
import { usePrompt } from 'core/providers/PromptProvider';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import { handleOnCopyPress } from 'core/utils/helpers';
import { encodeQRCode } from 'core/utils/scanner';
import { Dimensions, Share, StyleSheet, View } from 'react-native';
import { petraQrLogo } from 'shared/assets/images';
import CopyIcon24SVG from 'shared/assets/svgs/copy_icon';
import { PADDING, isShortScreen } from 'shared/constants';
import { addressDisplay } from 'shared/utils';
import { i18nmock } from 'strings';
import AccessibleQRCode from '../AccessibleQRCode';
import PetraPillButton, { PillButtonDesign } from '../PetraPillButton';

const { width: windowWidth } = Dimensions.get('window');

// if the screen is short then the qr logo will only be half the width if it is tall then it will
// be 2/3rds the width.
const qrSize = isShortScreen ? windowWidth / 2 : windowWidth / 1.5;

function ViewQRCodeModalBody() {
  const { activeAccount, activeAccountAddress } = useActiveAccount();
  // generate a Contact object for searching for an ANS name
  const contact = useMemo(
    () => [{ address: activeAccountAddress }],
    [activeAccountAddress],
  );

  // with the generated contact (see above), use the useSearchContacts hook to find if the user
  // has an ANS name associated with their account
  const { result: activeAccountAptName } = useSearchContacts(contact);

  // either display the user's ANS name (preferred), default to their user generated account name
  // (secondary) or if they have neither, show their address
  const activeAccountIdentity = activeAccountAptName[0].name
    ? activeAccountAptName[0].name
    : activeAccount.name;
  const { showSuccessToast } = usePetraToastContext();
  const { setPromptVisible } = usePrompt();
  const onShare = () => {
    Share.share({
      title: i18nmock('general:scanner.shareMessage'),
      url: encodeQRCode(activeAccountAddress).toLocaleLowerCase(),
    });
  };
  return (
    <View style={styles.bottomSheetContainer}>
      <Typography
        variant="body"
        color={customColors.navy['500']}
        style={styles.spacingAbove}
      >
        {i18nmock('general:scanner.shareMessage')}
      </Typography>
      <View style={styles.spacingAbove}>
        <AccessibleQRCode
          value={activeAccountAddress}
          color={customColors.navy['900']}
          backgroundColor="white"
          logo={petraQrLogo}
          logoSize={Math.round(qrSize * 0.2)}
          size={Math.round(qrSize)}
          logoBackgroundColor="white"
        />
      </View>
      <Typography style={styles.spacingAbove} variant="bodyLarge">
        {activeAccountIdentity}
      </Typography>
      <Typography
        style={styles.spacingAbove}
        variant="body"
        color={customColors.navy['500']}
      >
        {addressDisplay(activeAccountAddress)}
      </Typography>
      <View style={[styles.container, styles.spacingAbove]}>
        <PetraPillButton
          containerStyleOverride={styles.buttonStyle}
          onPress={handleOnCopyPress({
            message: activeAccountAddress,
            setPromptVisible,
            showSuccessToast,
          })}
          leftIcon={() => <CopyIcon24SVG color={customColors.navy['900']} />}
          text={i18nmock('settings:accountAddressPopover.copyAddress')}
          buttonDesign={PillButtonDesign.clearWithDarkText}
        />
        <View style={styles.spacingAbove} />
        <PetraPillButton
          containerStyleOverride={{
            ...styles.leftButton,
            ...styles.buttonStyle,
          }}
          text={i18nmock('general:scanner.share')}
          onPress={onShare}
        />
      </View>
    </View>
  );
}

export default ViewQRCodeModalBody;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonStyle: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  leftButton: {
    marginLeft: PADDING.container,
  },
  spacingAbove: {
    marginTop: 20,
    textAlign: 'center',
  },
});
