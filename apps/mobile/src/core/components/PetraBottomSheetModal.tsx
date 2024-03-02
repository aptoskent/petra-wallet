// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { customColors } from '@petra/core/colors';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { usePrompt } from 'core/providers/PromptProvider';

export default function PetraBottomSheetModal() {
  const { promptContent, promptVisible, setPromptVisible } = usePrompt();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT', '90%'], []);

  const {
    animatedContentHeight,
    animatedHandleHeight,
    animatedSnapPoints,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setPromptVisible(false);
      } else {
        setPromptVisible(true);
      }
    },
    [setPromptVisible],
  );

  if (promptVisible) {
    bottomSheetModalRef.current?.present();
  } else {
    bottomSheetModalRef.current?.dismiss();
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={animatedSnapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleHeight={animatedHandleHeight}
      handleIndicatorStyle={styles.indicator}
      contentHeight={animatedContentHeight}
      backgroundStyle={styles.background}
    >
      <View style={styles.modalView} onLayout={handleContentLayout}>
        {promptContent}
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    height: '100%',
  },
  indicator: {
    backgroundColor: customColors.navy[200],
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingBottom: 40,
    width: '100%',
  },
});
