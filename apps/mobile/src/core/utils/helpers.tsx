// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Clipboard from '@react-native-clipboard/clipboard';
import ViewQRCodeModalBody from 'core/components/BottomModalBody/ViewQRCodeModalBody';
import BottomSheetModalContent from 'core/components/BottomSheetModalContent';
import { ToastOptions } from 'core/providers/ToastProvider';
import React from 'react';
import { i18nmock } from 'strings';
import { deeplinkEvents } from '@petra/core/utils/analytics/events';
import { AnalyticsEventParams } from 'core/hooks/useTrackEvent';
import SensitiveClipboard from './sensitiveClipboard';

type HandleOnCopyPressProps = {
  duration?: number;
  message: string;
  setPopoverVisible?: (arg0: boolean) => void;
  setPromptVisible?: (arg0: boolean) => void;
  showSuccessToast: (options: ToastOptions) => void;
  successToastMessage?: string;
};

type HandleOnViewQRPressProps = {
  showPrompt: (arg0: JSX.Element) => void;
  trackEvent: ({ eventType, params }: AnalyticsEventParams) => void;
};

export const handleOnCopyPress =
  ({
    message,
    setPopoverVisible,
    setPromptVisible,
    showSuccessToast,
    successToastMessage = i18nmock('assets:toast.copyAddress'),
    duration,
  }: HandleOnCopyPressProps) =>
  () => {
    if (duration) {
      SensitiveClipboard.setString(message, duration);
    } else {
      Clipboard.setString(message);
    }

    showSuccessToast({
      hideOnPress: true,
      text: successToastMessage,
      toastPosition: 'bottom',
    });
    setPromptVisible?.(false);
    setPopoverVisible?.(false);
  };

export const handleOnViewQRPress =
  ({ showPrompt, trackEvent }: HandleOnViewQRPressProps) =>
  () => {
    void trackEvent({
      eventType: deeplinkEvents.SHOW_ADDRESS_QR_CODE,
    });
    showPrompt(
      <BottomSheetModalContent
        title={i18nmock('general:scanner.myQRCode')}
        body={<ViewQRCodeModalBody />}
      />,
    );
  };
