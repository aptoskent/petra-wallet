// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import makeContext from '@petra/core/hooks/makeContext';
import { RefObject } from 'react';

export interface PetraBottomSheetContextValue {
  isOverflowing: boolean;
  modalRef: RefObject<BottomSheetModal>;
  onDismiss?: () => void;
}

export const [PetraBottomSheetContext, usePetraBottomSheetContext] =
  makeContext<PetraBottomSheetContextValue>('PetraBottomSheetContext');
