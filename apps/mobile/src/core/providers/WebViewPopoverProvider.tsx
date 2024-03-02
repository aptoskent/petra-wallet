// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Typography from 'core/components/Typography';
import React, { useCallback, useRef, useState } from 'react';
import constate from 'constate';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { customColors } from '@petra/core/colors';
import {
  PetraBottomSheet,
  PetraBottomSheetHeader,
} from 'core/components/PetraBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const snapPoints = ['95%'];

interface WebviewPopoverState {
  title?: string;
  uri: string;
}

const [Provider, useWebViewPopover] = constate(() => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [state, setState] = useState<WebviewPopoverState | null>(null);

  const dismiss = useCallback(() => {
    modalRef.current?.dismiss();
    setState(null);
  }, []);

  const openUri = useCallback((s: WebviewPopoverState) => {
    setState(s);
    modalRef.current?.present();
  }, []);

  return {
    dismiss,
    modalRef,
    openUri,
    state,
  };
});

function WebViewPopover() {
  const { modalRef, state } = useWebViewPopover();

  return (
    <PetraBottomSheet modalRef={modalRef} snapPoints={snapPoints}>
      <PetraBottomSheetHeader showHandle={false} showCloseButton>
        <Typography weight="600" numberOfLines={1}>
          {state?.title}
        </Typography>
      </PetraBottomSheetHeader>
      <View style={styles.container}>
        <WebView
          source={{ uri: state?.uri ?? '' }}
          domStorageEnabled
          allowsBackForwardNavigationGestures
        />
      </View>
    </PetraBottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: customColors.white,
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});

function WebViewPopoverProvider({ children }: React.PropsWithChildren) {
  return (
    <Provider>
      <WebViewPopover />
      {children}
    </Provider>
  );
}

export { useWebViewPopover, WebViewPopoverProvider };
