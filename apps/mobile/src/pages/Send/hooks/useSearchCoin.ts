// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useRef, useState } from 'react';
import { AccountCoinResource } from './useAccountCoinResources';

export default function useSearchCoin(
  coinResources: AccountCoinResource[] | undefined,
  debounceTime: number = 500,
) {
  const [result, setResult] = useState(coinResources ?? []);
  const prevQuery = useRef<string>();
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  const updateResult = useCallback(
    (query: string) => {
      prevQuery.current = query;
      const normalizedQuery = query.toLowerCase();

      if (debounceTimer.current !== undefined) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = undefined;
      }

      if (!query || coinResources === undefined) {
        setResult(coinResources ?? []);
        return;
      }

      const exactMatch = coinResources.find(
        ({ info }) =>
          info.name.toLowerCase() === normalizedQuery ||
          info.symbol.toLowerCase() === normalizedQuery,
      );
      if (exactMatch !== undefined) {
        setResult([exactMatch]);
        return;
      }

      debounceTimer.current = setTimeout(() => {
        const matches = coinResources.filter(
          ({ info }) =>
            info.name.toLowerCase().includes(normalizedQuery) ||
            info.symbol.toLowerCase().includes(normalizedQuery),
        );
        setResult(matches);
      }, debounceTime);
    },
    [coinResources, debounceTime],
  );

  // Update results if the available coins change
  useEffect(() => {
    void updateResult(prevQuery.current ?? '');
  }, [coinResources, updateResult]);

  return {
    onQueryChange: updateResult,
    result,
  };
}
