// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import React, { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import QRCode, { QRCodeProps } from './QRCode';

interface AccessibleQRCodeProps extends QRCodeProps {}

function AccessibleQRCode({
  backgroundColor,
  value,
  ...props
}: AccessibleQRCodeProps) {
  const [initialBrightness, setInitialBrightness] = useState<number>();

  useEffect(() => {
    // set the brightness to 100% when the QR code is displayed
    if (initialBrightness === undefined) {
      DeviceInfo.getBrightness().then((brightness) => {
        setInitialBrightness(brightness);
        DeviceBrightness.setBrightnessLevel(1);
      });
    }

    // reset the brightness to the original value when the QR code is unmounted.
    return () => {
      if (initialBrightness !== undefined) {
        DeviceBrightness.setBrightnessLevel(initialBrightness);
      }
    };
  }, [initialBrightness]);

  // Component forked from react-native-qrcode-svg to add custom styles
  return <QRCode backgroundColor={backgroundColor} value={value} {...props} />;
}

export default AccessibleQRCode;
