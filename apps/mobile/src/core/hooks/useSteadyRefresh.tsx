// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

const useSteadyRefresh = (
  refetch: any,
): [isRefreshing: boolean, refresh: () => Promise<void>] => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  return [isRefreshing, refresh];
};

export default useSteadyRefresh;
