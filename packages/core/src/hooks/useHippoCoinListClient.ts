// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { CoinListClient, NetworkType } from '@manahippo/coin-list';
import useHippoNetworkConfig from './useHippoNetworkConfig';

const useHippoCoinListClient = () => {
  const networkConfig = useHippoNetworkConfig();

  const coinListClient = useMemo(
    /**
     * @see https://www.npmjs.com/package/@manahippo/coin-list
     * Getting into the permissioned list requires that you establish enough
     * brand presence and credibility within the Aptos ecosystem first.
     * @see https://github.com/hippospace/aptos-coin-list/blob/main/src/permissioned.json
     * TLDR is we probably want the permissioned list, which is why the boolean is true
     */
    () => new CoinListClient(true, networkConfig?.name as NetworkType),
    [networkConfig?.name],
  );

  return coinListClient;
};

export default useHippoCoinListClient;
