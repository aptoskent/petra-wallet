// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

/**
 * Spinners attached to un-debounced loading states tend to be jittery.
 * This hook smooths over those fluctuations to make animations smoother.
 *
 * @param loading {boolean} The current loading state
 * @param delay {number=1000} The lag time it takes loading to go from true to false
 * @returns {boolean}
 */
export default function useBufferedLoading(
  loading: boolean,
  delay: number = 500,
) {
  const [timer, setTimer] = useState<NodeJS.Timer | null>(null);
  const [bufferedLoading, setBufferedLoading] = useState(loading);

  function clear() {
    if (timer) {
      clearTimeout(timer);
    }
  }

  function delayedSetBufferedLoading(value: boolean) {
    clear();
    setTimer(
      setTimeout(() => {
        setBufferedLoading(value);
      }, delay),
    );
  }

  useEffect(() => {
    if (!loading && bufferedLoading) {
      delayedSetBufferedLoading(false);
    }

    if (loading && !bufferedLoading) {
      setBufferedLoading(true);
    }

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, bufferedLoading]);

  // There is a lag in setState, and we prefer true over false.
  // Therefore, if either of these loading values are true, we
  // want to be true.
  return bufferedLoading || loading;
}
