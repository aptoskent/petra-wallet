// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { RawCoinInfoWithLogo } from 'pages/Assets/shared';

export function roundWithDecimals(val: number): string {
  return Number(val).toFixed(2);
}

function numberWithCommas(x: string): string {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function fiatDollarValueDisplay(val: string): string {
  return `$${numberWithCommas(val)}`;
}

export function fiatDollarValueExists(value: string | undefined) {
  return value !== '' && value !== undefined;
}

/**
 * @param currentPrice - string
 * @param aptosCoin - RawCoinInfoWithLogo - contains a user's balance of APT
 * @param amount - bigint value if not calculating
 * the fiat dollar value of all held APT
 */
export function computeFiatDollarValue(
  currentPrice: string,
  aptosCoin: RawCoinInfoWithLogo,
  amount: bigint,
): string {
  const usdValue: number = parseFloat(currentPrice);
  const quantity: number =
    Number(amount) * 10 ** (-1 * aptosCoin.info.decimals);
  const multiplied = usdValue * quantity;

  return Number(multiplied).toFixed(2);
}

/**
 * @param currentPrice - string
 * @param aptosCoin - RawCoinInfoWithLogo - contains a user's balance of APT
 * @param usdAmount - string value of usd
 * @returns the converted apt value from usd
 */
export function computeAptValue(
  currentPrice: string,
  aptosCoin: RawCoinInfoWithLogo,
  usdAmount: string,
): number {
  const usdValue: number = parseFloat(currentPrice);
  const divided = Number(usdAmount) / usdValue;
  const quantity: number =
    Number(divided) * 10 ** (1 * aptosCoin.info.decimals);

  return quantity;
}

export function percentChangeDisplayRounded(
  negPercentChange: boolean,
  percentChange: number,
) {
  return `${negPercentChange ? '' : '+'}${roundWithDecimals(percentChange)}%`;
}

export function heroAptQuantity(
  persistedAptDisplayByAccount: string | undefined,
  quantityDisplay: string | undefined,
): string {
  // if the current quantity of APT is unknown or is equal to zero
  // fall back to the persisted (last known) value
  if (quantityDisplay === undefined || quantityDisplay === '0') {
    return persistedAptDisplayByAccount === undefined
      ? '0'
      : persistedAptDisplayByAccount;
  }
  return quantityDisplay;
}
