// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable import/no-extraneous-dependencies */
import {
  Camera,
  CameraPermissionRequestResult,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  Barcode,
  BarcodeFormat,
  scanBarcodes,
} from 'vision-camera-code-scanner';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import { runOnJS } from 'react-native-reanimated';
import AllowCameraPermissionInstructions from 'core/components/AllowCameraPermissionInstructions';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';
import QRCodeIconSVG from 'shared/assets/svgs/qr_code_icon';
import QRMask from 'shared/assets/svgs/QRMask';
import { handleOnViewQRPress } from 'core/utils/helpers';
import { usePrompt } from 'core/providers/PromptProvider';
import ScannerHeader from 'core/components/ScannerHeader';
import { customColors } from '@petra/core/colors';
import ScanQRCodeFrameSVG from 'shared/assets/svgs/scan_qr_frame';
import { useDeeplink } from 'core/providers/DeeplinkProvider';
import { formatAddress, isAddressValid } from '@petra/core/utils/address';
import { encodeQRCode } from 'core/utils/scanner';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { deeplinkEvents } from '@petra/core/utils/analytics/events';

const { width: screenWidth } = Dimensions.get('screen');
const size = 280;
const centerAlign = Math.round((screenWidth - size) / 2);

type ScannerProps = RootAuthenticatedStackScreenProps<'Scanner'>;

export default function Scanner({ navigation }: ScannerProps) {
  const devices = useCameraDevices();
  const { showPrompt } = usePrompt();
  const { deeplink } = useDeeplink();
  const { trackEvent } = useTrackEvent();
  const [cameraPermission, setCameraPermission] =
    React.useState<CameraPermissionRequestResult>();
  const camera = useRef<Camera>(null);
  const [barcode, setBarcode] = useState<Barcode>();
  const [registeredBarcode, setRegisteredBarcode] = useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermission(status);
    })();
  }, []);

  React.useEffect(() => {
    const openURL = async (url: string) => {
      Linking.openURL(url).catch((res) => {
        void trackEvent({
          eventType: deeplinkEvents.ERROR_REDIRECT_SEND,
          params: { url },
        });
        Alert.alert(i18nmock('general:scanner.invalidQRCode'), res.message, [
          {
            onPress: () => {
              setBarcode(undefined);
              setRegisteredBarcode(false);
            },
            text: i18nmock('general:ok'),
          },
        ]);
      });
    };
    if (barcode && !registeredBarcode) {
      Vibration.vibrate();
      setRegisteredBarcode(true);
      if (barcode.rawValue) {
        let url: string = barcode.rawValue?.toLocaleLowerCase();
        if (isAddressValid(barcode.rawValue?.toLocaleLowerCase())) {
          const address = barcode.rawValue.toLocaleLowerCase();
          url = encodeQRCode(formatAddress(address)).toLocaleLowerCase();
        }
        openURL(url);
      }
    }
  }, [barcode, deeplink, deeplink?.receive, registeredBarcode, trackEvent]);

  React.useEffect(() => {
    if (barcode?.rawValue && deeplink?.error) {
      setBarcode(undefined);
      setRegisteredBarcode(false);
    }
  }, [barcode, deeplink, deeplink?.error]);

  React.useEffect(() => {
    if (cameraPermission === 'authorized' && devices.back) {
      navigation.setOptions({
        header: () => <ScannerHeader />,
      });
    } else {
      navigation.setOptions({
        header: () => (
          <ScannerHeader color={customColors.black} showInfo={false} />
        ),
      });
    }
  }, [devices.back, cameraPermission, navigation]);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      if (!barcode) {
        const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], {
          checkInverted: true,
        });
        if (detectedBarcodes[0]) {
          // When a barcode is detected on the frame we take the first barcode that is
          // detected on the frame.
          runOnJS(setBarcode)(detectedBarcodes[0]);
        }
      }
    },
    [barcode],
  );

  if (!cameraPermission || !devices.back) {
    return null;
  }
  return cameraPermission === 'authorized' && devices.back ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={devices.back}
          isActive
          frameProcessor={frameProcessor}
          frameProcessorFps={300}
        />
        <View style={styles.overlay} />
        <View style={{ aspectRatio: 1 }}>
          <QRMask />
          <View style={styles.qrContainer}>
            <ScanQRCodeFrameSVG />
          </View>
        </View>
        <View style={[styles.bottomContainer, styles.overlay]}>
          <PetraPillButton
            onPress={handleOnViewQRPress({
              showPrompt,
              trackEvent,
            })}
            text={i18nmock('general:scanner.showQR')}
            leftIcon={() => <QRCodeIconSVG />}
            buttonDesign={PillButtonDesign.clearWithDarkText}
          />
        </View>
      </View>
    </SafeAreaView>
  ) : (
    <AllowCameraPermissionInstructions />
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    justifyContent: 'flex-end',
    padding: PADDING.container,
  },
  container: {
    flex: 1,
  },
  overlay: {
    backgroundColor: customColors.blackOpacity.fiftyPercent,
    flex: 1,
  },
  qrContainer: {
    height: size,
    left: centerAlign,
    position: 'absolute',
    top: centerAlign,
    width: size,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
