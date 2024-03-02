// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import PetraAlert, { PetraAlertProps } from 'core/components/PetraAlert';
import React, { useState, useMemo, useCallback } from 'react';
import makeContext from '@petra/core/hooks/makeContext';

export type AlertOptions = Omit<PetraAlertProps, 'visible'>;
export type PetraAlertContentProps = Omit<
  PetraAlertProps,
  'visible' | 'dismissAlertModal'
>;

export interface AlertModalContextValue {
  dismissAlertModal: () => void;
  modalAlertVisible: boolean;
  showAlertModal: (AlertOptions: PetraAlertContentProps) => void;
}

export const [AlertModalContext, useAlertModalContext] =
  makeContext<AlertModalContextValue>('AlertModalContext');

interface AlertModalProviderProps {
  children: JSX.Element;
}
/**
 * Hook for Alert Modal.
 */
export default function AlertModalProvider({
  children,
}: AlertModalProviderProps) {
  const [modalAlertVisible, setAlertModalVisible] = useState<boolean>(false);
  const [modalAlertContent, setAlertModalContent] = useState<
    PetraAlertContentProps | undefined
  >(undefined);

  const showAlertModal = useCallback(
    (modalCont?: PetraAlertContentProps) => {
      setAlertModalContent(modalCont);
      setAlertModalVisible(true);
    },
    [setAlertModalContent, setAlertModalVisible],
  );

  const dismissAlertModal = useCallback(() => {
    setAlertModalContent(undefined);
    setAlertModalVisible(false);
  }, [setAlertModalContent, setAlertModalVisible]);

  const alertModalValue = useMemo(
    () => ({
      dismissAlertModal,
      modalAlertVisible,
      showAlertModal,
    }),
    [dismissAlertModal, modalAlertVisible, showAlertModal],
  );

  return (
    <AlertModalContext.Provider value={alertModalValue}>
      {children}
      <PetraAlert
        {...{ buttons: [], message: '', title: '', ...modalAlertContent }}
        visible={modalAlertVisible}
        dismissAlertModal={dismissAlertModal}
      />
    </AlertModalContext.Provider>
  );
}
