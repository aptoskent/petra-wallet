// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

// https://usehooks-ts.com/react-hook/use-interval
export default function useInterval(
  callback: () => void,
  delay: number = 1000,
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    callback();
    const id = setInterval(() => savedCallback.current(), delay);

    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);
}
