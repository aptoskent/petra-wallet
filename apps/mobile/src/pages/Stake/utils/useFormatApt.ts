// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useCoinGecko } from '@petra/core/hooks/useCoinGecko';
import { formatAmount } from '@petra/core/utils/coin';
import {
  computeFiatDollarValue,
  fiatDollarValueDisplay,
} from 'pages/Assets/Shared/utils';
import { APTOS_COIN_INFO } from 'shared/constants';

export function useFormatApt(amount: string, decimals?: number) {
  const { aptosPriceInfo } = useCoinGecko();

  let usd;
  if (aptosPriceInfo?.currentPrice == null) {
    usd = '';
  } else {
    usd = computeFiatDollarValue(
      aptosPriceInfo?.currentPrice ?? '0',
      {
        balance: BigInt(0),
        info: APTOS_COIN_INFO,
        logoUrl: undefined,
        type: '',
      },
      BigInt(amount),
    );
    usd = fiatDollarValueDisplay(`${usd}`);
  }

  const coin = formatAmount(Number(amount), APTOS_COIN_INFO, {
    decimals: typeof decimals === 'number' ? decimals : 8,
    prefix: false,
  });

  return { coin, usd };
}

export default useFormatApt;
