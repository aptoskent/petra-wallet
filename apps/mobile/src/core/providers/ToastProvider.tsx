// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { customColors } from '@petra/core/colors';
import PetraToast, { PetraToastProps } from 'core/components/PetraToast';
import AlertOctagonIconSVG from 'shared/assets/svgs/alert_octagon_icon';
import AlertTriangleIconSVG from 'shared/assets/svgs/alert_triangle_icon';
import InfoCircleconSVG from 'shared/assets/svgs/info_circle_icon';
import SuccessCircleSVG from 'shared/assets/svgs/success_circle_icon';
import makeContext from '@petra/core/hooks/makeContext';

export const [PetraToastContext, usePetraToastContext] =
  makeContext<PetraToastContextValue>('PetraToastContext');

interface ToastProviderProps {
  children: JSX.Element;
}

export type Toast = PetraToastProps & {
  id: number;
  type: string;
};

/*
  A negative number represents the distance from the bottom of screen.
  A positive number represents the distance form the top of screen.
  0 will position the toast to the middle of screen.
*/
export type ToastPosition = 'bottom' | 'bottomWithButton';
export const TOAST_POSITION = {
  bottom: -30,
  bottomWithButton: -100,
};

export type ToastOptions = Omit<Toast, 'icon' | 'id' | 'type' | 'position'> & {
  toastPosition: ToastPosition;
};

export interface PetraToastContextValue {
  showDangerToast: (options: ToastOptions) => void;
  showInfoToast: (options: ToastOptions) => void;
  showSuccessToast: (options: ToastOptions) => void;
  showToast: (options: ToastOptions) => void;
  showWarningToast: (options: ToastOptions) => void;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [activeToast, setActiveToast] = useState<Toast>();
  const [toastsQueue, setToastsQueue] = useState<Toast[]>([]);
  const toastIdRef = React.useRef(0);

  useEffect(() => {
    if (!activeToast) return;

    // after duration elapsed, update the queue
    // by removing the already displayed toast
    const timeoutId = setTimeout(() => {
      setToastsQueue((oldQueue) => oldQueue.slice(1));
    }, activeToast.duration);

    // clean up timeout when component unmount
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutId);
  }, [activeToast]);

  const showNextToast = useCallback(() => {
    // remove the first toast in the queue and display
    const nextToast = toastsQueue.slice(0).shift();

    if (nextToast) {
      setActiveToast(nextToast);
    }
  }, [toastsQueue]);

  useEffect(() => {
    showNextToast();
  }, [showNextToast, toastsQueue]);

  const enqueueToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      // if toast has already been enqueued then don't do anything
      // to avoid showing duplicate toast
      if (toastsQueue.find((t: Toast) => t.text === toast.text) !== undefined) {
        return;
      }

      const newToastId = toastIdRef.current + 1;
      toastIdRef.current = newToastId;

      setToastsQueue((oldQueue) => [
        ...oldQueue,
        {
          ...toast,
          id: newToastId,
        },
      ]);
    },
    [toastsQueue],
  );

  const showDangerToast = useCallback(
    (options: ToastOptions) => {
      enqueueToast({
        ...options,
        icon: <AlertOctagonIconSVG color={customColors.error} />,
        type: 'danger',
      });
    },
    [enqueueToast],
  );

  const showInfoToast = useCallback(
    (options: ToastOptions) => {
      enqueueToast({
        ...options,
        icon: <InfoCircleconSVG color={customColors.navy['500']} />,
        type: 'info',
      });
    },
    [enqueueToast],
  );

  const showSuccessToast = useCallback(
    (options: ToastOptions) => {
      enqueueToast({
        ...options,
        icon: <SuccessCircleSVG color={customColors.green['500']} />,
        type: 'success',
      });
    },
    [enqueueToast],
  );

  const showWarningToast = useCallback(
    (options: ToastOptions) => {
      enqueueToast({
        ...options,
        icon: <AlertTriangleIconSVG color={customColors.orange['600']} />,
        type: 'warning',
      });
    },
    [enqueueToast],
  );

  const showToast = useCallback(
    (options: ToastOptions) => {
      enqueueToast({
        ...options,
        type: 'generic',
      });
    },
    [enqueueToast],
  );

  const toastValue = useMemo(
    () => ({
      showDangerToast,
      showInfoToast,
      showSuccessToast,
      showToast,
      showWarningToast,
    }),
    [
      showDangerToast,
      showInfoToast,
      showSuccessToast,
      showToast,
      showWarningToast,
    ],
  );

  return (
    <PetraToastContext.Provider value={toastValue}>
      {children}
      {activeToast ? (
        <PetraToast
          key={activeToast.id}
          {...activeToast}
          onPress={showNextToast}
        />
      ) : null}
    </PetraToastContext.Provider>
  );
}
