// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Image, Linking, Platform, StyleSheet } from 'react-native';
import { errorIcon, successIcon } from 'shared/assets/images';
import { APPSTORE_LINK, PLAYSTORE_LINK } from 'shared/constants';
import LockIllustratedIconSvg from 'shared/assets/svgs/lock_illustrated_icon';
import { customColors } from '@petra/core/colors';
import { i18nmock } from 'strings';
import { SendToWalletSVG } from 'shared/assets/svgs';
import { PetraAlertContentProps } from 'core/providers/AlertModalProvider';
import MnemonicPhraseHowToInstructionContent from './MnemonicPhraseHowToInstructionContent';

type ActionFunction = () => void;

const download = () => {
  Linking.openURL(Platform.OS === 'ios' ? APPSTORE_LINK : PLAYSTORE_LINK);
};

export const getForceUpdateModalContent = (
  modalType: 'underConstruction' | 'forceUpdate',
): PetraAlertContentProps => ({
  buttons:
    modalType === 'underConstruction'
      ? []
      : [{ onPress: download, text: 'Update' }],
  message: i18nmock(`settings:${modalType}.description`),
  renderIcon: () => (
    <Image
      source={modalType === 'underConstruction' ? errorIcon : successIcon}
      style={{ height: 100, width: 100 }}
    />
  ),
  title: i18nmock(`settings:${modalType}.title`),
});

export const getKeepRecoveryPhraseSafeModal = (
  onConfirm: ActionFunction,
  dismissAlertModal: ActionFunction,
): PetraAlertContentProps => ({
  buttons: [
    {
      onPress: onConfirm,
      testId: 'recovery-phrase-modal-saved',
      text: i18nmock(
        'onboarding:recoveryPhrase.keepRecoveryPhraseSafeModal.haveSavedRecoveryPhrase',
      ),
    },
    {
      onPress: dismissAlertModal,
      style: 'cancel',
      testId: 'recovery-phrase-modal-show-again',
      text: i18nmock(
        'onboarding:recoveryPhrase.keepRecoveryPhraseSafeModal.showPhraseAgain',
      ),
    },
  ],
  dismissable: true,
  headerStyle: styles.title,
  message: i18nmock(
    'onboarding:recoveryPhrase.keepRecoveryPhraseSafeModal.body',
  ),
  renderIcon: () => <LockIllustratedIconSvg />,
  stackButtons: true,
  title: i18nmock(
    'onboarding:recoveryPhrase.keepRecoveryPhraseSafeModal.title',
  ),
});

export const getResetPasswordContent = (
  handleClearAccounts: ActionFunction,
): PetraAlertContentProps => ({
  buttons: [
    {
      style: 'cancel',
      text: i18nmock('general:cancel'),
    },
    {
      onPress: handleClearAccounts,
      text: i18nmock('general:remove'),
    },
  ],
  dismissable: true,
  headerStyle: styles.title,
  message: i18nmock('onboarding:resetPassword.subtext'),
  stackButtons: true,
  title: i18nmock('onboarding:resetPassword.heading'),
});

export const getRenfieldContent = ({
  isLoading,
  onCancel,
  onPress,
}: {
  isLoading: boolean;
  onCancel?: ActionFunction;
  onPress: ActionFunction;
}): PetraAlertContentProps => ({
  buttons: [
    {
      onPress: onCancel,
      style: 'cancel',
      text: i18nmock('general:cancel'),
    },
    {
      isLoading,
      onPress,
      text: i18nmock('general:ok'),
    },
  ],
  message: i18nmock('general:renfield.description'),
  renderIcon: () => <SendToWalletSVG />,
  title: i18nmock('general:renfield.title'),
});

const styles = StyleSheet.create({
  title: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
});

export const mnemonicPhraseHowToInstructionModal: PetraAlertContentProps = {
  body: MnemonicPhraseHowToInstructionContent,
  buttons: [
    {
      text: i18nmock(
        'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.gotIt',
      ),
    },
  ],
  dismissable: true,
  headerStyle: styles.title,
  message: i18nmock(
    'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.gotIt',
  ),
  title: i18nmock(
    'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.title',
  ),
};
