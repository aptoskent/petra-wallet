// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetModalInternal,
} from '@gorhom/bottom-sheet';
import React, {
  PropsWithChildren,
  RefObject,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { PetraBottomSheetContext } from './PetraBottomSheetContext';

export type PetraBottomSheetProps = PropsWithChildren<{
  enablePanDownToClose?: boolean;
  isDismissable?: boolean;
  modalRef: RefObject<BottomSheetModal>;
  onDismiss?: () => void;
  snapPoints?: string[];
}>;

// We're computing the snap point dynamically, and we allow it to grow
// up to the 90% of the container height.
const defaultSnapPoints = ['CONTENT_HEIGHT'];
const maxHeightRatio = 0.9;

type BottomSheetBackdropProps = Parameters<typeof BottomSheetBackdrop>[0];

/**
 * Modal implemented as modal bottom sheet.
 * Use this for displaying focused content while blocking interaction with the rest of the app.
 * Since this is a bottom sheet, the user can partially swipe down and peek at the content below.
 */
export default function PetraBottomSheet({
  children,
  enablePanDownToClose,
  snapPoints = defaultSnapPoints,
  isDismissable = true,
  ...props
}: PetraBottomSheetProps) {
  const { modalRef, onDismiss } = props;

  // Create a dynamic style for setting the max height
  // relative to the container height.
  const { containerHeight } = useBottomSheetModalInternal();
  const animatedStyle = useAnimatedStyle(
    () => ({
      maxHeight: containerHeight.value * maxHeightRatio,
    }),
    [containerHeight],
  );

  // Compute the snap points dynamically depending on the content height
  // which is cropped to a percentage of the container height.
  const {
    animatedContentHeight,
    animatedHandleHeight,
    animatedSnapPoints,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  // Extrapolating overflow status into a React state
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  useAnimatedReaction(
    () => animatedContentHeight.value >= containerHeight.value * maxHeightRatio,
    (value) => runOnJS(setIsOverflowing)(value),
    [maxHeightRatio],
  );

  const contextValue = useMemo(
    () => ({ ...props, isOverflowing }),
    [props, isOverflowing],
  );

  const Backdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        pressBehavior={isDismissable ? 'close' : 'none'}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [isDismissable],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      onDismiss={onDismiss}
      backdropComponent={Backdrop}
      handleStyle={styles.handle}
      enableContentPanningGesture={enablePanDownToClose ?? isDismissable}
      enablePanDownToClose={enablePanDownToClose ?? isDismissable}
    >
      <PetraBottomSheetContext.Provider value={contextValue}>
        <Animated.View style={animatedStyle} onLayout={handleContentLayout}>
          {children}
        </Animated.View>
      </PetraBottomSheetContext.Provider>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  handle: {
    display: 'none',
  },
});
